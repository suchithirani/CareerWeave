package com.placement.portal.backend.auth;


import lombok.*;

import java.util.Set;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Set<Role> roles;
    private long companyId;

    }

