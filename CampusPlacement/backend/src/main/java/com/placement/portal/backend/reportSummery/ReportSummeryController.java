package com.placement.portal.backend.reportSummery;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportSummeryController {

    private final ReportSummeryService reportService;

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'PLACEMENT_OFFICER')")
    public ResponseEntity<PlacementSummaryDto> getSummaryReport() {
        return ResponseEntity.ok(reportService.getPlacementSummary());
    }

    @GetMapping("/company-wise")
    @PreAuthorize("hasAnyRole('ADMIN', 'PLACEMENT_OFFICER')")
    public ResponseEntity<List<CompanySummeryDto>> getCompanyWiseReport() {
        return ResponseEntity.ok(reportService.getCompanyWiseReport());
    }

    @GetMapping("/department-wise")
    @PreAuthorize("hasAnyRole('ADMIN', 'PLACEMENT_OFFICER')")
    public ResponseEntity<List<DepartmentSummeryDto>> getDepartmentWiseReport() {
        return ResponseEntity.ok(reportService.getDepartmentWiseReport());
    }

    @GetMapping("/student-wise")
    @PreAuthorize("hasAnyRole('ADMIN', 'PLACEMENT_OFFICER')")
    public ResponseEntity<List<StudentSummeryDto>> getStudentWiseReport() {
        return ResponseEntity.ok(reportService.getStudentWiseReport());
    }
}

