package com.studenthub.service;

import com.studenthub.dto.AcademicRecordDTO;

import java.util.List;

public interface AcademicRecordService {
    List<AcademicRecordDTO> getAllRecords(Long studentId);
    AcademicRecordDTO getRecordById(Long id);
    AcademicRecordDTO createRecord(AcademicRecordDTO dto);
    AcademicRecordDTO updateRecord(Long id, AcademicRecordDTO dto);
    void deleteRecord(Long id);
}
