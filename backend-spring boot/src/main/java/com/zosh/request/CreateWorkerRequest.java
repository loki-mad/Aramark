package com.zosh.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateWorkerRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String role;
    private boolean active;
    private Long restaurantId;
    
    public boolean isActive() {
        return active;
    }
}