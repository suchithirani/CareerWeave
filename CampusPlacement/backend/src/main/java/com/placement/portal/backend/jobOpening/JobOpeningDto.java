package com.placement.portal.backend.jobOpening;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class JobOpeningDto {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String eligibilityCriteria;
    private LocalDate applicationDeadline;
    private Long companyId;
    private Double salaryLPA;
    private String status;
    // Getter & Setter



}
