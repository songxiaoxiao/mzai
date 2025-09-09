package com.aiwebsite.service;

import com.aiwebsite.dto.UserDto;
import com.aiwebsite.entity.User;
import com.aiwebsite.mapper.UserMapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * 用户服务类
 * 提供用户相关的业务逻辑处理
 */
@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    
    /**
     * 实现UserDetailsService接口，用于Spring Security认证
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userMapper.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("用户不存在: " + username));
    }
    
    /**
     * 用户注册
     * @param userDto 用户注册信息
     * @return 注册成功的用户
     * @throws RuntimeException 当用户名或邮箱已存在时抛出
     */
    @Transactional
    public User register(UserDto userDto) {
        validateRegistrationData(userDto);
        
        User user = createUserFromDto(userDto);
        userMapper.insert(user);
        return user;
    }
    
    /**
     * 根据用户名查找用户
     */
    public Optional<User> findByUsername(String username) {
        return userMapper.findByUsername(username);
    }
    
    /**
     * 根据邮箱查找用户
     */
    public Optional<User> findByEmail(String email) {
        return userMapper.findByEmail(email);
    }
    
    /**
     * 根据ID查找用户
     */
    public Optional<User> findById(Long id) {
        return Optional.ofNullable(userMapper.selectById(id));
    }
    
    /**
     * 更新用户信息
     */
    @Transactional
    public User updateUser(Long userId, UserDto userDto) {
        User user = findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        
        updateUserFields(user, userDto);
        userMapper.updateById(user);
        return user;
    }
    
    /**
     * 更新用户积分
     */
    @Transactional
    public void updatePoints(Long userId, Integer points) {
        User user = findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        user.setPoints(points);
        userMapper.updateById(user);
    }
    
    /**
     * 获取用户积分
     */
    public Integer getPoints(Long userId) {
        return userMapper.findPointsByUserId(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
    }
    
    /**
     * 保存用户
     */
    @Transactional
    public User save(User user) {
        if (user.getId() == null) {
            userMapper.insert(user);
        } else {
            userMapper.updateById(user);
        }
        return user;
    }
    
    /**
     * 验证注册数据
     */
    private void validateRegistrationData(UserDto userDto) {
        if (userMapper.existsByUsername(userDto.getUsername())) {
            throw new RuntimeException("用户名已存在");
        }
        
        if (userMapper.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("邮箱已存在");
        }
    }
    
    /**
     * 从DTO创建用户实体
     */
    private User createUserFromDto(UserDto userDto) {
        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setEmail(userDto.getEmail());
        user.setFullName(userDto.getFullName());
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setPoints(100); // 默认100积分
        return user;
    }
    
    /**
     * 更新用户字段
     */
    private void updateUserFields(User user, UserDto userDto) {
        if (userDto.getFullName() != null) {
            user.setFullName(userDto.getFullName());
        }
        if (userDto.getPhoneNumber() != null) {
            user.setPhoneNumber(userDto.getPhoneNumber());
        }
        if (userDto.getAvatarUrl() != null) {
            user.setAvatarUrl(userDto.getAvatarUrl());
        }
    }
} 