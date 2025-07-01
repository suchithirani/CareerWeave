package com.placement.portal.backend.studentProfile;

import com.placement.portal.backend.reportSummery.DepartmentSummeryDto;
import com.placement.portal.backend.reportSummery.StudentSummeryDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByUserId(Long userId);
    void deleteByUserId(Long userId);
    boolean existsByUserId(Long userId);
    Optional<StudentProfile> findByUserEmail(String email);

    // Department-wise placement stats
    @Query("""
        SELECT new com.placement.portal.backend.reportSummery.DepartmentSummeryDto(
            sp.branch,
            COUNT(sp),
            COUNT(DISTINCT jo.id),
            COALESCE(AVG(jo.salary), 0)
        )
        FROM StudentProfile sp
        LEFT JOIN JobApplication ja ON ja.student.id = sp.id
        LEFT JOIN JobOffer jo ON jo.jobApplication.id = ja.id
        GROUP BY sp.branch
    """)
    List<DepartmentSummeryDto> findDepartmentPlacementStats();

    List<StudentProfile> findByUser_Company_IdIn(List<Long> companyIds);


}
