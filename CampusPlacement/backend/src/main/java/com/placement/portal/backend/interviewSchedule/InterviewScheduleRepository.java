package com.placement.portal.backend.interviewSchedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewScheduleRepository extends JpaRepository<InterviewSchedule, Long> {
    // You can add custom query methods if needed
    List<InterviewSchedule> findByJobApplication_IdIn(List<Long> applicationIds); // ✅
    List<InterviewSchedule> findByJobApplication_JobOpening_IdIn(List<Long> jobOpeningIds);
    List<InterviewSchedule> findByStatus(String status);
    List<InterviewSchedule> findByJobApplication_Student_Id(Long studentProfileId);

}
