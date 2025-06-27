package com.zosh.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkerAuthResponse {
    private String message;
    private Long workerId;
    private String name;
    private String role;
    private Long restaurantId;
    private String restaurantName;
}