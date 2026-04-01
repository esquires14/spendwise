package com.spendwise.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "expense")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Expense extends Transaction {

    @Column(name = "payment_method")
    private String paymentMethod;

    @Override
    public String getTransactionSummary() {
        return "Expense of $" + getAmount() + " via " + paymentMethod;
    }
}