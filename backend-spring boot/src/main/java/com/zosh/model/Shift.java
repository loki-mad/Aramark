package com.zosh.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Shift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @ManyToOne
    private Worker worker;

    @ManyToOne
    private Restaurant restaurant;

    private String notes;

    // New fields
    private String shiftType; // Regular, Overtime, Training, Special Event, On-Call
    private String priority; // Low, Medium, High
    private String location; // Where the shift takes place

    // Shift status
    private String status = "SCHEDULED"; // SCHEDULED, CHECKED_IN, COMPLETED, CANCELED
    private LocalDateTime checkedInTime;
    private LocalDateTime checkedOutTime;
}