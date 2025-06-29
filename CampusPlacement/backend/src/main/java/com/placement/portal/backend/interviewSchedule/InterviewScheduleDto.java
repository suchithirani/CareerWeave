package com.placement.portal.backend.interviewSchedule;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class InterviewScheduleDto {

    private Long id;
    private LocalDateTime interviewDateTime;
    private String interviewerName;
    private String location;
    private String status;
    private String feedback;
    private Long jobApplicationId;

    // New fields
    private String candidateName;
    private String jobTitle;


}
