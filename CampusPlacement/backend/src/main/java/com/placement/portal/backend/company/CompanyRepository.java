package com.placement.portal.backend.company;

import com.placement.portal.backend.auth.User;
import com.placement.portal.backend.jobOpening.JobOpening;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByCompanyHRs_Id(Long userId);
    @Query("SELECT DISTINCT u.company FROM User u JOIN u.roles r WHERE r = 'COMPANY_HR' AND u.company IS NOT NULL")
    List<Company> findAllCompaniesHavingHRs();
    Optional<Company> findByCompanyHRsContains(User user);

}
