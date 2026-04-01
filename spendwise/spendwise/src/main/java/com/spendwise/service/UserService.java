package com.spendwise.service;

import com.spendwise.model.User;
import com.spendwise.model.UserSettings;
import com.spendwise.repository.UserRepository;
import com.spendwise.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserSettingsRepository userSettingsRepository;
    private final PasswordEncoder passwordEncoder;

    // Register a new user
    @Transactional
    public User registerUser(String username, String email, String password) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));

        User savedUser = userRepository.save(user);

        // Create default settings for new user
        UserSettings settings = new UserSettings();
        settings.setUser(savedUser);
        userSettingsRepository.save(settings);

        return savedUser;
    }

    // Find user by username
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Find user by id
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    // Update user profile
    @Transactional
    public User updateUser(Long id, String username, String email) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setUsername(username);
        user.setEmail(email);
        return userRepository.save(user);
    }

    // Update password
    @Transactional
    public void updatePassword(Long id, String currentPassword, String newPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // Delete user
    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}