import logging
import uuid
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.services.document_processor import process_document

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="EduBridge AI Service",
    description="Academic document ingestion service",
    version="1.0.0"
)

# TODO: replace "*" with the real frontend URL once it is decided,
# e.g. ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

MAX_FILE_SIZE = 20 * 1024 * 1024
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".pptx"}


@app.get("/")
def home():
    return {
        "message": "EduBridge AI Service is running!",
        "module": "Document Ingestion"
    }


@app.post("/api/documents/upload")
async def upload_document(file: UploadFile = File(...)):

    extension = Path(file.filename or "").suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOCX and PPTX files are supported."
        )

    file_bytes = await file.read(MAX_FILE_SIZE + 1)

    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="File size exceeds the 20 MB limit."
        )

    if not file_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty."
        )

    document_id = str(uuid.uuid4())
    saved_path = UPLOAD_DIR / f"{document_id}{extension}"

    try:
        result = process_document(file.filename, file_bytes)
        saved_path.write_bytes(file_bytes)

        logger.info("Saved %s as %s", file.filename, saved_path.name)

        return {
            "success": True,
            "document_id": document_id,
            "message": "Document uploaded and processed successfully.",
            **result
        }

    except ValueError as error:
        logger.warning("Rejected %s: %s", file.filename, error)
        raise HTTPException(status_code=400, detail=str(error))

    except Exception:
        logger.exception("Unexpected error processing %s", file.filename)
        raise HTTPException(
            status_code=500,
            detail="Unexpected server error while processing the document."
        )