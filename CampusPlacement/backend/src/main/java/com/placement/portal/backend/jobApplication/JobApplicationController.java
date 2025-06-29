package com.placement.portal.backend.jobApplication;

import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/job-applications")
public class JobApplicationController {

    @Autowired
    private JobApplicationService jobApplicationService;

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping
    public ResponseEntity<JobApplicationDto> createApplication(@RequestBody JobApplicationDto dto) {
        JobApplicationDto created = jobApplicationService.createApplication(dto);
        return ResponseEntity.ok(created);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('COMPANY_HR') or hasRole('PLACEMENT_OFFICER')")
    @GetMapping
    public List<JobApplicationDto> getAllApplications() {
        return jobApplicationService.getAllApplications();
    }

    @PreAuthorize("hasRole('COMPANY_HR')")
    @GetMapping("/hr")
    public ResponseEntity<List<JobApplicationDto>> getApplicationsForCurrentHR(@RequestHeader("Authorization") String token) {
        List<JobApplicationDto> apps = jobApplicationService.getApplicationsForCurrentHR(token);
        return ResponseEntity.ok(apps);
    }


    @PreAuthorize("hasRole('ADMIN') or hasRole('STUDENT')")
    @GetMapping("/{id}")
    public ResponseEntity<JobApplicationDto> getApplicationById(@PathVariable Long id) {
        JobApplicationDto dto = jobApplicationService.getApplicationById(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('COMPANY_HR')")
    @PutMapping("/{id}/status")
    public ResponseEntity<JobApplicationDto> updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        JobApplicationStatus enumStatus;
        try {
            enumStatus = JobApplicationStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);  // invalid status
        }

        JobApplicationDto updated = jobApplicationService.updateApplicationStatus(id, enumStatus);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }



    // New endpoint to update interview and other details
    @PreAuthorize("hasRole('ADMIN') or hasRole('COMPANY_HR')")
    @PutMapping("/{id}")
    public ResponseEntity<JobApplicationDto> updateApplicationDetails(
            @PathVariable Long id,
            @RequestBody JobApplicationDto dto) {

        JobApplicationDto updated = jobApplicationService.updateApplicationDetails(id, dto);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        jobApplicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('COMPANY_HR')")
    public ResponseEntity<List<JobApplicationDto>> getApplicationsByJobId(
            @PathVariable @Min(1) Long jobId) {

        List<JobApplicationDto> apps = jobApplicationService.getApplicationsByJobOpeningId(jobId);
        return ResponseEntity.ok(apps);
    }

    @PreAuthorize("hasRole('COMPANY_HR')")
    @GetMapping("/hr/pipeline")
    public ResponseEntity<Map<JobApplicationStatus, List<JobApplicationDto>>> getHrPipeline(
            @RequestHeader("Authorization") String token) {
        Map<JobApplicationStatus, List<JobApplicationDto>> pipeline =
                jobApplicationService.getApplicationsGroupedByStatusForCurrentHR(token);
        return ResponseEntity.ok(pipeline);
    }

    @GetMapping("/officer")
    @PreAuthorize("hasRole('PLACEMENT_OFFICER')")
    public ResponseEntity<List<JobApplicationDto>> getApplicationsForOfficer(@RequestHeader("Authorization") String token) {
        List<JobApplicationDto> dtos = jobApplicationService.getApplicationsForOfficer(token);
        return ResponseEntity.ok(dtos);
    }




    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/me")
    public ResponseEntity<List<JobApplicationDto>> getMyApplications(@RequestHeader("Authorization") String token) {
        List<JobApplicationDto> apps = jobApplicationService.getApplicationsByCurrentStudent(token);
        return ResponseEntity.ok(apps);
    }



}
