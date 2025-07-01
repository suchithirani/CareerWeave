package com.placement.portal.backend.reportSummery;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentSummeryDto {
    private String department;
    private long totalStudents;
    private long placedStudents;
    private double averageCTC;
}
