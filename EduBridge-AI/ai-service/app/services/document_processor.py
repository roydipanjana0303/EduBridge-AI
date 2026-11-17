import logging
import zipfile
from io import BytesIO
from pathlib import Path

import pymupdf
from docx import Document
from pptx import Presentation

logger = logging.getLogger(__name__)

SUPPORTED_FORMATS = {".pdf", ".docx", ".pptx"}


def validate_content(extension, file_bytes):
    """Check that the file contents match the claimed extension."""

    if extension == ".pdf":
        if b"%PDF-" not in file_bytes[:1024]:
            raise ValueError("This file is not a valid PDF.")
        return

    # DOCX and PPTX files are ZIP archives with specific internal files
    required_file = (
        "word/document.xml" if extension == ".docx"
        else "ppt/presentation.xml"
    )

    try:
        with zipfile.ZipFile(BytesIO(file_bytes)) as archive:
            if required_file not in archive.namelist():
                raise ValueError(
                    f"This file is not a valid {extension.upper()[1:]} document."
                )
    except zipfile.BadZipFile:
        raise ValueError(
            f"This file is not a valid {extension.upper()[1:]} document."
        )


def extract_pdf(file_bytes):
    """Extract text from each PDF page."""
    results = []

    try:
        pdf = pymupdf.open(stream=file_bytes, filetype="pdf")
    except Exception:
        raise ValueError("This PDF is corrupted and cannot be opened.")

    with pdf:
        if pdf.needs_pass:
            raise ValueError(
                "This PDF is password-protected. Please upload an unlocked copy."
            )

        for page_number, page in enumerate(pdf, start=1):
            results.append({
                "page": page_number,
                "text": page.get_text("text").strip()
            })

    return results


def extract_docx(file_bytes):
    """Extract paragraphs and tables from a Word document."""
    document = Document(BytesIO(file_bytes))
    text_parts = []

    for paragraph in document.paragraphs:
        if paragraph.text.strip():
            text_parts.append(paragraph.text.strip())

    for table in document.tables:
        for row in table.rows:
            cells = [cell.text.strip() for cell in row.cells]
            text_parts.append(" | ".join(cells))

    text = "\n".join(text_parts)

    return [{"page": None, "text": text}]


def extract_pptx(file_bytes):
    """Extract text from each PowerPoint slide."""
    presentation = Presentation(BytesIO(file_bytes))
    results = []

    for slide_number, slide in enumerate(presentation.slides, start=1):
        slide_text = []

        for shape in slide.shapes:

            if shape.has_text_frame:
                text = shape.text.strip()
                if text:
                    slide_text.append(text)

            if shape.has_table:
                for row in shape.table.rows:
                    cells = [cell.text.strip() for cell in row.cells]
                    slide_text.append(" | ".join(cells))

        results.append({
            "slide": slide_number,
            "text": "\n".join(slide_text)
        })

    return results


def process_document(filename, file_bytes):
    """Identify document format and extract its text."""

    extension = Path(filename).suffix.lower()

    if extension not in SUPPORTED_FORMATS:
        raise ValueError("Unsupported format. Upload PDF, DOCX or PPTX files.")

    if not file_bytes:
        raise ValueError("The uploaded file is empty.")

    validate_content(extension, file_bytes)

    try:
        if extension == ".pdf":
            sections = extract_pdf(file_bytes)
        elif extension == ".docx":
            sections = extract_docx(file_bytes)
        else:
            sections = extract_pptx(file_bytes)

    except ValueError:
        raise  # our own friendly messages: pass them on unchanged

    except Exception:
        logger.exception("Failed to extract text from %s", filename)
        raise ValueError(
            "Could not read this file. It may be corrupted."
        )

    extracted_text = "\n".join(
        section["text"] for section in sections
    ).strip()

    if not extracted_text:
        raise ValueError(
            "No readable text found. If this is a scanned document, "
            "OCR support is not available yet."
        )

    logger.info(
        "Processed %s: %d sections, %d characters",
        filename, len(sections), len(extracted_text)
    )

    return {
        "filename": filename,
        "file_type": extension.replace(".", ""),
        "total_sections": len(sections),
        "sections": sections,
        "full_text": extracted_text
    }