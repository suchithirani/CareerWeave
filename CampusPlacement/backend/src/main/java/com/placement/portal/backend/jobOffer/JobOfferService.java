package com.placement.portal.backend.jobOffer;

import com.placement.portal.backend.company.Company;
import com.placement.portal.backend.company.CompanyRepository;
import com.placement.portal.backend.jobApplication.JobApplication;
import com.placement.portal.backend.jobApplication.JobApplicationRepository;
import com.placement.portal.backend.auth.User;
import com.placement.portal.backend.auth.UserRepository;
import com.placement.portal.backend.jobOpening.JobOpening;
import com.placement.portal.backend.officerCompanyAssign.OfficerCompanyService;
import com.placement.portal.backend.studentProfile.StudentProfile;
import com.placement.portal.backend.studentProfile.StudentProfileRepository;
import com.placement.portal.backend.util.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobOfferService {

    private final JobOfferRepository jobOfferRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    StudentProfileRepository studentProfileRepository;
    private final OfficerCompanyService officerCompanyService;

    // Create new job offer
    public JobOfferDto createJobOffer(JobOfferDto dto) {
        JobApplication application = jobApplicationRepository.findById(dto.getJobApplicationId())
                .orElseThrow(() -> new EntityNotFoundException("Job application not found"));

        JobOffer offer = new JobOffer();
        offer.setJobApplication(application);
        offer.setOfferDate(dto.getOfferDate());
        offer.setSalary(dto.getSalary());
        if (dto.getStatus() != null) {
            offer.setStatus(OfferStatus.valueOf(dto.getStatus()));
        }
        if (offer.getJobApplication() != null) {
            dto.setLocation(offer.getJobApplication().getLocation());
            if (offer.getJobApplication().getJobOpening() != null) {
                dto.setJobTitle(offer.getJobApplication().getJobOpening().getTitle());
            }
        }
        offer.setJoiningDate(dto.getJoiningDate());
        offer.setOfferLetterUrl(dto.getOfferLetterUrl());

        JobOffer saved = jobOfferRepository.save(offer);
        return mapToDto(saved);
    }

    // Get offers for logged-in student from token
    public List<JobOfferDto> getOffersForStudent(String token) {
        String email = extractEmailFromToken(token);

        List<JobApplication> applications = jobApplicationRepository.findByStudent_User_Email(email);

        return applications.stream()
                .map(app -> jobOfferRepository.findByJobApplicationId(app.getId()).orElse(null))
                .filter(offer -> offer != null)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<JobOfferDto> getAllOffers() {
        List<JobOffer> offers = jobOfferRepository.findAll();

        return offers.stream().map(offer -> {
            JobOfferDto dto = new JobOfferDto();
            dto.setId(offer.getId());
            dto.setJobApplicationId(
                    offer.getJobApplication() != null ? offer.getJobApplication().getId() : null
            );
            dto.setOfferDate(offer.getOfferDate());
            dto.setSalary(offer.getSalary());
            dto.setStatus(offer.getStatus() != null ? offer.getStatus().name() : null);
            dto.setJoiningDate(offer.getJoiningDate());
            dto.setOfferLetterUrl(offer.getOfferLetterUrl());

            if (offer.getJobApplication() != null) {
                JobApplication application = offer.getJobApplication();

                dto.setLocation(application.getLocation() != null ? application.getLocation() : "N/A");

                if (application.getJobOpening() != null) {
                    dto.setJobTitle(application.getJobOpening().getTitle());
                    dto.setCompany(application.getJobOpening().getCompany().getName());
                }

                if (application.getStudent() != null && application.getStudent().getUser() != null) {
                    dto.setCandidateName(application.getStudent().getUser().getName());
                } else {
                    dto.setCandidateName("N/A");
                }

            } else {
                dto.setLocation("N/A");
                dto.setJobTitle("N/A");
                dto.setCompany("N/A");
                dto.setCandidateName("N/A");
            }

            return dto;
        }).collect(Collectors.toList());
    }

    // Get offers sent by HR's company
    public List<JobOfferDto> getOffersByHR(String token) {
        String email = extractEmailFromToken(token);

        // 1. Get companyId by HR email
        Long companyId = getCompanyIdByHrEmail(email);
        if (companyId == null) {
            throw new EntityNotFoundException("Company not found for HR email");
        }

        // 2. Find job applications for this company
        List<JobApplication> applications = jobApplicationRepository.findByJobOpening_Company_Id(companyId);

        return applications.stream()
                .map(app -> jobOfferRepository.findByJobApplicationId(app.getId()).orElse(null))
                .filter(offer -> offer != null)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public void updateStatus(Long offerId, String newStatusStr) {
        JobOffer offer = jobOfferRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offer not found"));

        OfferStatus newStatus;
        try {
            newStatus = OfferStatus.valueOf(newStatusStr);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + newStatusStr);
        }

        // Only allow valid transitions from PENDING
        if (offer.getStatus() != OfferStatus.PENDING) {
            throw new RuntimeException("Offer already responded to.");
        }

        if (newStatus != OfferStatus.ACCEPTED && newStatus != OfferStatus.REJECTED) {
            throw new RuntimeException("Only ACCEPTED or REJECTED allowed by student.");
        }

        offer.setStatus(newStatus);
        jobOfferRepository.save(offer);
    }

    public JobOfferDto updateStatusByStudent(Long offerId, String status, String token) {
        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        JobOffer offer = jobOfferRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offer not found"));

        // Ensure this student is the actual receiver of this offer
        if (!offer.getJobApplication().getStudent().getId().equals(profile.getId())) {
            try {
                throw new AccessDeniedException("Not authorized to update this offer");
            } catch (AccessDeniedException e) {
                throw new RuntimeException(e);
            }
        }

        offer.setStatus(OfferStatus.valueOf(status.toUpperCase()));
        return mapToDto(jobOfferRepository.save(offer));
    }


    public JobOfferDto getOfferById(Long id) {
        JobOffer offer = jobOfferRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Offer not found"));
        return mapToDto(offer);
    }

    public List<Map<String, Object>> getJobApplicationIdsForHR(String token) {
        // Remove Bearer prefix if present
        String jwt = token.startsWith("Bearer ") ? token.substring(7) : token;

        // Extract email from token
        String email = jwtUtil.extractEmail(jwt);

        // Fetch user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        Long hrId = user.getId();

        List<JobApplication> applications = jobApplicationRepository.findByJobOpening_Company_CompanyHRs_Id(hrId);

        return applications.stream().map(app -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", app.getId());
            map.put("jobTitle", app.getJobOpening().getTitle());
            map.put("studentName", app.getStudent().getUser().getName()); // Adjust if needed
            return map;
        }).collect(Collectors.toList());
    }



    @Transactional
    public JobOfferDto updateOffer(Long id, JobOfferDto dto) {
        JobOffer offer = jobOfferRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Offer not found"));

        offer.setOfferDate(dto.getOfferDate());
        offer.setSalary(dto.getSalary());
        if (offer.getJobApplication() != null) {
            dto.setLocation(offer.getJobApplication().getLocation());
            if (offer.getJobApplication().getJobOpening() != null) {
                dto.setJobTitle(offer.getJobApplication().getJobOpening().getTitle());
            }
        }


        if (dto.getStatus() != null) {
            offer.setStatus(OfferStatus.valueOf(dto.getStatus()));
        }
        offer.setJoiningDate(dto.getJoiningDate());
        offer.setOfferLetterUrl(dto.getOfferLetterUrl());

        return mapToDto(offer);
    }


    public void deleteOffer(Long id) {
        if (!jobOfferRepository.existsById(id)) {
            throw new EntityNotFoundException("Offer not found");
        }
        jobOfferRepository.deleteById(id);
    }

    private JobOfferDto mapToDto(JobOffer offer) {
        JobOfferDto dto = new JobOfferDto();
        dto.setId(offer.getId());
        dto.setJobApplicationId(
                offer.getJobApplication() != null ? offer.getJobApplication().getId() : null
        );
        dto.setOfferDate(offer.getOfferDate());
        dto.setSalary(offer.getSalary());
        dto.setStatus(offer.getStatus() != null ? offer.getStatus().name() : null);
        dto.setJoiningDate(offer.getJoiningDate());
        dto.setOfferLetterUrl(offer.getOfferLetterUrl());
        assert offer.getJobApplication() != null;
        dto.setCompany(offer.getJobApplication().getJobOpening().getCompany().getName());

        if (offer.getJobApplication() != null) {
            JobApplication application = offer.getJobApplication();

            dto.setLocation(application.getLocation() != null ? application.getLocation() : "N/A");

            if (application.getJobOpening() != null) {
                dto.setJobTitle(application.getJobOpening().getTitle() != null
                        ? application.getJobOpening().getTitle()
                        : "N/A");
            } else {
                dto.setJobTitle("N/A");
            }

            // Set candidateName properly here
            if (application.getStudent() != null && application.getStudent().getUser() != null) {
                dto.setCandidateName(application.getStudent().getUser().getName());
            } else {
                dto.setCandidateName("N/A");
            }
        } else {
            dto.setLocation("N/A");
            dto.setJobTitle("N/A");
            dto.setCandidateName("N/A");
        }

        return dto;
    }


    private String extractEmailFromToken(String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return jwtUtil.extractEmail(token);
    }

    public List<JobOfferDto> getOffersForOfficer(String token) {
        String email = jwtUtil.extractEmail(token.replace("Bearer ", ""));
        User officer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Officer not found"));

        List<Company> assignedCompanies = officerCompanyService.getAssignedCompanies(token);
        List<Long> companyIds = assignedCompanies.stream()
                .map(Company::getId)
                .toList();

        List<JobOffer> offers = jobOfferRepository.findOffersByCompanyIds(companyIds);

        return offers.stream().map(this::mapToDto).toList();
    }



    /**
     * Get Company ID linked to HR email.
     * Assumes Company entity has a collection of HR Users (`companyHRs`).
     */
    private Long getCompanyIdByHrEmail(String hrEmail) {
        User hrUser = userRepository.findByEmail(hrEmail)
                .orElseThrow(() -> new EntityNotFoundException("HR user not found by email"));

        Company company = companyRepository.findByCompanyHRs_Id(hrUser.getId())
                .orElseThrow(() -> new EntityNotFoundException("Company not found for HR user id"));

        return company.getId();
    }
}
