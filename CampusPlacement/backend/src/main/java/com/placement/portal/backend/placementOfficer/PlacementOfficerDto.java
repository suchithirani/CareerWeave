package com.placement.portal.backend.placementOfficer;

import com.placement.portal.backend.auth.Role;
import com.placement.portal.backend.auth.User;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlacementOfficerDto {
    private Long id;
    private Long userId;
    private String department;
    private String contactNumber;
    private String designation;
    private String name;
    private String email;
    private Set<Role> roles;
}
