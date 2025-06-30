package com.placement.portal.backend.jobOffer;

import com.placement.portal.backend.company.Company;
import com.placement.portal.backend.interviewSchedule.InterviewSchedule;
import com.placement.portal.backend.jobOpening.JobOpening;
import com.placement.portal.backend.jobOpening.JobOpeningRepository;
import com.placement.portal.backend.officerCompanyAssign.OfficerCompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/job-offers")
@RequiredArgsConstructor
public class JobOfferController {

    private final JobOfferService jobOfferService;
    private final OfficerCompanyService officerCompanyService;
    private final JobOpeningRepository jobOpeningRepository;



    // Create a new job offer – Only COMPANY_HR
    @PostMapping
    @PreAuthorize("hasRole('COMPANY_HR')")
    public ResponseEntity<JobOfferDto> createOffer(@RequestBody JobOfferDto dto) {
        JobOfferDto saved = jobOfferService.createJobOffer(dto);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/officer")
    @PreAuthorize("hasRole('PLACEMENT_OFFICER')")
    public ResponseEntity<List<JobOfferDto>> getOffersForOfficer(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(jobOfferService.getOffersForOfficer(token));
    }


    // Get all offers sent by the current HR
    @GetMapping("/hr")
    @PreAuthorize("hasRole('COMPANY_HR')")
    public ResponseEntity<List<JobOfferDto>> getOffersByHR(@RequestHeader("Authorization") String token) {
        List<JobOfferDto> offers = jobOfferService.getOffersByHR(token);
        return ResponseEntity.ok(offers);
    }

    @GetMapping("/hr/job-application-ids")
    @PreAuthorize("hasRole('COMPANY_HR')")
    public ResponseEntity<List<Map<String, Object>>> getJobApplicationIdsForHR(@RequestHeader("Authorization") String token) {
        List<Map<String, Object>> apps = jobOfferService.getJobApplicationIdsForHR(token);
        return ResponseEntity.ok(apps);
    }


    // Get all offers received by a student
    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<JobOfferDto>> getOffersForStudent(@RequestHeader("Authorization") String token) {
        List<JobOfferDto> offers = jobOfferService.getOffersForStudent(token);
        return ResponseEntity.ok(offers);
    }

    // Get job offer by ID – Accessible to HR, student, admin
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('COMPANY_HR', 'STUDENT', 'ADMIN')")
    public ResponseEntity<JobOfferDto> getOfferById(@PathVariable Long id) {
        return ResponseEntity.ok(jobOfferService.getOfferById(id));
    }

    // Get all offers – ADMIN only
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<JobOfferDto>> getAllOffers() {
        return ResponseEntity.ok(jobOfferService.getAllOffers());
    }


    // Update job offer – Only COMPANY_HR
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COMPANY_HR')")
    public ResponseEntity<JobOfferDto> updateOffer(@PathVariable Long id, @RequestBody JobOfferDto dto) {
        return ResponseEntity.ok(jobOfferService.updateOffer(id, dto));
    }

    // Student updates status (ACCEPTED / REJECTED)
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String status = request.get("status");
        jobOfferService.updateStatus(id, status);
        return ResponseEntity.ok().build();
    }






    // Delete job offer – Only ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteOffer(@PathVariable Long id) {
        jobOfferService.deleteOffer(id);
        return ResponseEntity.noContent().build();
    }
}
