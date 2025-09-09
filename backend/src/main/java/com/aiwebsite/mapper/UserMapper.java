package com.aiwebsite.mapper;

import com.aiwebsite.entity.User;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.Optional;

@Mapper
public interface UserMapper extends BaseMapper<User> {
    
    @Select("SELECT * FROM users WHERE username = #{username}")
    Optional<User> findByUsername(@Param("username") String username);
    
    @Select("SELECT * FROM users WHERE email = #{email}")
    Optional<User> findByEmail(@Param("email") String email);
    
    @Select("SELECT COUNT(*) FROM users WHERE username = #{username}")
    boolean existsByUsername(@Param("username") String username);
    
    @Select("SELECT COUNT(*) FROM users WHERE email = #{email}")
    boolean existsByEmail(@Param("email") String email);
    
    @Select("SELECT points FROM users WHERE id = #{userId}")
    Optional<Integer> findPointsByUserId(@Param("userId") Long userId);
} 