package com.placement.portal.backend.officerCompanyAssign;

import com.placement.portal.backend.company.Company;
import com.placement.portal.backend.placementOfficer.PlacementOfficer;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class OfficerCompany {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "officer_id")
    private PlacementOfficer officer;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;
}
