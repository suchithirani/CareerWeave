package com.placement.portal.backend.help;

import com.placement.portal.backend.auth.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HelpArticleRepository extends JpaRepository<HelpArticle, Long> {
    List<HelpArticle> findByRoleAndStatus(Role role, HelpArticleStatus status);
}
