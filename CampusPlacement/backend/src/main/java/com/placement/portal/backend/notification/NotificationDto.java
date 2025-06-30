package com.placement.portal.backend.notification;

import com.placement.portal.backend.auth.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationDto {

    private Long id;

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Message is required")
    private String message;
    private String userName;
    private Boolean readStatus;
    private Long companyId;
    private String senderName;

    // Getters and setters
    public static NotificationDto fromEntity(Notification notification) {
        NotificationDto dto = new NotificationDto();
        User user = notification.getUser();

        dto.setId(notification.getId());
        dto.setUserId(user.getId());
        dto.setUserName(user.getName());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setReadStatus(notification.isReadStatus());
        dto.setCompanyId(user.getCompany() != null ? user.getCompany().getId() : null);

        if (notification.getSender() != null) {
            dto.setSenderName(notification.getSender().getName());
        }

        return dto;
    }
}
