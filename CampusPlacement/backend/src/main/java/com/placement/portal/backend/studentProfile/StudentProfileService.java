package com.placement.portal.backend.studentProfile;

import com.placement.portal.backend.auth.User;
import com.placement.portal.backend.auth.UserRepository;
import com.placement.portal.backend.company.Company;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentProfileService {

    private final StudentProfileRepository profileRepo;
    private final UserRepository userRepo;

    public StudentProfileService(StudentProfileRepository profileRepo, UserRepository userRepo) {
        this.profileRepo = profileRepo;
        this.userRepo = userRepo;
    }

    public StudentProfile createOrUpdate(StudentProfileDto dto) {
        User studentUser = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        StudentProfile profile = profileRepo.findByUserId(dto.getUserId()).orElse(new StudentProfile());
        profile.setUser(studentUser);
        profile.setEnrollmentNumber(dto.getEnrollmentNumber());
        profile.setBranch(dto.getBranch());
        profile.setDegree(dto.getDegree());
        profile.setCgpa(dto.getCgpa());
        profile.setPassingYear(dto.getPassingYear());
        profile.setResumeLink(dto.getResumeLink());
        profile.setSkills(dto.getSkills());

        return profileRepo.save(profile);
    }

    public Optional<StudentProfile> getByUserId(Long userId) {
        return profileRepo.findByUserId(userId);
    }

    public boolean deleteByUserId(Long userId) {
        return profileRepo.findByUserId(userId)
                .map(profile -> {
                    profileRepo.delete(profile);
                    return true;
                }).orElse(false);
    }

    public List<StudentProfile> getAllProfiles() {
        return profileRepo.findAll();
    }

    public List<StudentProfile> getStudentsForCompanies(List<Long> companyIds) {
        return profileRepo.findByUser_Company_IdIn(companyIds);
    }
}
