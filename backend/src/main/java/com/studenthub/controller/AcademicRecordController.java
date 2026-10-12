package com.studenthub.controller;

import com.studenthub.dto.AcademicRecordDTO;
import com.studenthub.entity.AcademicRecord;
import com.studenthub.entity.Student;
import com.studenthub.service.AcademicRecordService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/academic-records")
public class AcademicRecordController {

    private final AcademicRecordService academicRecordService;

    public AcademicRecordController(AcademicRecordService academicRecordService) {
        this.academicRecordService = academicRecordService;
    }

    @GetMapping
    public ResponseEntity<List<AcademicRecordDTO>> getAllRecords(@RequestParam(required = false) Long studentId) {
        return ResponseEntity.ok(academicRecordService.getAllRecords(studentId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AcademicRecordDTO> getRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(academicRecordService.getRecordById(id));
    }

    @PostMapping
    public ResponseEntity<AcademicRecordDTO> createRecord(@RequestBody AcademicRecordDTO dto) {
        AcademicRecordDTO created = academicRecordService.createRecord(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AcademicRecordDTO> updateRecord(@PathVariable Long id, @RequestBody AcademicRecordDTO dto) {
        AcademicRecordDTO updated = academicRecordService.updateRecord(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRecord(@PathVariable Long id) {
        academicRecordService.deleteRecord(id);
    }
}
