package com.spendwise.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "income")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Income extends Transaction {

    @Column(name = "source")
    private String source;
    @Override
    public String getTransactionSummary() {
        return "Income of $" + getAmount() + " from " + source;
    }
}