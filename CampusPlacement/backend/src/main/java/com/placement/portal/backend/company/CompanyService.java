package com.placement.portal.backend.company;

import com.placement.portal.backend.auth.Role;
import com.placement.portal.backend.auth.User;
import com.placement.portal.backend.auth.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    // Admin: Get all companies
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    // Admin: Get company by ID
    public Optional<Company> getCompanyById(Long id) {
        return companyRepository.findById(id);
    }

    // Admin: Create company
    public Company createCompany(CompanyDto dto) {
        Company company = new Company();
        company.setName(dto.getName());
        company.setIndustry(dto.getIndustry());
        company.setLocation(dto.getLocation());
        company.setContactInfo(dto.getContactInfo());
        company.setCompanyType(CompanyType.valueOf(dto.getCompanyType()));
        company.setDescription(dto.getDescription());
        company.setHrName(dto.getHrName());
        company.setLogoUrl(dto.getLogoUrl());
        company.setWebsiteUrl(dto.getWebsiteUrl());

        // Assign HRs
        if (dto.getCompanyHRIds() != null && !dto.getCompanyHRIds().isEmpty()) {
            for (Long hrId : dto.getCompanyHRIds()) {
                User hr = userRepository.findById(hrId)
                        .orElseThrow(() -> new RuntimeException("HR User not found with ID: " + hrId));
                validateHR(hr, null); // new company, no ID yet
                hr.setCompany(company);
                userRepository.save(hr);
            }
        }

        return companyRepository.save(company);
    }

    // Admin: Update company
    public Company updateCompany(Long id, CompanyDto dto) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Update basic fields
        company.setName(dto.getName());
        company.setIndustry(dto.getIndustry());
        company.setLocation(dto.getLocation());
        company.setContactInfo(dto.getContactInfo());
        company.setCompanyType(CompanyType.valueOf(dto.getCompanyType()));
        company.setDescription(dto.getDescription());
        company.setHrName(dto.getHrName());
        company.setLogoUrl(dto.getLogoUrl());
        company.setWebsiteUrl(dto.getWebsiteUrl());

        // Disassociate HRs not in the new list
        List<User> existingHRs = userRepository.findAll().stream()
                .filter(u -> u.getCompany() != null &&
                        u.getCompany().getId().equals(company.getId()) &&
                        u.getRoles().contains(Role.COMPANY_HR))
                .toList();

        for (User hr : existingHRs) {
            if (!dto.getCompanyHRIds().contains(hr.getId())) {
                hr.setCompany(null);
                userRepository.save(hr);
            }
        }

        // Associate new HRs
        for (Long hrId : dto.getCompanyHRIds()) {
            User hr = userRepository.findById(hrId)
                    .orElseThrow(() -> new RuntimeException("HR not found with ID: " + hrId));
            validateHR(hr, company.getId());
            hr.setCompany(company);
            userRepository.save(hr);
        }

        return companyRepository.save(company);
    }

    // HR: Update own company (partial fields)
    public Company updateOwnCompanyByHR(Long userId, Company partialUpdate) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User hr = userOpt.get();
            Company company = hr.getCompany();
            if (company != null) {
                if (partialUpdate.getContactInfo() != null)
                    company.setContactInfo(partialUpdate.getContactInfo());

                if (partialUpdate.getLocation() != null)
                    company.setLocation(partialUpdate.getLocation());

                if (partialUpdate.getLogoUrl() != null)
                    company.setLogoUrl(partialUpdate.getLogoUrl());

                if (partialUpdate.getWebsiteUrl() != null)
                    company.setWebsiteUrl(partialUpdate.getWebsiteUrl());

                if (partialUpdate.getDescription() != null)
                    company.setDescription(partialUpdate.getDescription());

                return companyRepository.save(company);
            }
        }
        return null;
    }

    // Admin: Delete company
    public void deleteCompany(Long id) {
        Optional<Company> company = companyRepository.findById(id);
        company.ifPresent(companyRepository::delete);
    }

    // Convert Company entity to DTO
    public CompanyDto convertToDto(Company company) {
        // Filter users to only those with COMPANY_HR role
        List<User> companyHRsOnly = company.getCompanyHRs().stream()
                .filter(user -> user.getRoles().size() == 1 &&
                        user.getRoles().iterator().next().name().equals("COMPANY_HR"))
                .toList();

        return CompanyDto.builder()
                .id(company.getId())
                .name(company.getName())
                .industry(company.getIndustry())
                .location(company.getLocation())
                .contactInfo(company.getContactInfo())
                .companyType(company.getCompanyType().name())
                .hrName(company.getHrName())
                .description(company.getDescription())
                .logoUrl(company.getLogoUrl())
                .websiteUrl(company.getWebsiteUrl())
                .companyHRIds(companyHRsOnly.stream().map(User::getId).toList())
                .companyHRNames(companyHRsOnly.stream().map(User::getName).toList())
                .companyHRRoles(
                        companyHRsOnly.stream()
                                .map(user -> user.getRoles().iterator().next().name())
                                .distinct()
                                .toList()
                )
                .build();
    }

    // HR validation logic — enforce COMPANY_HR role and single company
    private void validateHR(User user, Long companyId) {
        if (!user.getRoles().contains(Role.COMPANY_HR)) {
            throw new RuntimeException("User with ID " + user.getId() + " is not a valid COMPANY_HR.");
        }

    }
}
