package com.placement.portal.backend.jobOffer;

import com.placement.portal.backend.reportSummery.CompanySummeryDto;
import com.placement.portal.backend.reportSummery.StudentSummeryDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobOfferRepository extends JpaRepository<JobOffer, Long> {
    Optional<JobOffer> findByJobApplicationId(Long jobApplicationId);

    // Count distinct candidates who have received job offers
    @Query("SELECT COUNT(DISTINCT jo.jobApplication.student.user.id) FROM JobOffer jo")
    long countDistinctCandidates();

    // Calculate average salary of all offers
    @Query("SELECT COALESCE(AVG(j.salary), 0) FROM JobOffer j")
    double findAverageSalary();

    // Company-wise placement stats
    @Query("""
    SELECT new com.placement.portal.backend.reportSummery.CompanySummeryDto(
        c.id,
        c.name,
        COUNT(DISTINCT jo.id),
        COALESCE(AVG(jo.salary), 0)
    )
    FROM JobOffer jo
    JOIN jo.jobApplication ja
    JOIN ja.jobOpening jop
    JOIN jop.company c
    GROUP BY c.id, c.name
""")
    List<CompanySummeryDto> findCompanyPlacementStats();

    @Query("""
    SELECT new com.placement.portal.backend.reportSummery.StudentSummeryDto(
                                                    u.id,
                                                    u.name,
                                                    sp.branch,
                                                    SUM(CASE WHEN jo.status = 'ACCEPTED' THEN 1 ELSE 0 END) > 0,
                                                    MAX(CASE WHEN jo.status = 'ACCEPTED' THEN ja.jobOpening.company.name ELSE null END),
                                                    COALESCE(MAX(CASE WHEN jo.status = 'ACCEPTED' THEN jo.salary ELSE null END), 0)
                                                )
                                                FROM JobOffer jo
                                                JOIN jo.jobApplication ja
                                                JOIN ja.student sp
                                                JOIN sp.user u
                                                GROUP BY u.id, u.name, sp.branch
""")
    List<StudentSummeryDto> findAllWithPlacementStatus();

    @Query("""
    SELECT jo FROM JobOffer jo
    JOIN jo.jobApplication ja
    JOIN ja.jobOpening jop
    WHERE jop.company.id IN :companyIds
""")
    List<JobOffer> findOffersByCompanyIds(@Param("companyIds") List<Long> companyIds);


}

