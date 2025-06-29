package com.placement.portal.backend.jobApplication;

import com.placement.portal.backend.jobOpening.JobOpening;
import com.placement.portal.backend.studentProfile.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByStudent_Id(Long studentId);

    List<JobApplication> findByStudent(StudentProfile student);

    List<JobApplication> findByJobOpeningId(Long jobId);

    List<JobApplication> findByJobOpening_Company_Id(Long companyId);

    List<JobApplication> findByStudent_User_Email(String email);

    List<JobApplication> findByJobOpeningIn(List<JobOpening> jobOpenings);
    List<JobApplication> findByJobOpening_Company_CompanyHRs_Id(Long hrId);

    List<JobApplication> findByJobOpening_IdIn(List<Long> jobIds);





}
