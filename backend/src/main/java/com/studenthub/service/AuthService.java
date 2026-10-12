package com.studenthub.service;

import com.studenthub.dto.LoginRequest;
import com.studenthub.dto.LoginResponse;
import com.studenthub.dto.UserDTO;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    UserDTO register(String username, String password, String email, String fullName, String role);
}
