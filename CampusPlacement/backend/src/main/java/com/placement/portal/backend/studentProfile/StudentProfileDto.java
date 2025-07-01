package com.placement.portal.backend.studentProfile;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentProfileDto {
    public Long id;
    public String enrollmentNumber;
    public String branch;
    public String degree;
    public Double cgpa;
    public Integer passingYear;
    public String resumeLink;
    public String skills;
    public Long userId;



    private String name;
    private String email;



}
