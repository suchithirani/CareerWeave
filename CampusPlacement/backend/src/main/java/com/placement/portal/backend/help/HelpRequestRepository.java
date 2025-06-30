package com.placement.portal.backend.help;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HelpRequestRepository extends JpaRepository<HelpRequest, Long> {
    List<HelpRequest> findByUserId(Long userId);
}
