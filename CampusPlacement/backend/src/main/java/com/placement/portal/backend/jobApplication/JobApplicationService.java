package com.placement.portal.backend.jobApplication;

import com.placement.portal.backend.auth.Role;
import com.placement.portal.backend.auth.User;
import com.placement.portal.backend.auth.UserRepository;
import com.placement.portal.backend.company.Company;
import com.placement.portal.backend.company.CompanyRepository;
import com.placement.portal.backend.jobOpening.JobOpening;
import com.placement.portal.backend.jobOpening.JobOpeningRepository;
import com.placement.portal.backend.officerCompanyAssign.OfficerCompanyService;
import com.placement.portal.backend.studentProfile.StudentProfile;
import com.placement.portal.backend.studentProfile.StudentProfileRepository;
import com.placement.portal.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final JobOpeningRepository jobOpeningRepository;
    private final CompanyRepository companyRepository;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final OfficerCompanyService officerCompanyService;

    public JobApplicationService(JobApplicationRepository jobApplicationRepository,
                                 StudentProfileRepository studentProfileRepository,
                                 JobOpeningRepository jobOpeningRepository,
                                 CompanyRepository companyRepository,
                                 JwtUtil jwtUtil,
                                 UserRepository userRepository,
                                 OfficerCompanyService officerCompanyService) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.jobOpeningRepository = jobOpeningRepository;
        this.companyRepository = companyRepository;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.officerCompanyService = officerCompanyService;
    }

    public JobApplicationDto createApplication(JobApplicationDto dto) {
        Optional<StudentProfile> studentOpt = studentProfileRepository.findById(dto.getStudentId());
        Optional<JobOpening> jobOpeningOpt = jobOpeningRepository.findById(dto.getJobOpeningId());

        if (studentOpt.isEmpty() || jobOpeningOpt.isEmpty()) {
            throw new RuntimeException("Student or Job Opening not found.");
        }

        JobApplication application = JobApplication.builder()
                .student(studentOpt.get())
                .jobOpening(jobOpeningOpt.get())
                .resumeLink(dto.getResumeLink())
                .status(JobApplicationStatus.APPLIED)
                .appliedAt(LocalDateTime.now())

                // Set interview-related fields if provided
                .interviewDateTime(dto.getInterviewDateTime())
                .interviewerName(dto.getInterviewerName())
                .location(dto.getLocation())
                .feedback(dto.getFeedback())

                .build();

        JobApplication saved = jobApplicationRepository.save(application);
        return mapToDto(saved);
    }

    public List<JobApplicationDto> getAllApplications() {
        return jobApplicationRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public JobApplicationDto getApplicationById(Long id) {
        return jobApplicationRepository.findById(id)
                .map(this::mapToDto)
                .orElse(null);
    }

    public JobApplicationDto updateApplicationStatus(Long id, JobApplicationStatus status) {
        Optional<JobApplication> opt = jobApplicationRepository.findById(id);
        if (opt.isEmpty()) return null;

        JobApplication app = opt.get();
        app.setStatus(status);
        JobApplication saved = jobApplicationRepository.save(app);
        return mapToDto(saved);
    }

    public JobApplicationDto updateApplicationDetails(Long id, JobApplicationDto dto) {
        Optional<JobApplication> opt = jobApplicationRepository.findById(id);
        if (opt.isEmpty()) return null;

        JobApplication app = opt.get();

        // Update interview-related fields and others if needed
        if (dto.getInterviewDateTime() != null) app.setInterviewDateTime(dto.getInterviewDateTime());
        if (dto.getInterviewerName() != null) app.setInterviewerName(dto.getInterviewerName());
        if (dto.getLocation() != null) app.setLocation(dto.getLocation());
        if (dto.getFeedback() != null) app.setFeedback(dto.getFeedback());

        if (dto.getResumeLink() != null) app.setResumeLink(dto.getResumeLink());
        if (dto.getStatus() != null) app.setStatus(dto.getStatus());

        JobApplication saved = jobApplicationRepository.save(app);
        return mapToDto(saved);
    }

    public Map<JobApplicationStatus, List<JobApplicationDto>> getHiringPipelineGroupedByStatus(Long jobId) {
        List<JobApplicationDto> applications = getApplicationsByJobOpeningId(jobId);
        return applications.stream()
                .collect(Collectors.groupingBy(JobApplicationDto::getStatus));
    }




    public void deleteApplication(Long id) {
        jobApplicationRepository.deleteById(id);
    }

    private JobApplicationDto mapToDto(JobApplication application) {
        return JobApplicationDto.builder()
                .id(application.getId())
                .studentId(application.getStudent().getId())
                .jobOpeningId(application.getJobOpening().getId())
                .resumeLink(application.getResumeLink())
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())

                // Interview fields mapping
                .interviewDateTime(application.getInterviewDateTime())
                .interviewerName(application.getInterviewerName())
                .location(application.getLocation())
                .feedback(application.getFeedback())
                .studentName(application.getStudent().getUser().getName())
                .branch(application.getStudent().getBranch())
                .degree(application.getStudent().getDegree())
                .companyName(application.getJobOpening().getCompany().getName())
                .jobTitle(application.getJobOpening().getTitle())
                .build();
    }

    List<JobApplicationDto> getApplicationsByJobOpeningId(Long jobId) {
        JobOpening jobOpening = jobOpeningRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job opening not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // extracted from JWT

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only restrict access if HR (Admins can bypass this)
        if (user.getRoles().contains(Role.COMPANY_HR)) {
            Company hrCompany = companyRepository.findByCompanyHRs_Id(user.getId())
                    .orElseThrow(() -> new RuntimeException("HR is not assigned to any company"));

            // Block access if HR is trying to access job from a different company
            if (!jobOpening.getCompany().getId().equals(hrCompany.getId())) {
                try {
                    throw new AccessDeniedException("You are not authorized to view this job's pipeline.");
                } catch (AccessDeniedException e) {
                    throw new RuntimeException(e);
                }
            }
        }

        // Now fetch applications for this job
        List<JobApplication> applications = jobApplicationRepository.findByJobOpeningId(jobId);

        return applications.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }


    public List<JobApplicationDto> getApplicationsByCurrentStudent(String token) {
        // Extract email from Bearer token
        String jwt = token.startsWith("Bearer ") ? token.substring(7) : token;
        String email = jwtUtil.extractEmail(jwt);

        // Fetch student profile using email
        StudentProfile student = studentProfileRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Student profile not found for email: " + email));

        // Fetch applications
        List<JobApplication> applications = jobApplicationRepository.findByStudent(student);

        // Convert to DTOs
        return applications.stream()
                .map(this::mapToDto) // Assume convertToDto() exists
                .collect(Collectors.toList());
    }

    public List<JobApplicationDto> getApplicationsForCurrentHR(String token) {
        String jwt = token.startsWith("Bearer ") ? token.substring(7) : token;
        String email = jwtUtil.extractEmail(jwt);

        User hrUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("HR user not found"));

        // Find company assigned to this HR
        Company company = companyRepository.findByCompanyHRs_Id(hrUser.getId())
                .orElseThrow(() -> new RuntimeException("Company not found for HR"));

        // Get job openings by this company
        List<JobOpening> jobOpenings = jobOpeningRepository.findByCompanyId(company.getId());

        List<Long> jobIds = jobOpenings.stream().map(JobOpening::getId).toList();

        List<JobApplication> applications = jobApplicationRepository.findByJobOpening_IdIn(jobIds);

        return applications.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<JobApplicationDto> getApplicationsForOfficer(String token) {
        List<Company> assignedCompanies = officerCompanyService.getAssignedCompanies(token);
        List<Long> companyIds = assignedCompanies.stream().map(Company::getId).toList();

        if (companyIds.isEmpty()) return List.of();

        List<Long> jobIds = jobOpeningRepository.findByCompanyIdIn(companyIds)
                .stream()
                .map(JobOpening::getId)
                .toList();

        if (jobIds.isEmpty()) return List.of();

        List<JobApplication> applications = jobApplicationRepository.findByJobOpening_IdIn(jobIds);

        return applications.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public Map<JobApplicationStatus, List<JobApplicationDto>> getApplicationsGroupedByStatusForCurrentHR(String token) {
        String jwt = token.startsWith("Bearer ") ? token.substring(7) : token;
        String email = jwtUtil.extractEmail(jwt);

        User hrUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("HR user not found"));

        Company company = companyRepository.findByCompanyHRs_Id(hrUser.getId())
                .orElseThrow(() -> new RuntimeException("Company not found for HR"));

        List<JobOpening> jobOpenings = jobOpeningRepository.findByCompanyId(company.getId());
        List<Long> jobIds = jobOpenings.stream().map(JobOpening::getId).toList();

        List<JobApplication> applications = jobApplicationRepository.findByJobOpening_IdIn(jobIds);

        return applications.stream()
                .map(this::mapToDto)
                .collect(Collectors.groupingBy(JobApplicationDto::getStatus));
    }



}
