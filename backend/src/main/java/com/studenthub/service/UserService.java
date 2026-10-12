package com.studenthub.service;

import com.studenthub.dto.UserDTO;
import com.studenthub.entity.User;

import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();
    UserDTO getUserById(Long id);
    UserDTO createUser(String username, String password, String email, String fullName, String role);
    UserDTO updateUser(Long id, UserDTO dto);
    void deleteUser(Long id);
    User findByUsername(String username);
}
