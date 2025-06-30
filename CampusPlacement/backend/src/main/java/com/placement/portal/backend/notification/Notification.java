package com.placement.portal.backend.notification;

import com.placement.portal.backend.auth.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The user who receives the notification
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String title;   // Short title of notification

    @Column(length = 1000)
    private String message; // Detailed notification message

    private boolean readStatus = false;  // Has the user read this notification?

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;

    // Constructors
    public Notification() {
        this.createdAt = LocalDateTime.now();
    }

    public Notification(User user, String title, String message) {
        this.user = user;
        this.title = title;
        this.message = message;
        this.readStatus = false;
        this.createdAt = LocalDateTime.now();
    }


    // Getters & Setters


}
