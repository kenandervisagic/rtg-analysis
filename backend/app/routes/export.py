from fastapi import APIRouter
from fastapi.responses import HTMLResponse, StreamingResponse, JSONResponse
from templates.report_template import render_html
from weasyprint import HTML
from io import BytesIO

router = APIRouter()

@router.post("/export-html", response_class=HTMLResponse)
async def export_html(data: dict):
    try:
        html_content = render_html(data)
        return HTMLResponse(content=html_content, status_code=200)
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"HTML export failed: {str(e)}"})


@router.post("/export-pdf")
async def export_pdf(data: dict):
    try:
        html_content = render_html(data)
        pdf_file = BytesIO()
        HTML(string=html_content).write_pdf(pdf_file)
        pdf_file.seek(0)

        headers = {
            "Content-Disposition": 'attachment; filename="nalaz.pdf"'
        }
        return StreamingResponse(pdf_file, media_type="application/pdf", headers=headers)

    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Export failed: {str(e)}"})
