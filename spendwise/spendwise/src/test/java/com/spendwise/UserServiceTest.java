package com.spendwise;

import com.spendwise.model.User;
import com.spendwise.model.UserSettings;
import com.spendwise.repository.UserRepository;
import com.spendwise.repository.UserSettingsRepository;
import com.spendwise.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserSettingsRepository userSettingsRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("emily");
        testUser.setEmail("emily@example.com");
        testUser.setPassword("hashedpassword");
    }

    @Test
    void testRegisterUser_Success() {
        when(userRepository.existsByUsername("emily")).thenReturn(false);
        when(userRepository.existsByEmail("emily@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashedpassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(userSettingsRepository.save(any(UserSettings.class))).thenReturn(new UserSettings());

        User result = userService.registerUser("emily", "emily@example.com", "password123");

        assertNotNull(result);
        assertEquals("emily", result.getUsername());
        verify(passwordEncoder, times(1)).encode("password123");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterUser_DuplicateUsername_ThrowsException() {
        when(userRepository.existsByUsername("emily")).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                userService.registerUser("emily", "new@example.com", "password123")
        );
        assertEquals("Username already exists", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void testRegisterUser_DuplicateEmail_ThrowsException() {
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("emily@example.com")).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                userService.registerUser("newuser", "emily@example.com", "password123")
        );
        assertEquals("Email already exists", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void testUpdatePassword_WrongCurrentPassword_ThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongpassword", "hashedpassword")).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                userService.updatePassword(1L, "wrongpassword", "newpassword123")
        );
        assertEquals("Current password is incorrect", exception.getMessage());
        verify(userRepository, never()).save(any());
    }
}