package com.placement.portal.backend.officerCompanyAssign;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OfficerCompanyDto {
    private String officerName;
    private String officerEmail;
    private String department;
    private String companyName;
    private String industry;
    private String location;
}

