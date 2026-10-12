package com.studenthub.dto;

import jakarta.validation.constraints.NotBlank;

public class DepartmentDTO {
    private Long id;
    private String code;

    @NotBlank(message = "Department name is required")
    private String name;

    private String description;
    private long studentCount;

    public DepartmentDTO() {}

    public DepartmentDTO(Long id, String code, String name, String description, long studentCount) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.studentCount = studentCount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public long getStudentCount() { return studentCount; }
    public void setStudentCount(long studentCount) { this.studentCount = studentCount; }
}
