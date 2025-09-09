package com.aiwebsite.mapper;

import com.aiwebsite.entity.AiUsage;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Mapper
public interface AiUsageMapper extends BaseMapper<AiUsage> {
    
    @Select("SELECT * FROM ai_usage WHERE user_id = #{userId} ORDER BY created_at DESC")
    IPage<AiUsage> findByUserIdOrderByCreatedAtDesc(Page<AiUsage> page, @Param("userId") Long userId);
    
    @Select("SELECT COUNT(*) FROM ai_usage WHERE user_id = #{userId} AND function_name = #{functionName}")
    Long countByUserIdAndFunctionName(@Param("userId") Long userId, @Param("functionName") String functionName);
    
    @Select("SELECT SUM(points_consumed) FROM ai_usage WHERE user_id = #{userId} AND created_at BETWEEN #{startDate} AND #{endDate}")
    Integer sumPointsConsumedByUserIdAndDateRange(@Param("userId") Long userId, 
                                                 @Param("startDate") LocalDateTime startDate, 
                                                 @Param("endDate") LocalDateTime endDate);
    
    @Select("SELECT function_name, COUNT(*) as usageCount, SUM(points_consumed) as totalPoints " +
            "FROM ai_usage WHERE user_id = #{userId} GROUP BY function_name ORDER BY usageCount DESC")
    List<Map<String, Object>> getUsageStatisticsByUserId(@Param("userId") Long userId);
} 