package com.placement.portal.backend.reportSummery;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlacementSummaryDto {
    private long totalStudents;
    private long placedStudents;
    private double averageCTC;
}