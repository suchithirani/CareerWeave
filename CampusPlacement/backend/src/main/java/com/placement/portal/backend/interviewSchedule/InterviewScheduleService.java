package com.placement.portal.backend.interviewSchedule;

import com.placement.portal.backend.auth.User;
import com.placement.portal.backend.auth.UserRepository;
import com.placement.portal.backend.company.Company;
import com.placement.portal.backend.company.CompanyRepository;
import com.placement.portal.backend.jobApplication.JobApplication;
import com.placement.portal.backend.jobApplication.JobApplicationRepository;
import com.placement.portal.backend.jobOpening.JobOpening;
import com.placement.portal.backend.jobOpening.JobOpeningRepository;
import com.placement.portal.backend.officerCompanyAssign.OfficerCompanyService;
import com.placement.portal.backend.studentProfile.StudentProfile;
import com.placement.portal.backend.studentProfile.StudentProfileRepository;
import com.placement.portal.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InterviewScheduleService {

    @Autowired
    private InterviewScheduleRepository interviewScheduleRepository;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private JobOpeningRepository jobOpeningRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private JwtUtil jwtService;

    @Autowired
    private  OfficerCompanyService officerCompanyService;


    /**
     * Create and save a new InterviewSchedule from DTO.
     */
    public InterviewScheduleDto createSchedule(InterviewScheduleDto dto, String authHeader) {
        JobApplication jobApplication = jobApplicationRepository.findById(dto.getJobApplicationId())
                .orElseThrow(() -> new RuntimeException("Job application not found"));

        Long targetCompanyId = jobApplication.getJobOpening().getCompany().getId();
        String hrEmail = jwtService.extractEmailFromAuthorizationHeader(authHeader);

        User hr = userRepository.findByEmail(hrEmail)
                .orElseThrow(() -> new RuntimeException("HR not found"));

        Company hrCompany = companyRepository.findByCompanyHRs_Id(hr.getId())
                .orElseThrow(() -> new RuntimeException("Company not found for HR"));

        if (!hrCompany.getId().equals(targetCompanyId)) {
            throw new RuntimeException("Unauthorized: You can only schedule interviews for your own company's job openings");
        }

        // Continue with scheduling
        InterviewSchedule interview = new InterviewSchedule();
        interview.setInterviewDateTime(dto.getInterviewDateTime());
        interview.setInterviewerName(dto.getInterviewerName());
        interview.setLocation(dto.getLocation());
        interview.setStatus(dto.getStatus());
        interview.setFeedback(dto.getFeedback());
        interview.setJobApplication(jobApplication);

        InterviewSchedule saved = interviewScheduleRepository.save(interview);
        return convertToDto(saved);
    }

    public List<InterviewSchedule> getByJobIds(List<Long> jobIds) {
        return interviewScheduleRepository.findByJobApplication_JobOpening_IdIn(jobIds);
    }






    /**
     * Get all interview schedules (for admin, hr, officer use).
     */
    public List<InterviewSchedule> getAllSchedules() {
        return interviewScheduleRepository.findAll();
    }

    /**
     * Get an interview schedule by ID.
     */
    public Optional<InterviewSchedule> getScheduleById(Long id) {
        return interviewScheduleRepository.findById(id);
    }

    /**
     * Delete an interview schedule by ID.
     */
    public void deleteSchedule(Long id) {
        interviewScheduleRepository.deleteById(id);
    }


    public InterviewScheduleDto updateSchedule(Long id, InterviewScheduleDto dto) {
        InterviewSchedule schedule = interviewScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        schedule.setInterviewDateTime(dto.getInterviewDateTime());
        schedule.setInterviewerName(dto.getInterviewerName());
        schedule.setLocation(dto.getLocation());
        schedule.setStatus(dto.getStatus());
        schedule.setFeedback(dto.getFeedback());

        JobApplication jobApplication = jobApplicationRepository.findById(dto.getJobApplicationId())
                .orElseThrow(() -> new RuntimeException("Job application not found"));

        schedule.setJobApplication(jobApplication);

        InterviewSchedule updated = interviewScheduleRepository.save(schedule);
        return convertToDto(updated);
    }


    public List<InterviewScheduleDto> getSelectedCandidates() {
        List<InterviewSchedule> selectedInterviews = interviewScheduleRepository.findByStatus("Selected");
        return selectedInterviews.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<InterviewScheduleDto> getInterviewsForOfficer(String token) {
        List<Company> companies = officerCompanyService.getAssignedCompanies(token);
        List<Long> companyIds = companies.stream().map(Company::getId).toList();

        List<JobOpening> jobOpenings = jobOpeningRepository.findByCompanyIdIn(companyIds);
        List<Long> jobIds = jobOpenings.stream().map(JobOpening::getId).toList();

        List<InterviewSchedule> schedules = interviewScheduleRepository.findByJobApplication_JobOpening_IdIn(jobIds);
        return schedules.stream().map(this::convertToDto).toList();
    }


    /**
     * Get interviews specifically for the currently authenticated HR (by JWT token).
     */
    public List<InterviewScheduleDto> getInterviewsForCurrentHR(String token) {
        String jwt = token.startsWith("Bearer ") ? token.substring(7) : token;
        String email = jwtService.extractEmail(jwt);

        User hrUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("HR user not found"));

        Company company = companyRepository.findByCompanyHRs_Id(hrUser.getId())
                .orElseThrow(() -> new RuntimeException("Company not found for HR"));

        List<JobOpening> jobOpenings = jobOpeningRepository.findByCompanyId(company.getId());

        List<Long> jobOpeningIds = jobOpenings.stream()
                .map(JobOpening::getId)
                .collect(Collectors.toList());

        List<InterviewSchedule> interviews = interviewScheduleRepository
                .findByJobApplication_JobOpening_IdIn(jobOpeningIds);

        return interviews.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    /**
     * Convert InterviewSchedule entity to DTO.
     */
    private InterviewScheduleDto convertToDto(InterviewSchedule entity) {
        InterviewScheduleDto dto = new InterviewScheduleDto();
        dto.setId(entity.getId());
        dto.setInterviewDateTime(entity.getInterviewDateTime());
        dto.setInterviewerName(entity.getInterviewerName());
        dto.setLocation(entity.getLocation());
        dto.setStatus(entity.getStatus());
        dto.setFeedback(entity.getFeedback());
        dto.setJobApplicationId(entity.getJobApplication().getId());
        dto.setCandidateName(entity.getJobApplication().getStudent().getUser().getName());
        dto.setJobTitle(entity.getJobApplication().getJobOpening().getTitle());

        return dto;
    }

    public List<InterviewScheduleDto> getInterviewsForCurrentStudent(String token) {
        // Step 1: Extract email from JWT token
        String email = jwtService.extractEmail(token.replace("Bearer ", ""));

        // Step 2: Find user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // Step 3: Get StudentProfile by userId
        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found for user ID: " + user.getId()));

        Long studentProfileId = profile.getId();

        // Step 4: Fetch all InterviewSchedules by navigating path: schedule -> jobApplication -> studentProfile.id
        List<InterviewSchedule> schedules = interviewScheduleRepository.findByJobApplication_Student_Id(studentProfileId);

        // Step 5: Map to DTOs
        return schedules.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }


}
