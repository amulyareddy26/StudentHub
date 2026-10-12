package com.studenthub.init;

import com.studenthub.entity.AcademicRecord;
import com.studenthub.entity.Department;
import com.studenthub.entity.Student;
import com.studenthub.entity.User;
import com.studenthub.repository.AcademicRecordRepository;
import com.studenthub.repository.DepartmentRepository;
import com.studenthub.repository.StudentRepository;
import com.studenthub.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final StudentRepository studentRepository;
    private final AcademicRecordRepository academicRecordRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           DepartmentRepository departmentRepository,
                           StudentRepository studentRepository,
                           AcademicRecordRepository academicRecordRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.studentRepository = studentRepository;
        this.academicRecordRepository = academicRecordRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedDepartments();
        seedStudents();
        seedAcademicRecords();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            User admin = new User("admin", passwordEncoder.encode("admin123"), "admin@studenthub.edu", "Dr. Rajesh Sharma (Dean)", "ADMIN");
            User faculty = new User("faculty", passwordEncoder.encode("faculty123"), "faculty@studenthub.edu", "Prof. Sunita Verma", "FACULTY");
            User student = new User("student", passwordEncoder.encode("student123"), "student@studenthub.edu", "Amulya Reddy", "STUDENT");

            userRepository.saveAll(List.of(admin, faculty, student));
            System.out.println(">>> Seeded default users: admin/admin123, faculty/faculty123, student/student123");
        }
    }

    private void seedDepartments() {
        if (departmentRepository.count() == 0) {
            Department cse = new Department("CSE", "Computer Science & Engineering", "Software engineering, algorithms, computing architecture and systems.");
            Department it = new Department("IT", "Information Technology", "Enterprise cloud networks, web development, and cybersecurity.");
            Department ece = new Department("ECE", "Electronics & Communication", "VLSI design, embedded systems, microprocessors and signals.");
            Department aids = new Department("AI_DS", "Artificial Intelligence & Data Science", "Machine learning, neural networks, big data analytics.");
            Department mech = new Department("MECH", "Mechanical Engineering", "Thermodynamics, robotics, CAD/CAM, and automotive dynamics.");

            departmentRepository.saveAll(List.of(cse, it, ece, aids, mech));
            System.out.println(">>> Seeded default academic departments!");
        }
    }

    private void seedStudents() {
        if (studentRepository.count() < 3) {
            Department cse = departmentRepository.findByCode("CSE").orElse(null);
            Department it = departmentRepository.findByCode("IT").orElse(null);
            Department ece = departmentRepository.findByCode("ECE").orElse(null);
            Department aids = departmentRepository.findByCode("AI_DS").orElse(null);

            if (cse == null && departmentRepository.count() > 0) {
                cse = departmentRepository.findAll().get(0);
            }

            Student s1 = createStudentEntity("SH202601", "Amulya Reddy", "amulya.reddy@studenthub.edu", "9876543210", "Female", 3, "6", cse);
            Student s2 = createStudentEntity("SH202602", "Aarav Sharma", "aarav.sharma@studenthub.edu", "9845123456", "Male", 4, "8", cse);
            Student s3 = createStudentEntity("SH202603", "Priya Nair", "priya.nair@studenthub.edu", "9812345678", "Female", 2, "4", it != null ? it : cse);
            Student s4 = createStudentEntity("SH202604", "Rohan Gupta", "rohan.gupta@studenthub.edu", "9823456789", "Male", 3, "5", ece != null ? ece : cse);
            Student s5 = createStudentEntity("SH202605", "Sneha Kulkarni", "sneha.k@studenthub.edu", "9834567890", "Female", 1, "2", aids != null ? aids : cse);
            Student s6 = createStudentEntity("SH202606", "Vikram Patel", "vikram.p@studenthub.edu", "9856789012", "Male", 2, "3", cse);

            for (Student s : List.of(s1, s2, s3, s4, s5, s6)) {
                if (!studentRepository.existsByRollNumber(s.getRollNumber())) {
                    studentRepository.save(s);
                }
            }
            System.out.println(">>> Seeded baseline students!");
        }
    }

    private Student createStudentEntity(String roll, String name, String email, String phone, String gender, int year, String sem, Department dept) {
        Student s = new Student();
        s.setRollNumber(roll);
        s.setFullName(name);
        s.setEmail(email);
        s.setPhone(phone);
        s.setGender(gender);
        s.setYearOfStudy(year);
        s.setSemester(sem);
        s.setDepartment(dept);
        return s;
    }

    private void seedAcademicRecords() {
        if (academicRecordRepository.count() == 0 && studentRepository.count() > 0) {
            List<Student> students = studentRepository.findAll();
            Student amulya = students.get(0);
            Student aarav = students.size() > 1 ? students.get(1) : amulya;

            AcademicRecord r1 = new AcademicRecord();
            r1.setStudent(amulya);
            r1.setSubject("Data Structures & Algorithms");
            r1.setSemester("5");
            r1.setAcademicYear("2025-2026");
            r1.setMarksObtained(new BigDecimal("92.50"));
            r1.setMaxMarks(new BigDecimal("100.00"));
            r1.setGrade("A+");
            r1.setCgpa(new BigDecimal("9.70"));
            r1.setAttendance(new BigDecimal("95.00"));
            r1.setRemarks("Outstanding analytical problem solving");

            AcademicRecord r2 = new AcademicRecord();
            r2.setStudent(amulya);
            r2.setSubject("Database Management Systems");
            r2.setSemester("5");
            r2.setAcademicYear("2025-2026");
            r2.setMarksObtained(new BigDecimal("88.00"));
            r2.setMaxMarks(new BigDecimal("100.00"));
            r2.setGrade("A");
            r2.setCgpa(new BigDecimal("9.20"));
            r2.setAttendance(new BigDecimal("92.00"));
            r2.setRemarks("Excellent SQL query design");

            AcademicRecord r3 = new AcademicRecord();
            r3.setStudent(aarav);
            r3.setSubject("Cloud Architecture & DevOps");
            r3.setSemester("7");
            r3.setAcademicYear("2025-2026");
            r3.setMarksObtained(new BigDecimal("85.00"));
            r3.setMaxMarks(new BigDecimal("100.00"));
            r3.setGrade("A");
            r3.setCgpa(new BigDecimal("8.90"));
            r3.setAttendance(new BigDecimal("89.00"));
            r3.setRemarks("Good hands-on pipeline project");

            academicRecordRepository.saveAll(List.of(r1, r2, r3));
            System.out.println(">>> Seeded academic records!");
        }
    }
}
