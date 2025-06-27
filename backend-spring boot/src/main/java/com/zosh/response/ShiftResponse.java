package com.zosh.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShiftResponse {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private WorkerResponse worker;
    private Long restaurantId;
    private String restaurantName;
    private String notes;
    private String shiftType;
    private String priority;
    private String location;
    private String status;
    private LocalDateTime checkedInTime;
    private LocalDateTime checkedOutTime;
}