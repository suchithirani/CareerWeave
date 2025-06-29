package com.placement.portal.backend.jobOpening;

import com.placement.portal.backend.auth.User;
import com.placement.portal.backend.auth.UserRepository;
import com.placement.portal.backend.company.Company;
import com.placement.portal.backend.officerCompanyAssign.OfficerCompanyService;
import com.placement.portal.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/job-openings")
public class JobOpeningController {

    @Autowired
    private JobOpeningService jobOpeningService;

    @Autowired
    private JobOpeningRepository jobOpeningRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OfficerCompanyService officerCompanyService;

    @GetMapping
    public List<JobOpening> getAll() {
        return jobOpeningService.getAllJobOpenings();
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobOpening> getById(@PathVariable Long id) {
        return jobOpeningService.getJobOpeningById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_HR')")
    @PostMapping
    public ResponseEntity<JobOpening> create(@RequestBody JobOpeningDto dto,
                                             @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(jobOpeningService.createJobOpening(dto, token));
    }


    @PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_HR')")
    @PutMapping("/{id}")
    public ResponseEntity<JobOpening> update(@PathVariable Long id, @RequestBody JobOpeningDto dto) {
        JobOpening updated = jobOpeningService.updateJobOpening(id, dto);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }



    // Updated delete endpoint
        @DeleteMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN') or hasRole('COMPANY_HR')")
        public ResponseEntity<?> deleteJobOpening(@PathVariable Long id) {
            try {
                jobOpeningService.deleteJobOpening(id);
                return ResponseEntity.noContent().build();
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Error deleting job opening: " + e.getMessage());
            }
        }


    @GetMapping("/officer")
    @PreAuthorize("hasRole('PLACEMENT_OFFICER')")
    public ResponseEntity<List<JobOpening>> getJobOpeningsForOfficer(@RequestHeader("Authorization") String token) {
        List<Company> assignedCompanies = officerCompanyService.getAssignedCompanies(token);
        if (assignedCompanies.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        List<Long> companyIds = assignedCompanies.stream()
                .map(Company::getId)
                .toList();

        List<JobOpening> openings = jobOpeningService.getOpeningsForCompanies(companyIds);
        return ResponseEntity.ok(openings);
    }


    @GetMapping("/HR")
    @PreAuthorize("hasRole('COMPANY_HR')")
    public ResponseEntity<List<JobOpening>> getJobOpeningsForHR(@RequestHeader("Authorization") String token) {
        List<JobOpening> dtos = jobOpeningService.getJobOpeningsForCurrentHR(token);
        return ResponseEntity.ok(dtos);
    }


    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_HR')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        Optional<JobOpening> jobOpt = jobOpeningService.getJobOpeningById(id);
        if (jobOpt.isEmpty()) return ResponseEntity.notFound().build();

        JobOpening job = jobOpt.get();
        try {
            job.setStatus(JobOpeningStatus.valueOf(status.toUpperCase()));
            jobOpeningRepository.save(job);
            return ResponseEntity.ok("Status updated to " + status);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status: " + status);
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<JobOpening>> getJobsByStatus(@PathVariable String status) {
        try {
            JobOpeningStatus jobStatus = JobOpeningStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(jobOpeningRepository.findByStatus(jobStatus));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }

}
