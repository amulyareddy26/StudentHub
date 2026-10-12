package com.studenthub.repository;

import com.studenthub.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByRollNumber(String rollNumber);
    Optional<Student> findByEmail(String email);
    boolean existsByRollNumber(String rollNumber);
    boolean existsByEmail(String email);
    long countByDepartmentId(Long departmentId);

    @Query("SELECT s FROM Student s WHERE " +
           "(:q IS NULL OR :q = '' OR LOWER(s.fullName) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "OR LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "OR LOWER(s.email) LIKE LOWER(CONCAT('%', :q, '%'))) " +
           "AND (:deptId IS NULL OR s.department.id = :deptId) " +
           "AND (:year IS NULL OR s.yearOfStudy = :year) " +
           "AND (:gender IS NULL OR :gender = '' OR LOWER(s.gender) = LOWER(:gender)) " +
           "ORDER BY s.id DESC")
    List<Student> filterStudents(
            @Param("q") String q,
            @Param("deptId") Long deptId,
            @Param("year") Integer year,
            @Param("gender") String gender
    );

    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(s.fullName) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "OR LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "OR LOWER(s.email) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Student> search(@Param("q") String q);
}
