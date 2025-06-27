package com.zosh.request;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateShiftRequest {
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long workerId;
    private Long restaurantId;
    private String notes;
    private String shiftType;
    private String priority;
    private String location;
    private String status;
    private LocalDateTime checkedInTime;
    private LocalDateTime checkedOutTime;
}