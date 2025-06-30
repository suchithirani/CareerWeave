package com.placement.portal.backend.help;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HelpRequestDto {
    private String subject;
    private String message;
    private HelpCategory category;
    private HelpUrgency urgency;
}
