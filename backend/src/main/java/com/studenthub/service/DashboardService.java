package com.studenthub.service;

import com.studenthub.dto.DashboardStatsDTO;
import com.studenthub.dto.StudentDTO;

import java.util.List;

public interface DashboardService {
    DashboardStatsDTO getDashboardStats();
    List<StudentDTO> getRecentStudents(int limit);
}
