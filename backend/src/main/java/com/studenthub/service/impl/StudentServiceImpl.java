package com.studenthub.service.impl;

import com.studenthub.dto.StudentDTO;
import com.studenthub.entity.Department;
import com.studenthub.entity.Student;
import com.studenthub.exception.DuplicateResourceException;
import com.studenthub.exception.ResourceNotFoundException;
import com.studenthub.repository.DepartmentRepository;
import com.studenthub.repository.StudentRepository;
import com.studenthub.service.StudentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;

    public StudentServiceImpl(StudentRepository studentRepository, DepartmentRepository departmentRepository) {
        this.studentRepository = studentRepository;
        this.departmentRepository = departmentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDTO> getAllStudents(String query, Long deptId, Integer year, String gender) {
        List<Student> list;
        if ((query == null || query.isBlank()) && deptId == null && year == null && (gender == null || gender.isBlank())) {
            list = studentRepository.findAll();
        } else {
            list = studentRepository.filterStudents(query, deptId, year, gender);
        }
        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDTO getStudentById(Long id) {
        return toDTO(getStudentEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Student getStudentEntity(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    @Override
    public StudentDTO createStudent(StudentDTO dto) {
        if (studentRepository.existsByRollNumber(dto.getRollNumber())) {
            throw new DuplicateResourceException("Student with roll number '" + dto.getRollNumber() + "' already exists");
        }
        if (studentRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Student with email '" + dto.getEmail() + "' already exists");
        }

        Student s = new Student();
        s.setRollNumber(dto.getRollNumber().trim());
        s.setFullName(dto.getFullName().trim());
        s.setEmail(dto.getEmail().trim().toLowerCase());
        s.setPhone(dto.getPhone());
        s.setGender(dto.getGender() != null && !dto.getGender().isBlank() ? dto.getGender() : "Other");
        s.setYearOfStudy(dto.getYearOfStudy());
        s.setSemester(dto.getSemester());

        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + dto.getDepartmentId()));
            s.setDepartment(dept);
        }

        return toDTO(studentRepository.save(s));
    }

    @Override
    public StudentDTO updateStudent(Long id, StudentDTO dto) {
        Student s = getStudentEntity(id);

        studentRepository.findByRollNumber(dto.getRollNumber()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new DuplicateResourceException("Roll number '" + dto.getRollNumber() + "' is already in use");
            }
        });

        studentRepository.findByEmail(dto.getEmail()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new DuplicateResourceException("Email '" + dto.getEmail() + "' is already in use");
            }
        });

        s.setRollNumber(dto.getRollNumber().trim());
        s.setFullName(dto.getFullName().trim());
        s.setEmail(dto.getEmail().trim().toLowerCase());
        s.setPhone(dto.getPhone());
        if (dto.getGender() != null && !dto.getGender().isBlank()) {
            s.setGender(dto.getGender());
        }
        s.setYearOfStudy(dto.getYearOfStudy());
        s.setSemester(dto.getSemester());

        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + dto.getDepartmentId()));
            s.setDepartment(dept);
        } else {
            s.setDepartment(null);
        }

        return toDTO(studentRepository.save(s));
    }

    @Override
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }

    private StudentDTO toDTO(Student s) {
        StudentDTO dto = new StudentDTO();
        dto.setId(s.getId());
        dto.setRollNumber(s.getRollNumber());
        dto.setFullName(s.getFullName());
        dto.setEmail(s.getEmail());
        dto.setPhone(s.getPhone());
        dto.setGender(s.getGender());
        dto.setYearOfStudy(s.getYearOfStudy());
        dto.setSemester(s.getSemester());
        if (s.getDepartment() != null) {
            dto.setDepartmentId(s.getDepartment().getId());
            dto.setDepartmentName(s.getDepartment().getName());
            dto.setDepartmentCode(s.getDepartment().getCode());
        }
        dto.setCreatedAt(s.getCreatedAt());
        dto.setUpdatedAt(s.getUpdatedAt());
        return dto;
    }
}
