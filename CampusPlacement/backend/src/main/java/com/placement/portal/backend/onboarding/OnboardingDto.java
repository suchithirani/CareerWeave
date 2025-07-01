package com.placement.portal.backend.onboarding;

import lombok.*;

import java.time.LocalDate;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OnboardingDto {
    private Long id;
    private Long jobOfferId;
    private String startDate;
    private OnboardingStatus onboardingStatus;
    private String documentsSubmitted;
    private String remarks;
    private String candidateName;
    private String jobTitle;
    private String company;
}
