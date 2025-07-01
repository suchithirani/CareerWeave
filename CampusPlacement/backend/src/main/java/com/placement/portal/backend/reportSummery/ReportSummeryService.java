package com.placement.portal.backend.reportSummery;



import com.placement.portal.backend.jobApplication.JobApplicationRepository;
import com.placement.portal.backend.studentProfile.StudentProfileRepository;
import com.placement.portal.backend.company.CompanyRepository;
import com.placement.portal.backend.jobOffer.JobOfferRepository;
import com.placement.portal.backend.auth.UserRepository;
import com.placement.portal.backend.auth.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportSummeryService {

    private final StudentProfileRepository studentProfileRepository;
    private final JobOfferRepository jobOfferRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public PlacementSummaryDto getPlacementSummary() {
        long total = studentProfileRepository.count();
        long placed = jobOfferRepository.countDistinctCandidates();
        double avgCtc = jobOfferRepository.findAverageSalary();

        return new PlacementSummaryDto(total, placed, avgCtc);
    }

    public List<CompanySummeryDto> getCompanyWiseReport() {
        return jobOfferRepository.findCompanyPlacementStats();
    }

    public List<DepartmentSummeryDto> getDepartmentWiseReport() {
        return studentProfileRepository.findDepartmentPlacementStats();
    }

    public List<StudentSummeryDto> getStudentWiseReport() {
        return jobOfferRepository.findAllWithPlacementStatus();
    }
}

