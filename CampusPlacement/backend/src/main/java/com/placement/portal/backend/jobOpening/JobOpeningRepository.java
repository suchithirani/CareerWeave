package com.placement.portal.backend.jobOpening;

import com.placement.portal.backend.company.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface JobOpeningRepository extends JpaRepository<JobOpening, Long> {
    // Find job openings by company ID
    List<JobOpening> findByCompanyId(Long companyId);

    // Find job openings by HR user ID (through company association)
    List<JobOpening> findByCompany_CompanyHRs_Id(Long userId);



    List<JobOpening> findByStatus(JobOpeningStatus status);

    List<JobOpening> findByCompanyIdIn(List<Long> companyIds);



    // For HR users to see their company's active postings



}
