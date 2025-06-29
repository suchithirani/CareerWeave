package com.placement.portal.backend.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private Long companyId;


    public UserDto(Long id, String name, String email, Long companyId) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.companyId = companyId;
    }

    public UserDto(User user) {
    }
}
