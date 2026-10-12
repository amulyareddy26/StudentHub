package com.studenthub.service.impl;

import com.studenthub.dto.AcademicRecordDTO;
import com.studenthub.entity.AcademicRecord;
import com.studenthub.entity.Student;
import com.studenthub.exception.ResourceNotFoundException;
import com.studenthub.repository.AcademicRecordRepository;
import com.studenthub.repository.StudentRepository;
import com.studenthub.service.AcademicRecordService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AcademicRecordServiceImpl implements AcademicRecordService {

    private final AcademicRecordRepository academicRecordRepository;
    private final StudentRepository studentRepository;

    public AcademicRecordServiceImpl(AcademicRecordRepository academicRecordRepository, StudentRepository studentRepository) {
        this.academicRecordRepository = academicRecordRepository;
        this.studentRepository = studentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AcademicRecordDTO> getAllRecords(Long studentId) {
        List<AcademicRecord> list = studentId != null ?
                academicRecordRepository.findByStudentId(studentId) :
                academicRecordRepository.findAll();
        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AcademicRecordDTO getRecordById(Long id) {
        AcademicRecord record = academicRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Academic record not found with id: " + id));
        return toDTO(record);
    }

    @Override
    public AcademicRecordDTO createRecord(AcademicRecordDTO dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + dto.getStudentId()));

        AcademicRecord record = new AcademicRecord();
        record.setStudent(student);
        record.setSubject(dto.getSubject());
        record.setSemester(dto.getSemester());
        record.setAcademicYear(dto.getAcademicYear());
        record.setMarksObtained(dto.getMarksObtained());
        record.setMaxMarks(dto.getMaxMarks());
        record.setRemarks(dto.getRemarks());
        record.setAttendance(dto.getAttendance());

        if (dto.getGrade() != null && !dto.getGrade().isBlank()) {
            record.setGrade(dto.getGrade());
        } else {
            record.setGrade(calculateGrade(dto.getMarksObtained(), dto.getMaxMarks()));
        }

        if (dto.getCgpa() != null) {
            record.setCgpa(dto.getCgpa());
        } else {
            record.setCgpa(calculateCgpa(dto.getMarksObtained(), dto.getMaxMarks()));
        }

        return toDTO(academicRecordRepository.save(record));
    }

    @Override
    public AcademicRecordDTO updateRecord(Long id, AcademicRecordDTO dto) {
        AcademicRecord record = academicRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Academic record not found with id: " + id));

        if (dto.getStudentId() != null && !dto.getStudentId().equals(record.getStudent().getId())) {
            Student student = studentRepository.findById(dto.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + dto.getStudentId()));
            record.setStudent(student);
        }

        record.setSubject(dto.getSubject());
        record.setSemester(dto.getSemester());
        record.setAcademicYear(dto.getAcademicYear());
        record.setMarksObtained(dto.getMarksObtained());
        record.setMaxMarks(dto.getMaxMarks());
        record.setRemarks(dto.getRemarks());
        record.setAttendance(dto.getAttendance());

        if (dto.getGrade() != null && !dto.getGrade().isBlank()) {
            record.setGrade(dto.getGrade());
        } else {
            record.setGrade(calculateGrade(dto.getMarksObtained(), dto.getMaxMarks()));
        }

        if (dto.getCgpa() != null) {
            record.setCgpa(dto.getCgpa());
        } else {
            record.setCgpa(calculateCgpa(dto.getMarksObtained(), dto.getMaxMarks()));
        }

        return toDTO(academicRecordRepository.save(record));
    }

    @Override
    public void deleteRecord(Long id) {
        if (!academicRecordRepository.existsById(id)) {
            throw new ResourceNotFoundException("Academic record not found with id: " + id);
        }
        academicRecordRepository.deleteById(id);
    }

    private String calculateGrade(BigDecimal marks, BigDecimal max) {
        if (max == null || max.compareTo(BigDecimal.ZERO) <= 0 || marks == null) return "F";
        double pct = marks.doubleValue() / max.doubleValue() * 100.0;
        if (pct >= 90) return "A+";
        if (pct >= 80) return "A";
        if (pct >= 70) return "B+";
        if (pct >= 60) return "B";
        if (pct >= 50) return "C";
        if (pct >= 40) return "D";
        return "F";
    }

    private BigDecimal calculateCgpa(BigDecimal marks, BigDecimal max) {
        if (max == null || max.compareTo(BigDecimal.ZERO) <= 0 || marks == null) return BigDecimal.ZERO;
        double pct = marks.doubleValue() / max.doubleValue() * 100.0;
        double cgpa = Math.min(10.0, Math.max(0.0, pct / 9.5));
        return BigDecimal.valueOf(cgpa).setScale(2, RoundingMode.HALF_UP);
    }

    private AcademicRecordDTO toDTO(AcademicRecord r) {
        AcademicRecordDTO dto = new AcademicRecordDTO();
        dto.setId(r.getId());
        if (r.getStudent() != null) {
            dto.setStudentId(r.getStudent().getId());
            dto.setStudentName(r.getStudent().getFullName());
            dto.setStudentRollNumber(r.getStudent().getRollNumber());
        }
        dto.setSubject(r.getSubject());
        dto.setSemester(r.getSemester());
        dto.setAcademicYear(r.getAcademicYear());
        dto.setMarksObtained(r.getMarksObtained());
        dto.setMaxMarks(r.getMaxMarks());
        dto.setGrade(r.getGrade());
        dto.setCgpa(r.getCgpa());
        dto.setAttendance(r.getAttendance());
        dto.setRemarks(r.getRemarks());
        return dto;
    }
}
