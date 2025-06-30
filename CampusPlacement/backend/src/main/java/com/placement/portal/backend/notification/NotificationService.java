package com.placement.portal.backend.notification;


import com.placement.portal.backend.auth.User;
import com.placement.portal.backend.auth.UserRepository;
import com.placement.portal.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // Create notification
    public Notification createNotification(NotificationDto dto,User sender) throws Exception {
        Optional<User> userOpt = userRepository.findById(dto.getUserId());
        if (userOpt.isEmpty()) {
            throw new Exception("User not found with id: " + dto.getUserId());
        }

        Notification notification = new Notification();
        notification.setUser(userOpt.get());
        notification.setTitle(dto.getTitle());
        notification.setMessage(dto.getMessage());
        notification.setSender(sender);
        notification.setReadStatus(dto.getReadStatus() != null ? dto.getReadStatus() : false);

        return notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }


    // Get notifications for a user
    public List<Notification> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    // Mark notification as read
    public Notification markAsRead(Long notificationId) throws Exception {
        Optional<Notification> notifOpt = notificationRepository.findById(notificationId);
        if (notifOpt.isEmpty()) {
            throw new Exception("Notification not found with id: " + notificationId);
        }
        Notification notification = notifOpt.get();
        notification.setReadStatus(true);
        return notificationRepository.save(notification);
    }

    public void deleteNotification(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notificationRepository.delete(notification);
    }

    private NotificationDto convertToDto(Notification notification) {
        NotificationDto dto = new NotificationDto();
        dto.setId(notification.getId());
        dto.setUserId(notification.getUser().getId());
        dto.setUserName(notification.getUser().getName()); // or .getName() based on your User entity
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setReadStatus(notification.isReadStatus());
        return dto;
    }

    public List<NotificationDto> getNotificationsForHr(String token) {
        String email = jwtUtil.extractEmail(token.substring(7)); // Remove "Bearer "
        User hrUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("HR not found"));

        Long companyId = hrUser.getCompany().getId();

        // Fetch all users of this company
        List<User> companyUsers = userRepository.findByCompanyId(companyId);
        List<Long> userIds = companyUsers.stream().map(User::getId).toList();

        List<Notification> notifications = notificationRepository.findByUserIdIn(userIds);

        return notifications.stream().map(notification -> {
            NotificationDto dto = new NotificationDto();
            dto.setId(notification.getId());
            dto.setUserId(notification.getUser().getId());
            dto.setUserName(notification.getUser().getName());
            dto.setTitle(notification.getTitle());
            dto.setMessage(notification.getMessage());
            dto.setReadStatus(notification.isReadStatus());
            return dto;
        }).toList();
    }

    public Notification updateNotification(Long id, NotificationDto dto) throws Exception {
        Notification existing = notificationRepository.findById(id)
                .orElseThrow(() -> new Exception("Notification not found"));

        existing.setTitle(dto.getTitle());
        existing.setMessage(dto.getMessage());
        existing.setReadStatus(dto.getReadStatus() != null ? dto.getReadStatus() : existing.isReadStatus());

        return notificationRepository.save(existing);
    }

    public List<NotificationDto> getNotificationsForOfficer(String token) {
        String email = jwtUtil.extractEmail(token.substring(7));
        User officer = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Officer not found"));

        // Example: fetch notifications sent to this officer
        return notificationRepository.findByUserId(officer.getId())
                .stream()
                .map(NotificationDto::fromEntity)
                .toList();
    }



}
