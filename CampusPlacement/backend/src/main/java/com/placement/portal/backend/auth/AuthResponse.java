package com.placement.portal.backend.auth;

import lombok.*;

@AllArgsConstructor
@Getter
@Setter
public class AuthResponse {

    private String token;
    private String role;
    private String name;
    private Long id;
    public AuthResponse(Object o, String invalidCredentials) {
        this.token = null;
        this.role = invalidCredentials;
        this.name = null;
        this.id = null;
    }


}
