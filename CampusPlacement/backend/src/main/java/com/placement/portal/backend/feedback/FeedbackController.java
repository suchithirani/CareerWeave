package com.placement.portal.backend.feedback;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService service;

    private String getEmail() {
        Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    // ✅ Submit feedback (Student, HR, Officer)
    @PostMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'COMPANY_HR', 'PLACEMENT_OFFICER')")
    public ResponseEntity<Feedback> submit(@RequestBody FeedbackDto dto) {
        return ResponseEntity.ok(service.submitFeedback(getEmail(), dto));
    }

    // ✅ View own feedback
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('STUDENT', 'COMPANY_HR', 'PLACEMENT_OFFICER')")
    public ResponseEntity<List<Feedback>> myFeedback() {
        return ResponseEntity.ok(service.getFeedbackByUser(getEmail()));
    }

    // ✅ Admin views all feedback
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Feedback>> allFeedback() {
        return ResponseEntity.ok(service.getAllFeedback());
    }

    // ✅ Admin responds to feedback
    @PutMapping("/{id}/respond")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Feedback> respond(@PathVariable Long id, @RequestParam String response) {
        return ResponseEntity.ok(service.respondToFeedback(id, response));
    }
}
