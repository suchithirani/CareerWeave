package com.placement.portal.backend.onboarding;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/onboarding")
@RequiredArgsConstructor
public class OnboardingController {

    private final OnboardingService onboardingService;

    @GetMapping
    @PreAuthorize("hasRole('COMPANY_HR')")
    public ResponseEntity<List<OnboardingDto>> getAllForHR(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(onboardingService.getAllForHR(token));
    }


    @PostMapping
    @PreAuthorize("hasRole('COMPANY_HR')")
    public ResponseEntity<OnboardingDto> create(@RequestBody OnboardingDto dto) {
        return ResponseEntity.ok(onboardingService.create(dto));
    }

    @GetMapping("/officer")
    @PreAuthorize("hasRole('PLACEMENT_OFFICER')")
    public ResponseEntity<List<OnboardingDto>> getAllForOfficer(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(onboardingService.getAllForOfficer(token));
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COMPANY_HR')")
    public ResponseEntity<OnboardingDto> update(@PathVariable Long id, @RequestBody OnboardingDto dto) {
        return ResponseEntity.ok(onboardingService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COMPANY_HR')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        onboardingService.delete(id);
        return ResponseEntity.ok().build();
    }
}

