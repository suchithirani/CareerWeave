package com.placement.portal.backend.placementOfficer;

import com.placement.portal.backend.auth.User;
import com.placement.portal.backend.auth.UserRepository;
import com.placement.portal.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlacementOfficerService {

    @Autowired
    private PlacementOfficerRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public PlacementOfficerDto create(PlacementOfficerDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        PlacementOfficer officer = PlacementOfficer.builder()
                .user(user)
                .department(dto.getDepartment())
                .contactNumber(dto.getContactNumber())
                .designation(dto.getDesignation())
                .build();

        PlacementOfficer saved = repository.save(officer);

        return mapToDto(saved);
    }

    public PlacementOfficerDto getMyProfile(String authHeader) {
        String email = jwtUtil.extractEmailFromAuthorizationHeader(authHeader);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PlacementOfficer officer = repository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Placement Officer profile not found"));

        return mapToDto(officer); // assuming you already have a method to convert entity to DTO
    }

    public PlacementOfficerDto updateMyProfile(String authHeader, PlacementOfficerDto dto) {
        String email = jwtUtil.extractEmailFromAuthorizationHeader(authHeader);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PlacementOfficer officer = repository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Placement Officer profile not found"));

        // Update only the allowed fields
        officer.setDepartment(dto.getDepartment());
        officer.setContactNumber(dto.getContactNumber());
        officer.setDesignation(dto.getDesignation());

        repository.save(officer);

        return mapToDto(officer);
    }



    public PlacementOfficerDto update(Long id, PlacementOfficerDto dto) {
        PlacementOfficer existingOfficer = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Placement officer not found"));

        // Only update the fields that should be modifiable
        existingOfficer.setDepartment(dto.getDepartment());
        existingOfficer.setContactNumber(dto.getContactNumber());
        existingOfficer.setDesignation(dto.getDesignation());

        PlacementOfficer updated = repository.save(existingOfficer);
        return mapToDto(updated);
    }
    public List<PlacementOfficerDto> getAll() {
        return repository.findAll().stream().map(this::mapToDto).toList();
    }

    public Optional<PlacementOfficerDto> getById(Long id) {
        return repository.findById(id).map(this::mapToDto);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    private PlacementOfficerDto mapToDto(PlacementOfficer officer) {
        return PlacementOfficerDto.builder()
                .id(officer.getId())
                .userId(officer.getUser().getId())
                .department(officer.getDepartment())
                .contactNumber(officer.getContactNumber())
                .designation(officer.getDesignation())
                .name(officer.getUser().getName())
                .email(officer.getUser().getEmail())
                .roles(officer.getUser().getRoles())
                .build();
    }
}
