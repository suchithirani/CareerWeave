package com.placement.portal.backend.help;

import com.placement.portal.backend.auth.Role;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class HelpArticleDto {
    private Long id;
    private String title;
    private String content;
    private Role role;
    private HelpCategory category;
    private HelpUrgency urgency;
    private HelpArticleStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
