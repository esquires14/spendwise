package com.spendwise.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "user_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String currency = "USD";

    @Column(nullable = false)
    private String dateFormat = "MM/DD/YYYY";

    @Column(nullable = false)
    private String defaultReportPeriod = "MONTHLY";

    @Column(nullable = false)
    private boolean budgetAlertsEnabled = true;

    @Column(nullable = false)
    private boolean monthlySummaryEnabled = true;

    @Column(nullable = false)
    private boolean newTransactionAlertsEnabled = false;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
}