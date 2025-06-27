package com.zosh.request;

import com.zosh.domain.USER_ROLE;
import lombok.Data;

@Data
public class LoginRequest {

	private String email;
	private String password;
	private USER_ROLE role;

}
