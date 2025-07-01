package com.placement.portal.backend.onboarding;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OnboardingRepository extends JpaRepository<Onboarding, Long> {

    @Query("""
    SELECT o FROM Onboarding o
    JOIN o.jobOffer jo
    JOIN jo.jobApplication ja
    JOIN ja.jobOpening jop
    WHERE jop.company.id IN :companyIds
""")
    List<Onboarding> findByCompanyIds(@Param("companyIds") List<Long> companyIds);

    @Query("SELECT o FROM Onboarding o WHERE o.jobOffer.jobApplication.jobOpening.company.id = :companyId")
    List<Onboarding> findByCompanyId(@Param("companyId") Long companyId);


}
