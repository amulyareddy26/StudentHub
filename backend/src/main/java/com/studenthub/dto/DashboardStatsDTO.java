package com.studenthub.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDTO {
    private long totalStudents;
    private long totalDepartments;
    private long totalAcademicRecords;
    private long totalUsers;
    private double averageMarksPercentage;
    private List<DepartmentStat> departmentBreakdown;
    private Map<String, Long> yearDistribution;
    private Map<String, Long> genderDistribution;

    public static class DepartmentStat {
        private String name;
        private String code;
        private long studentCount;

        public DepartmentStat() {}
        public DepartmentStat(String name, String code, long studentCount) {
            this.name = name;
            this.code = code;
            this.studentCount = studentCount;
        }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public long getStudentCount() { return studentCount; }
        public void setStudentCount(long studentCount) { this.studentCount = studentCount; }
    }

    public DashboardStatsDTO() {}

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }
    public long getTotalDepartments() { return totalDepartments; }
    public void setTotalDepartments(long totalDepartments) { this.totalDepartments = totalDepartments; }
    public long getTotalAcademicRecords() { return totalAcademicRecords; }
    public void setTotalAcademicRecords(long totalAcademicRecords) { this.totalAcademicRecords = totalAcademicRecords; }
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    public double getAverageMarksPercentage() { return averageMarksPercentage; }
    public void setAverageMarksPercentage(double averageMarksPercentage) { this.averageMarksPercentage = averageMarksPercentage; }
    public List<DepartmentStat> getDepartmentBreakdown() { return departmentBreakdown; }
    public void setDepartmentBreakdown(List<DepartmentStat> departmentBreakdown) { this.departmentBreakdown = departmentBreakdown; }
    public Map<String, Long> getYearDistribution() { return yearDistribution; }
    public void setYearDistribution(Map<String, Long> yearDistribution) { this.yearDistribution = yearDistribution; }
    public Map<String, Long> getGenderDistribution() { return genderDistribution; }
    public void setGenderDistribution(Map<String, Long> genderDistribution) { this.genderDistribution = genderDistribution; }
}
