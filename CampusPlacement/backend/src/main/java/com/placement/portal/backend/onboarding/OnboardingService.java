package com.placement.portal.backend.onboarding;

import com.placement.portal.backend.auth.User;
import com.placement.portal.backend.auth.UserRepository;
import com.placement.portal.backend.company.Company;
import com.placement.portal.backend.jobOffer.JobOffer;
import com.placement.portal.backend.jobOffer.JobOfferRepository;
import com.placement.portal.backend.officerCompanyAssign.OfficerCompanyService;
import com.placement.portal.backend.util.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OnboardingService {

    private final OnboardingRepository onboardingRepository;
    private final JobOfferRepository jobOfferRepository;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final OfficerCompanyService officerCompanyService;

    public List<OnboardingDto> getAll() {
        return onboardingRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public OnboardingDto create(OnboardingDto dto) {
        JobOffer jobOffer = jobOfferRepository.findById(dto.getJobOfferId())
                .orElseThrow(() -> new EntityNotFoundException("Job offer not found"));

        Onboarding onboarding = Onboarding.builder()
                .jobOffer(jobOffer)
                .startDate(String.valueOf(LocalDate.parse(dto.getStartDate())))
                .onboardingStatus(dto.getOnboardingStatus())
                .documentsSubmitted(dto.getDocumentsSubmitted())
                .remarks(dto.getRemarks())
                .build();

        return toDto(onboardingRepository.save(onboarding));
    }

    public List<OnboardingDto> getAllForHR(String token) {
        String email = jwtUtil.extractEmail(token.substring(7)); // remove "Bearer "
        User hr = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("HR not found"));

        Long companyId = hr.getCompany().getId();

        List<Onboarding> onboardings = onboardingRepository.findByCompanyId(companyId);
        return onboardings.stream().map(this::toDto).toList();
    }


    public void delete(Long id) {
        onboardingRepository.deleteById(id);
    }

    public OnboardingDto update(Long id, OnboardingDto dto) {
        Onboarding onboarding = onboardingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Onboarding not found"));

        onboarding.setStartDate(String.valueOf(LocalDate.parse(dto.getStartDate())));
        onboarding.setOnboardingStatus(dto.getOnboardingStatus());
        onboarding.setDocumentsSubmitted(dto.getDocumentsSubmitted());
        onboarding.setRemarks(dto.getRemarks());

        return toDto(onboardingRepository.save(onboarding));
    }

    public List<OnboardingDto> getAllForOfficer(String token) {
        String email = jwtUtil.extractEmail(token.replace("Bearer ", ""));
        User officer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Officer not found"));

        List<Company> assignedCompanies = officerCompanyService.getAssignedCompanies(token);
        List<Long> companyIds = assignedCompanies.stream().map(Company::getId).toList();

        List<Onboarding> onboardings = onboardingRepository.findByCompanyIds(companyIds);

        return onboardings.stream().map(this::toDto).toList();
    }


    private OnboardingDto toDto(Onboarding entity) {
        return OnboardingDto.builder()
                .id(entity.getId())
                .jobOfferId(entity.getJobOffer().getId())
                .startDate(entity.getStartDate())
                .onboardingStatus(entity.getOnboardingStatus())
                .documentsSubmitted(entity.getDocumentsSubmitted())
                .remarks(entity.getRemarks())
                .candidateName(entity.getJobOffer().getJobApplication().getStudent().getUser().getName())
                .jobTitle(entity.getJobOffer().getJobApplication().getJobOpening().getTitle())
                .company(entity.getJobOffer().getJobApplication().getJobOpening().getCompany().getName())
                .build();
    }
}
