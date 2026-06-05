package com.futureforge.ai.controller;

import com.futureforge.ai.service.PdfExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Or configure globally
public class ExportController {

    private final PdfExportService pdfExportService;

    @GetMapping("/career-report")
    public ResponseEntity<byte[]> downloadCareerReport() {
        byte[] pdfBytes = pdfExportService.generateCareerReport();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "FutureForge_Career_Report.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
