package com.spendwise.controller;

import com.spendwise.model.UserSettings;
import com.spendwise.service.UserService;
import com.spendwise.service.UserSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserSettingsService userSettingsService;

    // GET /api/users/{id}/settings
    @GetMapping("/{id}/settings")
    public ResponseEntity<UserSettings> getSettings(@PathVariable Long id) {
        return ResponseEntity.ok(userSettingsService.getSettingsByUserId(id));
    }

    // PUT /api/users/{id}/settings
    @PutMapping("/{id}/settings")
    public ResponseEntity<?> updateSettings(
            @PathVariable Long id,
            @RequestBody Map<String, Object> settings) {
        try {
            UserSettings updated = userSettingsService.updateSettings(
                    id,
                    (String) settings.get("currency"),
                    (String) settings.get("dateFormat"),
                    (String) settings.get("defaultReportPeriod"),
                    (Boolean) settings.getOrDefault("budgetAlertsEnabled", true),
                    (Boolean) settings.getOrDefault("monthlySummaryEnabled", true),
                    (Boolean) settings.getOrDefault("newTransactionAlertsEnabled", false)
            );
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT /api/users/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long id,
            @RequestBody Map<String, String> profile) {
        try {
            return ResponseEntity.ok(userService.updateUser(
                    id,
                    profile.get("username"),
                    profile.get("email")
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT /api/users/{id}/password
    @PutMapping("/{id}/password")
    public ResponseEntity<?> updatePassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> passwords) {
        try {
            userService.updatePassword(
                    id,
                    passwords.get("currentPassword"),
                    passwords.get("newPassword")
            );
            return ResponseEntity.ok("Password updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE /api/users/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("Account deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}