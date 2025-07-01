package com.placement.portal.backend.studentProfile;

import com.placement.portal.backend.auth.User;
import com.placement.portal.backend.auth.UserRepository;
import com.placement.portal.backend.company.Company;
import com.placement.portal.backend.officerCompanyAssign.OfficerCompanyService;
import com.placement.portal.backend.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/student/profile")
@CrossOrigin(origins = "*")
public class StudentProfileController {

    private final StudentProfileService profileService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final OfficerCompanyService officerCompanyService;

    public StudentProfileController(
            StudentProfileService profileService,
            JwtUtil jwtUtil,
            UserRepository userRepository,
            OfficerCompanyService officerCompanyService
    ) {
        this.profileService = profileService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.officerCompanyService = officerCompanyService;
    }

    // STUDENT: Create or update own profile
    @PostMapping("/create")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentProfile> saveProfile(
            @RequestBody StudentProfileDto dto,
            @RequestHeader("Authorization") String authHeader
    ) {
        String email = jwtUtil.extractEmail(authHeader.substring(7));
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            dto.setUserId(user.getId());
            dto.setEmail(user.getEmail());
            dto.setName(user.getName());
            StudentProfile profile = profileService.createOrUpdate(dto);
            return ResponseEntity.ok(profile);
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // STUDENT: Get own profile
    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getOwnProfile(@RequestHeader("Authorization") String authHeader) {
        String email = jwtUtil.extractEmail(authHeader.substring(7));
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            Optional<StudentProfile> profile = profileService.getByUserId(userOpt.get().getId());
            return ResponseEntity.ok(profile.orElse(null)); // 200 with null if not found
        }
        return ResponseEntity.badRequest().body("User not found");
    }

    // ADMIN: Get a student's profile by user ID
    @GetMapping("/admin/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getProfileByAdmin(@PathVariable Long userId) {
        Optional<StudentProfile> profile = profileService.getByUserId(userId);
        return ResponseEntity.ok(profile.orElse(null));
    }

    // ADMIN: Delete a student profile by user ID
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProfile(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("Profile deleted");
    }

    // PLACEMENT OFFICER: View students of assigned companies
    @GetMapping("/officer")
    @PreAuthorize("hasRole('PLACEMENT_OFFICER')")
    public ResponseEntity<List<StudentProfile>> getStudentsForOfficer(@RequestHeader("Authorization") String token) {
        List<Company> assignedCompanies = officerCompanyService.getAssignedCompanies(token);
        List<Long> companyIds = assignedCompanies.stream().map(Company::getId).toList();
        List<StudentProfile> students = profileService.getStudentsForCompanies(companyIds);
        return ResponseEntity.ok(students);
    }

    // ADMIN/HR/OFFICER: View all student profiles
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COMPANY_HR') or hasRole('PLACEMENT_OFFICER')")
    public ResponseEntity<List<StudentProfile>> getAllStudentProfiles() {
        return ResponseEntity.ok(profileService.getAllProfiles());
    }
}
