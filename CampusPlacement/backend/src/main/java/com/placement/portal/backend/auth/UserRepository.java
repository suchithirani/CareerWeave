package com.placement.portal.backend.auth;

import com.placement.portal.backend.auth.User;
import jakarta.validation.constraints.AssertFalse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByCompanyId(Long companyId);
    @Query("SELECT u FROM User u JOIN u.roles r WHERE u.company.id = :companyId AND r = :role")
    List<User> findByCompanyIdAndRole(@Param("companyId") Long companyId, @Param("role") Role role);

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r = :role")
    List<User> findByRole(@Param("role") Role role);


}
