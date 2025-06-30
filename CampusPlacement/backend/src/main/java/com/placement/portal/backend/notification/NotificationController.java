package com.placement.portal.backend.notification;

import com.placement.portal.backend.auth.*;
import com.placement.portal.backend.util.JwtUtil;
import io.jsonwebtoken.JwtException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;
    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    UserRepository userRepository;
    // Create a notification
    @PostMapping
    @PreAuthorize("hasAnyRole('COMPANY_HR', 'PLACEMENT_OFFICER')")
    public ResponseEntity<?> createNotification(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody NotificationDto dto) {
        try {
            String email = jwtUtil.extractEmail(token.substring(7));
            User sender = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Sender not found"));

            Notification saved = notificationService.createNotification(dto, sender);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // Get notifications by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getNotificationsByUser(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.getNotificationsByUserId(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        List<Notification> notifications = notificationService.getAllNotifications();
        return ResponseEntity.ok(notifications);
    }

    // Mark a notification as read
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable Long id) {
        try {
            Notification updatedNotification = notificationService.markAsRead(id);
            return ResponseEntity.ok(updatedNotification);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_HR')")
    public ResponseEntity<?> updateNotification(@PathVariable Long id, @Valid @RequestBody NotificationDto dto) {
        try {
            Notification updated = notificationService.updateNotification(id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        try {
            notificationService.deleteNotification(id);
            return ResponseEntity.ok("Notification deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @GetMapping("/hr")
    @PreAuthorize("hasRole('COMPANY_HR')")
    public ResponseEntity<List<NotificationDto>> getNotificationsForHr(@RequestHeader("Authorization") String token) {
        List<NotificationDto> notifications = notificationService.getNotificationsForHr(token);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/officer")
    @PreAuthorize("hasRole('PLACEMENT_OFFICER')")
    public ResponseEntity<List<NotificationDto>> getNotificationsForOfficer(@RequestHeader("Authorization") String token) {
        List<NotificationDto> notifications = notificationService.getNotificationsForOfficer(token);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/officer-students")
    @PreAuthorize("hasRole('ROLE_PLACEMENT_OFFICER')")
    public ResponseEntity<List<UserDto>> getAllStudentsForOfficer() {
        List<User> students = userRepository.findByRole(Role.STUDENT);

        List<UserDto> dtos = students.stream()
                .map(u -> new UserDto(
                        u.getId(),
                        u.getName(),
                        u.getEmail(),
                        u.getCompany() != null ? u.getCompany().getId() : null))
                .toList();

        return ResponseEntity.ok(dtos);
    }



    @GetMapping("/company-students")
    @PreAuthorize("hasAnyRole('ROLE_COMPANY_HR','ROLE_PLACEMENT_OFFICER')")
    public ResponseEntity<List<UserDto>> getStudentsUnderHrCompany(
            @RequestHeader("Authorization") String token) {

        // Validate token
        if (token == null || !token.startsWith("Bearer ")) {
            throw new BadCredentialsException("Invalid token format");
        }

        try {
            // Extract HR details
            String email = jwtUtil.extractEmail(token.substring(7));
            User hr = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("HR not found"));

            // Validate company association
            if (hr.getCompany() == null) {
                throw new IllegalStateException("HR is not associated with any company");
            }

            Long companyId = hr.getCompany().getId();

            // Get students
            List<User> users = userRepository.findByCompanyIdAndRole(companyId, Role.STUDENT);

            // Convert to DTO
            List<UserDto> dtos = users.stream()
                    .map(u -> new UserDto(
                            u.getId(),
                            u.getName(),
                            u.getEmail(),
                            u.getCompany() != null ? u.getCompany().getId() : null))
                    .toList();

            return ResponseEntity.ok(dtos);

        } catch (JwtException e) {
            throw new BadCredentialsException("Invalid token");
        }
    }

}
