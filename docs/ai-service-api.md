# EduBridge AI Service - API

Base URL (local): http://127.0.0.1:8001

## GET /
Health check. Returns {"message": "...", "module": "Document Ingestion"}.

## POST /api/documents/upload
Upload a PDF, DOCX or PPTX (max 20 MB) as multipart form field `file`.

### Success (200)
{
  "success": true,
  "document_id": "uuid",
  "message": "...",
  "filename": "good.pdf",
  "file_type": "pdf",
  "total_sections": 2,
  "sections": [{"page": 1, "text": "..."}],
  "full_text": "..."
}
Notes: PDF sections use `page`, PPTX sections use `slide`,
DOCX returns one section with `page: null`.

### Errors (JSON: {"detail": "message"})
- 400: unsupported type, empty file, no readable text,
       password-protected, corrupted or fake file
- 413: file larger than 20 MB
- 500: unexpected server error
