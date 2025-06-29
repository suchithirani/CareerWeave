    package com.placement.portal.backend.auth;

    import com.placement.portal.backend.company.Company;
    import com.placement.portal.backend.company.CompanyRepository;
    import com.placement.portal.backend.util.JwtUtil;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.access.annotation.Secured;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.security.core.Authentication;
    import org.springframework.security.core.context.SecurityContextHolder;
    import org.springframework.security.core.userdetails.UsernameNotFoundException;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;
    import java.util.Optional;
    import java.util.Set;

    @RestController
    @RequestMapping("/api/auth")
    @CrossOrigin(origins = "*")
    public class AuthController {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtil jwtUtil;
        private final CompanyRepository companyRepository;

        public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, CompanyRepository companyRepository) {
            this.userRepository = userRepository;
            this.passwordEncoder = passwordEncoder;
            this.jwtUtil = jwtUtil;
            this.companyRepository = companyRepository;
        }


        // Public: Only STUDENT can self-register
        @PostMapping("/register")
        public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
            // If roles are provided, only allow STUDENT role
            if (request.getRoles() != null && !request.getRoles().equals(Set.of(Role.STUDENT))) {
                return ResponseEntity.status(403).body("Only STUDENT role is allowed for public registration.");
            }

            // If roles are not provided, set default to STUDENT
            if (request.getRoles() == null || request.getRoles().isEmpty()) {
                request.setRoles(Set.of(Role.STUDENT));
            }

            // Check if email already exists
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already exists");
            }

            // Create and save the new user
            User user = User.builder()
                    .name(request.getName())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .roles(request.getRoles())  // Set the roles (default to STUDENT)
                    .enabled(true)
                    .build();

            userRepository.save(user);
            return ResponseEntity.ok("Student registered successfully");
        }

        // Admin-only: Register any user role

        @PostMapping("/admin-register")
        public ResponseEntity<?> adminRegister(@RequestBody RegisterRequest request) {
            if (request.getRoles() == null || request.getRoles().isEmpty()) {
                return ResponseEntity.badRequest().body("Roles must be provided for user registration");
            }

            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already exists");
            }

            User newUser = User.builder()
                    .name(request.getName())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .roles(request.getRoles())
                    .enabled(true)
                    .build();

            // ✅ Assign company only for COMPANY_HR
            if (request.getRoles().contains(Role.COMPANY_HR)) {
                if (false) {
                    return ResponseEntity.badRequest().body("Company ID is required for COMPANY_HR registration");
                }

                Company company = companyRepository.findById(request.getCompanyId())
                        .orElseThrow(() -> new RuntimeException("Company not found with ID: " + request.getCompanyId()));
                newUser.setCompany(company);
            }

            userRepository.save(newUser);
            return ResponseEntity.ok("User registered with role(s): " + request.getRoles());
        }

        @GetMapping("/me")
        @PreAuthorize("hasAnyRole('STUDENT', 'COMPANY_HR', 'PLACEMENT_OFFICER', 'ADMIN')")
        public ResponseEntity<?> getCurrentUser(Authentication authentication) {
            String email = authentication.getName(); // gets from JWT
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            UserDto dto = new UserDto(user.getId(), user.getName(), user.getEmail(),
                    user.getCompany() != null ? user.getCompany().getId() : null);

            return ResponseEntity.ok(dto);
        }







        // Login: Authenticate user and return JWT token
        @PostMapping("/login")
        public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
            Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

            if (userOpt.isEmpty()) {
                System.out.println("Login failed: user not found for email " + request.getEmail());
                return ResponseEntity.status(401).body(new AuthResponse(null, "Invalid credentials"));
            }

            User user = userOpt.get();

            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                System.out.println("Login failed: password mismatch for email " + request.getEmail());
                return ResponseEntity.status(401).body(new AuthResponse(null, "Invalid credentials"));
            }

            List<String> roles = user.getRoles().stream()
                    .map(Enum::name)
                    .toList();

            String token = jwtUtil.generateToken(user.getEmail(), roles);
            System.out.println("Login successful for user: " + user.getEmail() + " Roles: " + roles + "names:"+ user.getName());
            return ResponseEntity.ok(new AuthResponse(token, String.join(", ", roles),user.getName(),user.getId()));
        }



        // Verify token: Validate JWT token
        @GetMapping("/verify")
        public ResponseEntity<?> verifyToken(@RequestHeader("Authorization") String authHeader) {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);

            // Validate token
            if (!jwtUtil.isTokenValid(token)) {
                return ResponseEntity.status(401).body("Invalid or expired token");
            }

            String email = jwtUtil.extractEmail(token);
            List<String> roles = jwtUtil.extractRoles(token);

            return ResponseEntity.ok().body("Token is valid\nEmail: " + email + "\nRoles: " + roles);
        }
        // DELETE /api/users/{id}
        @DeleteMapping("/users/{id}")
        public ResponseEntity<?> deleteUser(@PathVariable Long id) {
            userRepository.deleteById(id);
            return ResponseEntity.ok("User deleted");
        }

        // GET all users - Admin only
        @GetMapping("/users")
        public ResponseEntity<List<User>> getAllUsers() {
            List<User> users = userRepository.findAll();
            return ResponseEntity.ok(users);
        }

        // GET user by ID - Admin only
        @GetMapping("/users/{id}")
        public ResponseEntity<?> getUserById(@PathVariable Long id) {
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body("User not found with id: " + id);
            }
            return ResponseEntity.ok(userOpt.get());
        }

        @GetMapping("/debug-roles")
        public ResponseEntity<?> debugRoles() {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("Authorities: " + auth.getAuthorities());
            return ResponseEntity.ok(auth.getAuthorities());
        }
    }
