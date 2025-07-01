package com.placement.portal.backend.officerCompanyAssign;

import com.placement.portal.backend.company.Company;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/co")
@RequiredArgsConstructor
public class OfficerCompanyController {

    private final OfficerCompanyService officerCompanyService;

    @PostMapping("/assign/{companyId}")
    @PreAuthorize("hasRole('PLACEMENT_OFFICER')")
    public ResponseEntity<?> assign(@RequestHeader("Authorization") String token,
                                    @PathVariable Long companyId) {
        officerCompanyService.assignCompany(token, companyId);
        return ResponseEntity.ok("Company assigned successfully");
    }

    @DeleteMapping("/unassign/{companyId}")
    @PreAuthorize("hasRole('PLACEMENT_OFFICER')")
    public ResponseEntity<?> unassign(@RequestHeader("Authorization") String token,
                                      @PathVariable Long companyId) {
        officerCompanyService.unassignCompany(token, companyId);
        return ResponseEntity.ok("Company unassigned successfully");
    }

    @GetMapping("/officer-companies")
    @PreAuthorize("hasRole('PLACEMENT_OFFICER')")
    public ResponseEntity<List<Company>> getOfficerCompanies(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(officerCompanyService.getAssignedCompanies(token));
    }

    @GetMapping("/officer-company-assignments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OfficerCompanyDto>> getAllOfficerCompanyAssignments() {
        return ResponseEntity.ok(officerCompanyService.getAllAssignmentsForAdmin());
    }

}
