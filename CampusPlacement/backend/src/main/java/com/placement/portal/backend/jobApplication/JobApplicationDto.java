package com.placement.portal.backend.jobApplication;

import java.time.LocalDateTime;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplicationDto {

    private Long id;

    private Long studentId;   // Refers to StudentProfile id

    private Long jobOpeningId; // Refers to JobOpening id

    private String resumeLink;

    private JobApplicationStatus status;

    private LocalDateTime appliedAt;

    private LocalDateTime interviewDateTime;

    private String interviewerName;

    private String location;

    private String feedback;

    private String studentName;
    private String degree;
    private String branch;

    private String companyName;
    private String jobTitle;



}
