    package com.placement.portal.backend.reportSummery;

    import lombok.*;

    @Getter
    @Setter
    @NoArgsConstructor
    public class StudentSummeryDto {
        private Long id;
        private String name;
        private String branch;
        private boolean placed;
        private String companyName;
        private double salary;

        public StudentSummeryDto(Long id, String name, String branch,
                                 boolean placed, String companyName,
                                 Number salary) {
            this.id = id;
            this.name = name;
            this.branch = branch;
            this.placed = placed;
            this.companyName = companyName;
            this.salary = salary != null ? salary.doubleValue() : 0;
        }

    }