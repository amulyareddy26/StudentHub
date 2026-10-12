package com.studenthub.service.impl;

import com.studenthub.dto.LoginRequest;
import com.studenthub.dto.LoginResponse;
import com.studenthub.dto.UserDTO;
import com.studenthub.entity.User;
import com.studenthub.exception.BadRequestException;
import com.studenthub.exception.ResourceNotFoundException;
import com.studenthub.repository.UserRepository;
import com.studenthub.service.AuthService;
import com.studenthub.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserRepository userRepository, UserService userService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        String loginId = request.getUsername().trim();
        User user = userRepository.findByUsername(loginId)
                .or(() -> userRepository.findByEmail(loginId))
                .orElseThrow(() -> new BadRequestException("Invalid username/email or password"));

        boolean matches = passwordEncoder.matches(request.getPassword(), user.getPassword())
                || request.getPassword().equals(user.getPassword());

        if (!matches) {
            throw new BadRequestException("Invalid username/email or password");
        }

        if ("INACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new BadRequestException("Your account is currently disabled. Please contact the administrator.");
        }

        String token = "sh_jwt_" + UUID.randomUUID().toString().replace("-", "");
        return new LoginResponse(
                true,
                "Authentication successful",
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole()
        );
    }

    @Override
    public UserDTO register(String username, String password, String email, String fullName, String role) {
        return userService.createUser(username, password, email, fullName, role != null ? role : "STUDENT");
    }
}
