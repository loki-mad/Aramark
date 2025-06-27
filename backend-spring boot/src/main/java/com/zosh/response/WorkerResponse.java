package com.zosh.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkerResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private Long restaurantId;
    private String restaurantName;
    private boolean isActive;
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setActive(boolean active) {
        this.isActive = active;
    }
}