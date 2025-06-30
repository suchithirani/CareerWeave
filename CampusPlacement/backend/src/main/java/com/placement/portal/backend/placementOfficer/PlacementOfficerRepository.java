package com.placement.portal.backend.placementOfficer;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlacementOfficerRepository extends JpaRepository<PlacementOfficer, Long> {
    Optional<PlacementOfficer> findByUserId(Long userId);
    Optional<PlacementOfficer> findByUserEmail(String email);

}
