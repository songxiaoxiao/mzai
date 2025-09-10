package com.aiwebsite.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

/**
 * 用户更新DTO
 * 用于更新用户信息，所有字段都是可选的
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDto {
    
    @Email(message = "邮箱格式不正确")
    private String email;
    
    @Size(max = 50, message = "姓名长度不能超过50个字符")
    private String fullName;
    
    @Size(max = 20, message = "手机号长度不能超过20个字符")
    private String phoneNumber;
    
    @Size(max = 255, message = "头像URL长度不能超过255个字符")
    private String avatarUrl;
}