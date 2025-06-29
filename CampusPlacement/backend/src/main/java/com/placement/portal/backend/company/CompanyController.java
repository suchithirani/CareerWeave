package com.placement.portal.backend.company;

import com.placement.portal.backend.auth.User;
import com.placement.portal.backend.auth.UserDto;
import com.placement.portal.backend.auth.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/company")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    // Admin & Officer: Get all companies
    @PreAuthorize("hasRole('ADMIN') or hasRole('PLACEMENT_OFFICER')")
    @GetMapping
    public List<CompanyDto> getAllCompanies() {
        return companyService.getAllCompanies().stream()
                .map(companyService::convertToDto)
                .toList();
    }

    // Admin & HR: Get company by ID
    @PreAuthorize("hasRole('ADMIN') or hasRole('COMPANY_HR')")
    @GetMapping("/{id}")
    public ResponseEntity<CompanyDto> getCompanyById(@PathVariable Long id) {
        Optional<Company> company = companyService.getCompanyById(id);
        return company
                .map(c -> ResponseEntity.ok(companyService.convertToDto(c)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Admin only: Create a company
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<CompanyDto> createCompany(@Valid @RequestBody CompanyDto companyDto) {
        Company createdCompany = companyService.createCompany(companyDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(companyService.convertToDto(createdCompany));
    }

    // Admin & HR: Update company
    @PreAuthorize("hasRole('ADMIN') or hasRole('COMPANY_HR')")
    @PutMapping("/{id}")
    public ResponseEntity<CompanyDto> updateCompany(@PathVariable Long id, @RequestBody CompanyDto companyDetails) {
        Company updatedCompany = companyService.updateCompany(id, companyDetails);
        return updatedCompany != null
                ? ResponseEntity.ok(companyService.convertToDto(updatedCompany))
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // HR: Update their own company's basic info
    @PutMapping("/hr-update")
    @PreAuthorize("hasRole('COMPANY_HR')")
    public ResponseEntity<?> updateOwnCompany(@RequestBody Company partialUpdate, Authentication authentication) {
        String email = authentication.getName();
        User hr = userRepository.findByEmail(email).orElse(null);
        if (hr == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid HR user");
        }

        Company updated = companyService.updateOwnCompanyByHR(hr.getId(), partialUpdate);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Company not found for this HR");
        }

        return ResponseEntity.ok(companyService.convertToDto(updated));
    }

    @PutMapping("/update-profile")
    @PreAuthorize("hasRole('COMPANY_HR')")
    public ResponseEntity<UserDto> updateProfile(@RequestBody UserDto dto, Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        user.setName(dto.getName());
        userRepository.save(user);

        return ResponseEntity.ok(new UserDto(user));
    }

    // Admin only: Delete company
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompany(@PathVariable Long id) {
        companyService.deleteCompany(id);
        return ResponseEntity.noContent().build();
    }

    // Officer: Get companies that have HRs
    @GetMapping("/officer-companies")
    @PreAuthorize("hasRole('PLACEMENT_OFFICER')")
    public ResponseEntity<List<CompanyDto>> getCompaniesHavingHRs() {
        List<Company> companies = companyRepository.findAllCompaniesHavingHRs();
        List<CompanyDto> dtos = companies.stream()
                .map(companyService::convertToDto)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/my-company")
    @PreAuthorize("hasRole('COMPANY_HR')")
    public ResponseEntity<CompanyDto> getOwnCompany(Authentication authentication) {
        String email = authentication.getName();
        User hr = userRepository.findByEmail(email).orElse(null);
        if (hr == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<Company> company = companyRepository.findByCompanyHRs_Id(hr.getId());
        return company
                .map(c -> ResponseEntity.ok(companyService.convertToDto(c)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }


}
