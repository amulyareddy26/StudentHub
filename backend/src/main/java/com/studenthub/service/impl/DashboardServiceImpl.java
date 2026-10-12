package com.studenthub.service.impl;

import com.studenthub.dto.DashboardStatsDTO;
import com.studenthub.dto.StudentDTO;
import com.studenthub.entity.AcademicRecord;
import com.studenthub.entity.Department;
import com.studenthub.entity.Student;
import com.studenthub.repository.AcademicRecordRepository;
import com.studenthub.repository.DepartmentRepository;
import com.studenthub.repository.StudentRepository;
import com.studenthub.repository.UserRepository;
import com.studenthub.service.DashboardService;
import com.studenthub.service.StudentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;
    private final AcademicRecordRepository academicRecordRepository;
    private final UserRepository userRepository;
    private final StudentService studentService;

    public DashboardServiceImpl(StudentRepository studentRepository,
                                DepartmentRepository departmentRepository,
                                AcademicRecordRepository academicRecordRepository,
                                UserRepository userRepository,
                                StudentService studentService) {
        this.studentRepository = studentRepository;
        this.departmentRepository = departmentRepository;
        this.academicRecordRepository = academicRecordRepository;
        this.userRepository = userRepository;
        this.studentService = studentService;
    }

    @Override
    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO dto = new DashboardStatsDTO();
        dto.setTotalStudents(studentRepository.count());
        dto.setTotalDepartments(departmentRepository.count());
        dto.setTotalAcademicRecords(academicRecordRepository.count());
        dto.setTotalUsers(userRepository.count());

        // Department breakdown
        List<Department> departments = departmentRepository.findAll();
        List<DashboardStatsDTO.DepartmentStat> deptStats = new ArrayList<>();
        for (Department dept : departments) {
            long count = studentRepository.countByDepartmentId(dept.getId());
            deptStats.add(new DashboardStatsDTO.DepartmentStat(dept.getName(), dept.getCode(), count));
        }
        dto.setDepartmentBreakdown(deptStats);

        // Year & Gender breakdown
        List<Student> students = studentRepository.findAll();
        Map<String, Long> yearDist = new LinkedHashMap<>();
        Map<String, Long> genderDist = new LinkedHashMap<>();

        for (Student s : students) {
            String yr = s.getYearOfStudy() != null ? "Year " + s.getYearOfStudy() : "Unassigned";
            yearDist.put(yr, yearDist.getOrDefault(yr, 0L) + 1);

            String g = s.getGender() != null && !s.getGender().isBlank() ? s.getGender() : "Other";
            genderDist.put(g, genderDist.getOrDefault(g, 0L) + 1);
        }
        dto.setYearDistribution(yearDist);
        dto.setGenderDistribution(genderDist);

        // Academic performance average
        List<AcademicRecord> records = academicRecordRepository.findAll();
        if (!records.isEmpty()) {
            double totalPct = 0;
            int count = 0;
            for (AcademicRecord r : records) {
                if (r.getMaxMarks() != null && r.getMaxMarks().compareTo(BigDecimal.ZERO) > 0 && r.getMarksObtained() != null) {
                    totalPct += (r.getMarksObtained().doubleValue() / r.getMaxMarks().doubleValue()) * 100.0;
                    count++;
                }
            }
            dto.setAverageMarksPercentage(count > 0 ? Math.round((totalPct / count) * 10.0) / 10.0 : 0.0);
        } else {
            dto.setAverageMarksPercentage(0.0);
        }

        return dto;
    }

    @Override
    public List<StudentDTO> getRecentStudents(int limit) {
        return studentService.getAllStudents(null, null, null, null).stream()
                .limit(limit)
                .collect(Collectors.toList());
    }
}
