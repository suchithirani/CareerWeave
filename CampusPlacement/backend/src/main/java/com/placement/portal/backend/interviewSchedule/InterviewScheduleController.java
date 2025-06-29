package com.placement.portal.backend.interviewSchedule;

import com.placement.portal.backend.company.Company;
import com.placement.portal.backend.jobOpening.JobOpening;
import com.placement.portal.backend.jobOpening.JobOpeningRepository;
import com.placement.portal.backend.officerCompanyAssign.OfficerCompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interview-schedules")
public class InterviewScheduleController {

    @Autowired
    private InterviewScheduleService interviewScheduleService;
    @Autowired
    private OfficerCompanyService officerCompanyService;
    @Autowired
    private JobOpeningRepository jobOpeningRepository;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('COMPANY_HR')")
    public ResponseEntity<?> createInterviewSchedule(
            @RequestBody InterviewScheduleDto dto,
            @RequestHeader("Authorization") String authHeader) {

        InterviewScheduleDto schedule = interviewScheduleService.createSchedule(dto, authHeader);
        return ResponseEntity.ok(schedule);
    }


    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('COMPANY_HR') or hasRole('PLACEMENT_OFFICER')")
    public ResponseEntity<List<InterviewSchedule>> getAllSchedules() {
        return ResponseEntity.ok(interviewScheduleService.getAllSchedules());
    }

    @GetMapping("/hr")
    @PreAuthorize("hasRole('COMPANY_HR')")
    public ResponseEntity<List<InterviewScheduleDto>> getInterviewsForHR(@RequestHeader("Authorization") String token) {
        List<InterviewScheduleDto> interviews = interviewScheduleService.getInterviewsForCurrentHR(token);
        return ResponseEntity.ok(interviews);
    }

    @GetMapping("/officer")
    @PreAuthorize("hasRole('PLACEMENT_OFFICER')")
    public ResponseEntity<List<InterviewScheduleDto>> getInterviewsForOfficer(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(interviewScheduleService.getInterviewsForOfficer(token));
    }



    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COMPANY_HR')")
    public ResponseEntity<?> updateInterviewSchedule(
            @PathVariable Long id,
            @RequestBody InterviewScheduleDto dto) {

        InterviewScheduleDto updated = interviewScheduleService.updateSchedule(id, dto);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/selected")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COMPANY_HR')")
    public ResponseEntity<List<InterviewScheduleDto>> getSelectedCandidates() {
        List<InterviewScheduleDto> selected = interviewScheduleService.getSelectedCandidates();
        return ResponseEntity.ok(selected);
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<InterviewScheduleDto>> getInterviewsForStudent(@RequestHeader("Authorization") String token) {
        List<InterviewScheduleDto> interviews = interviewScheduleService.getInterviewsForCurrentStudent(token);
        return ResponseEntity.ok(interviews);
    }






    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COMPANY_HR') or hasRole('PLACEMENT_OFFICER')")
    public ResponseEntity<?> getScheduleById(@PathVariable Long id) {
        return interviewScheduleService.getScheduleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COMPANY_HR')")
    public ResponseEntity<?> deleteSchedule(@PathVariable Long id) {
        interviewScheduleService.deleteSchedule(id);
        return ResponseEntity.ok().build();
    }
}
