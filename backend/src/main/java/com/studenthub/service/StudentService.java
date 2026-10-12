package com.studenthub.service;

import com.studenthub.dto.StudentDTO;
import com.studenthub.entity.Student;

import java.util.List;

public interface StudentService {
    List<StudentDTO> getAllStudents(String query, Long deptId, Integer year, String gender);
    StudentDTO getStudentById(Long id);
    Student getStudentEntity(Long id);
    StudentDTO createStudent(StudentDTO dto);
    StudentDTO updateStudent(Long id, StudentDTO dto);
    void deleteStudent(Long id);
}
