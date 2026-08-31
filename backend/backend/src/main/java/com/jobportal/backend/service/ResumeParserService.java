package com.jobportal.backend.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ResumeParserService {

    public String extractText(MultipartFile file) throws IOException {

        String fileName = file.getOriginalFilename();

        if (fileName == null) {
            throw new IllegalArgumentException("File name is missing");
        }

        String lowerCaseFileName = fileName.toLowerCase();

        if (lowerCaseFileName.endsWith(".pdf")) {
            return extractPdfText(file);
        }

        if (lowerCaseFileName.endsWith(".docx")) {
            return extractDocxText(file);
        }

        throw new IllegalArgumentException(
                "Unsupported file type. Please upload PDF or DOCX."
        );
    }

    private String extractPdfText(MultipartFile file) throws IOException {

        try (PDDocument document = Loader.loadPDF(file.getBytes())) {

            PDFTextStripper stripper = new PDFTextStripper();

            return stripper.getText(document);
        }
    }

    private String extractDocxText(MultipartFile file) throws IOException {

        try (XWPFDocument document =
                     new XWPFDocument(file.getInputStream())) {

            StringBuilder text = new StringBuilder();

            document.getParagraphs().forEach(paragraph -> {
                text.append(paragraph.getText());
                text.append("\n");
            });

            return text.toString();
        }
    }
}