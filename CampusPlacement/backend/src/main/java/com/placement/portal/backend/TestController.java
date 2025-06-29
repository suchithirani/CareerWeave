package com.placement.portal.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public ResponseEntity<String> testAdmin() {
        return ResponseEntity.ok("✅ Admin access successful!");
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/student")
    public ResponseEntity<String> testStudent() {
        return ResponseEntity.ok("✅ Student access successful!");
    }

    @PreAuthorize("hasRole('COMPANY_HR')")
    @GetMapping("/company-hr")
    public ResponseEntity<String> testCompanyHr() {
        return ResponseEntity.ok("✅ Company HR access successful!");
    }

    @PreAuthorize("hasRole('PLACEMENT_OFFICER')")
    @GetMapping("/placement-officer")
    public ResponseEntity<String> testPlacementOfficer() {
        return ResponseEntity.ok("✅ Placement Officer access successful!");
    }
}
