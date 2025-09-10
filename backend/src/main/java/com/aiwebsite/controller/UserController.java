package com.aiwebsite.controller;

import com.aiwebsite.dto.ApiResponse;
import com.aiwebsite.dto.UserDto;
import com.aiwebsite.dto.UserUpdateDto;
import com.aiwebsite.entity.User;
import com.aiwebsite.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<User>> getProfile() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userService.findByUsername(username).orElseThrow();
            return ResponseEntity.ok(ApiResponse.success(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<User>> updateProfile(@Valid @RequestBody UserUpdateDto userUpdateDto) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User currentUser = userService.findByUsername(username).orElseThrow();
            
            User updatedUser = userService.updateUser(currentUser.getId(), userUpdateDto);
            return ResponseEntity.ok(ApiResponse.success("更新成功", updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/points")
    public ResponseEntity<ApiResponse<Integer>> getPoints() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userService.findByUsername(username).orElseThrow();
            Integer points = userService.getPoints(user.getId());
            return ResponseEntity.ok(ApiResponse.success(points));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
} 
