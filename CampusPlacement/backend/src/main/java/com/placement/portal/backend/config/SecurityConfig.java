package com.placement.portal.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http.cors().and()
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        // Public endpoints
                        .requestMatchers("/auth/**", "/api/auth/**", "/error", "/favicon.ico").permitAll()
                        .requestMatchers("/api/auth/login", "/api/auth/register", "/api/auth/verify").permitAll()
                        .requestMatchers("/api/auth/me").hasAnyAuthority("STUDENT", "ROLE_COMPANY_HR", "PLACEMENT_OFFICER", "ADMIN")

                        .requestMatchers("/api/job-openings/**").permitAll()

                        // Admin access
                        .requestMatchers("/api/auth/users/**").hasAnyRole("ADMIN","COMPANY_HR")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/company/officer-companies").hasRole("PLACEMENT_OFFICER")
                        .requestMatchers("/api/company/**").hasAnyRole("ADMIN","PLACEMENT_OFFICER","COMPANY_HR")
                        .requestMatchers("/api/student/profile/admin/**").hasAnyRole("ADMIN","COMPANY_HR","PLACEMENT_OFFICER")
                        .requestMatchers("/api/student/profile/officer").hasRole("PLACEMENT_OFFICER")
                        .requestMatchers("/api/placement-officer/**").hasAnyRole("ADMIN","PLACEMENT_OFFICER")
                        .requestMatchers("/api/test/admin").hasRole("ADMIN")

                        // Company HR access
                        .requestMatchers("/api/test/company-hr").hasRole("COMPANY_HR")

                        // Placement Officer access
                        .requestMatchers("/api/test/placement-officer").hasRole("PLACEMENT_OFFICER")
                        .requestMatchers("/api/company/officer-companies").hasRole("PLACEMENT_OFFICER")
                        .requestMatchers("/api/placement-officer/**").hasRole("PLACEMENT_OFFICER")

                        // Student access
                        .requestMatchers("/api/test/student").hasRole("STUDENT")
                        .requestMatchers("/api/student/profile/**").hasRole("STUDENT")
                        .requestMatchers("/api/student/**").hasAnyRole("STUDENT", "ADMIN")

                        // Job Applications
                        .requestMatchers(HttpMethod.POST, "/api/job-applications").hasRole("STUDENT")
                        .requestMatchers(HttpMethod.GET,"/api/job-applications/**").hasAnyRole("ADMIN", "STUDENT","COMPANY_HR","PLACEMENT_OFFICER")
                        .requestMatchers(HttpMethod.GET,"/api/job-applications/job/**").hasRole("COMPANY_HR")

                        .requestMatchers(HttpMethod.PUT, "/api/job-applications/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_COMPANY_HR")
                        .requestMatchers(HttpMethod.DELETE, "/api/job-applications/**").hasRole("ADMIN")

                        // Interview Schedules

                        .requestMatchers("/api/interview-schedules/**").hasAnyRole("ADMIN", "PLACEMENT_OFFICER", "COMPANY_HR","STUDENT")
                        .requestMatchers("/api/onboarding/**").hasAnyRole("COMPANY_HR","PLACEMENT_OFFICER")
                        // Authenticated access fallback
                        .requestMatchers(HttpMethod.GET, "/api/job-openings/**").authenticated()

                        // All other requests must be authenticated
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
