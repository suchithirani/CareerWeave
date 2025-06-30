package com.placement.portal.backend.placementOfficer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/placement-officer")
public class PlacementOfficerController {

    @Autowired
    private PlacementOfficerService service;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<PlacementOfficerDto> create(@RequestBody PlacementOfficerDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<PlacementOfficerDto>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PreAuthorize("hasRole('PLACEMENT_OFFICER')")
    @GetMapping("/me")
    public ResponseEntity<PlacementOfficerDto> getMyProfile(@RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(service.getMyProfile(authHeader));
    }

    @PreAuthorize("hasRole('PLACEMENT_OFFICER')")
    @PutMapping("/me")
    public ResponseEntity<PlacementOfficerDto> updateMyProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody PlacementOfficerDto dto) {
        return ResponseEntity.ok(service.updateMyProfile(authHeader, dto));
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<PlacementOfficerDto> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }




    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<PlacementOfficerDto> update(
            @PathVariable Long id,
            @RequestBody PlacementOfficerDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
