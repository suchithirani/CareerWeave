package com.placement.portal.backend.jobOpening;

import com.placement.portal.backend.auth.UserRepository;
import com.placement.portal.backend.company.Company;
import com.placement.portal.backend.company.CompanyRepository;
import com.placement.portal.backend.auth.User;


import com.placement.portal.backend.placementOfficer.PlacementOfficer;
import com.placement.portal.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobOpeningService {

    @Autowired
    private JobOpeningRepository jobOpeningRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil; // ✅ Replaces JwtService

    public List<JobOpening> getAllJobOpenings() {
        return jobOpeningRepository.findAll();
    }

    public Optional<JobOpening> getJobOpeningById(Long id) {
        return jobOpeningRepository.findById(id);
    }

    public JobOpening createJobOpening(JobOpeningDto dto, String token) {
        User user = getAuthenticatedUser(token);

        Company company = user.getCompany(); // ✅ safer and direct
        if (company == null) {
            throw new RuntimeException("Company not linked to HR user: " + user.getId());
        }

        JobOpening job = new JobOpening();
        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setLocation(dto.getLocation());
        job.setEligibilityCriteria(dto.getEligibilityCriteria());
        job.setApplicationDeadline(dto.getApplicationDeadline());
        job.setSalaryLPA(dto.getSalaryLPA());
        job.setCompany(company);
        job.setStatus(JobOpeningStatus.valueOf(dto.getStatus().toUpperCase()));

        return jobOpeningRepository.save(job);
    }




    public JobOpening updateJobOpening(Long id, JobOpeningDto dto) {
        return jobOpeningRepository.findById(id).map(job -> {
            job.setTitle(dto.getTitle());
            job.setDescription(dto.getDescription());
            job.setLocation(dto.getLocation());
            job.setEligibilityCriteria(dto.getEligibilityCriteria());
            job.setApplicationDeadline(dto.getApplicationDeadline());
            job.setSalaryLPA(dto.getSalaryLPA());
            job.setStatus(JobOpeningStatus.valueOf(dto.getStatus().toUpperCase()));

            // ✅ Update company if provided
            if (dto.getCompanyId() != null) {
                Company company = companyRepository.findById(dto.getCompanyId())
                        .orElseThrow(() -> new RuntimeException("Company not found"));
                job.setCompany(company);
            }

            return jobOpeningRepository.save(job);
        }).orElse(null);
    }

    private User getAuthenticatedUser(String token) {
        String jwt = token.substring(7);
        String email = jwtUtil.extractEmail(jwt);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));
    }

    public List<JobOpening> getOpeningsForCompanies(List<Long> companyIds) {
        return jobOpeningRepository.findByCompanyIdIn(companyIds);
    }



    // ✅ Company HR can only see their own job openings
    public List<JobOpening> getJobOpeningsForCurrentHR(String token) {
        String jwt = token.substring(7); // Remove "Bearer "
        String email = jwtUtil.extractEmail(jwt); // ✅ Use extractEmail
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = companyRepository.findByCompanyHRs_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        return jobOpeningRepository.findByCompanyId(company.getId());
    }

    public void deleteJobOpening(Long id) {
        jobOpeningRepository.deleteById(id);
    }



}
