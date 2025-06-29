package com.placement.portal.backend.company;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompanyDto {

    private Long id;
    private String name;
    private String industry;
    private String location;
    private String contactInfo;
    private String companyType;
    private String hrName;
    private String description;
    private String logoUrl;
    private String websiteUrl;

    // Input from frontend (list of HR user IDs)
    private List<Long> companyHRIds;

    // Output to frontend (optional, derived from
    private List<String> companyHRNames;

    private List<String> companyHRRoles;
}
