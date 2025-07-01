package com.placement.portal.backend.onboarding;

import com.placement.portal.backend.jobOffer.JobOffer;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Onboarding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "job_offer_id", nullable = false)
    private JobOffer jobOffer;

    private String startDate;
    private OnboardingStatus onboardingStatus;
    private String documentsSubmitted;
    private String remarks;


}
