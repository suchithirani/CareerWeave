package com.placement.portal.backend.officerCompanyAssign;

import com.placement.portal.backend.util.JwtUtil;
import com.placement.portal.backend.company.Company;
import com.placement.portal.backend.company.CompanyRepository;
import com.placement.portal.backend.placementOfficer.PlacementOfficer;
import com.placement.portal.backend.placementOfficer.PlacementOfficerRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Transactional
@Service
@RequiredArgsConstructor
public class OfficerCompanyService {

    private final OfficerCompanyRepository assignmentRepo;
    private final CompanyRepository companyRepo;
    private final PlacementOfficerRepository officerRepo;
    private final JwtUtil jwtUtil;

    public void assignCompany(String token, Long companyId) {
        String email = jwtUtil.extractEmail(
                token.substring(7));
        PlacementOfficer officer = officerRepo.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Officer not found"));

        Company company = companyRepo.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        if (!assignmentRepo.existsByOfficerAndCompany(officer, company)) {
            OfficerCompany assignment = new OfficerCompany();
            assignment.setOfficer(officer);
            assignment.setCompany(company);
            assignmentRepo.save(assignment);
        }
    }

    public void unassignCompany(String token, Long companyId) {
        String email = jwtUtil.extractEmail(token.substring(7));
        PlacementOfficer officer = officerRepo.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Officer not found"));

        Company company = companyRepo.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        assignmentRepo.deleteByOfficerAndCompany(officer, company);
    }

    public List<Company> getAssignedCompanies(String token) {
        String email = jwtUtil.extractEmail(token.substring(7));
        PlacementOfficer officer = officerRepo.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Officer not found"));

        return assignmentRepo.findByOfficer(officer).stream()
                .map(OfficerCompany::getCompany)
                .toList();
    }

    public List<OfficerCompanyDto> getAllAssignmentsForAdmin() {
        return assignmentRepo.findAll().stream().map(assignment -> {
            PlacementOfficer officer = assignment.getOfficer();
            Company company = assignment.getCompany();

            return new OfficerCompanyDto(
                    officer.getUser().getName(),
                    officer.getUser().getEmail(),
                    officer.getDepartment(),
                    company.getName(),
                    company.getIndustry(),
                    company.getLocation()
            );
        }).toList();
    }

}
