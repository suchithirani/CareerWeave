package com.placement.portal.backend.jobOffer;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
@Getter
@Setter
public class JobOfferDto {
    private Long id;
    private Long jobApplicationId;
    private String candidateName;
    private LocalDate offerDate;
    private BigDecimal salary;
    private String status;
    private LocalDate joiningDate;
    private String offerLetterUrl;
    private String jobTitle;
    private String location;
    private String company;
    // getters and setters


}

