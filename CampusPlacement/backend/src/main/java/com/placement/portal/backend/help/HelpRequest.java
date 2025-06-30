package com.placement.portal.backend.help;

import com.placement.portal.backend.auth.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class HelpRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String subject;

    @Lob
    private String message;

    @Enumerated(EnumType.STRING)
    private HelpCategory category;

    @Enumerated(EnumType.STRING)
    private HelpUrgency urgency;

    @Enumerated(EnumType.STRING)
    private HelpStatus status = HelpStatus.OPEN;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
