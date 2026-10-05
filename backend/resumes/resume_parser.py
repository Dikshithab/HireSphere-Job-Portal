from PyPDF2 import PdfReader
from docx import Document


def extract_text_from_resume(file):

    file_name = file.name.lower()

    if file_name.endswith(".pdf"):
        return extract_pdf_text(file)

    elif file_name.endswith(".docx"):
        return extract_docx_text(file)

    else:
        raise ValueError(
            "Only PDF and DOCX files are supported"
        )


def extract_pdf_text(file):

    try:
        reader = PdfReader(file)

        text = ""

        for page in reader.pages:
            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

        return text.strip()

    except Exception as e:
        raise ValueError(
            f"Failed to read PDF: {str(e)}"
        )


def extract_docx_text(file):

    try:
        document = Document(file)

        text = []

        for paragraph in document.paragraphs:
            if paragraph.text.strip():
                text.append(paragraph.text)

        return "\n".join(text).strip()

    except Exception as e:
        raise ValueError(
            f"Failed to read DOCX: {str(e)}"
        )