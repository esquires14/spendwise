package com.spendwise.service;

import com.spendwise.model.UserSettings;
import com.spendwise.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserSettingsService {

    private final UserSettingsRepository userSettingsRepository;

    public UserSettings getSettingsByUserId(Long userId) {
        return userSettingsRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Settings not found"));
    }

    @Transactional
    public UserSettings updateSettings(Long userId, String currency,
                                       String dateFormat, String defaultReportPeriod,
                                       boolean budgetAlerts, boolean monthlySummary,
                                       boolean newTransactionAlerts) {
        UserSettings settings = userSettingsRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Settings not found"));

        settings.setCurrency(currency);
        settings.setDateFormat(dateFormat);
        settings.setDefaultReportPeriod(defaultReportPeriod);
        settings.setBudgetAlertsEnabled(budgetAlerts);
        settings.setMonthlySummaryEnabled(monthlySummary);
        settings.setNewTransactionAlertsEnabled(newTransactionAlerts);
        return userSettingsRepository.save(settings);
    }
}