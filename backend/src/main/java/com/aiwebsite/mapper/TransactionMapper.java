package com.aiwebsite.mapper;

import com.aiwebsite.entity.Transaction;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface TransactionMapper extends BaseMapper<Transaction> {
    
    @Select("SELECT * FROM transactions WHERE user_id = #{userId} ORDER BY created_at DESC")
    IPage<Transaction> findByUserIdOrderByCreatedAtDesc(Page<Transaction> page, @Param("userId") Long userId);
    
    @Select("SELECT SUM(amount) FROM transactions WHERE user_id = #{userId} AND type = #{type}")
    Integer sumAmountByUserIdAndType(@Param("userId") Long userId, @Param("type") String type);
    
    @Select("SELECT * FROM transactions WHERE user_id = #{userId} AND created_at BETWEEN #{startDate} AND #{endDate} ORDER BY created_at DESC")
    List<Transaction> findByUserIdAndDateRange(@Param("userId") Long userId, 
                                             @Param("startDate") LocalDateTime startDate, 
                                             @Param("endDate") LocalDateTime endDate);
} 