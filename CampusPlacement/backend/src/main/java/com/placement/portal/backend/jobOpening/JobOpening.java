package com.placement.portal.backend.jobOpening;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.placement.portal.backend.company.Company;
import com.placement.portal.backend.jobApplication.JobApplication;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "job_openings")
public class JobOpening {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String location;
    private String eligibilityCriteria;
    private LocalDate applicationDeadline;

    @Column(nullable = false)
    private Double salaryLPA;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @Enumerated(EnumType.STRING)
    private JobOpeningStatus status = JobOpeningStatus.DRAFT;

    @OneToMany(mappedBy = "jobOpening", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<JobApplication> jobApplications;

    // Getters and Setters


}
