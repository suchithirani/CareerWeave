package com.placement.portal.backend.help;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/help-requests")
public class HelpRequestController {

    @Autowired
    private HelpRequestService service;

    // ✅ Student/HR submits a support request
    @PostMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'COMPANY_HR','PLACEMENT_OFFICER')")
    public ResponseEntity<HelpRequest> submit(@RequestBody HelpRequestDto dto) {
        String email = getCurrentUserEmail();
        return ResponseEntity.ok(service.createHelpRequest(dto, email));
    }

    // ✅ Student/HR sees their own tickets
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('STUDENT', 'COMPANY_HR','PLACEMENT_OFFICER')")
    public ResponseEntity<List<HelpRequest>> myRequests() {
        String email = getCurrentUserEmail();
        return ResponseEntity.ok(service.getRequestsByUser(email));
    }

    // ✅ Admin can view all help requests
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<HelpRequest>> getAll() {
        return ResponseEntity.ok(service.getAllRequests());
    }

    // ✅ Admin can update the status of a request
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HelpRequest> updateStatus(@PathVariable Long id,
                                                    @RequestParam HelpStatus status) {
        return ResponseEntity.ok(service.updateStatus(id, status));
    }

    // 🔒 Utility method to get current email from JWT context
    private String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName(); // usually email if set as subject
    }
}
