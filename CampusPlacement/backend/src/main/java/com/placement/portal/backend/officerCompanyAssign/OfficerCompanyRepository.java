package com.placement.portal.backend.officerCompanyAssign;

import com.placement.portal.backend.placementOfficer.PlacementOfficer;
import com.placement.portal.backend.company.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OfficerCompanyRepository extends JpaRepository<OfficerCompany, Long> {
    List<OfficerCompany> findByOfficer(PlacementOfficer officer);
    boolean existsByOfficerAndCompany(PlacementOfficer officer, Company company);
    void deleteByOfficerAndCompany(PlacementOfficer officer, Company company);
}
