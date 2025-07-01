package com.placement.portal.backend.reportSummery;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompanySummeryDto {
    private Long companyId;
    private String companyName;
    private long totalHires;
    private double averageCTC;
}