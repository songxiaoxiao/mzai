package com.aiwebsite.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@TableName("ai_usage")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiUsage {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    @TableField("user_id")
    private Long userId;
    
    @TableField("function_name")
    private String functionName;
    
    @TableField("input_data")
    private String inputData;
    
    @TableField("output_data")
    private String outputData;
    
    @TableField("points_consumed")
    private Integer pointsConsumed;
    
    @TableField("execution_time_ms")
    private Long executionTimeMs;
    
    private Status status = Status.SUCCESS;
    
    @TableField("error_message")
    private String errorMessage;
    
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    public enum Status {
        SUCCESS, FAILED, PROCESSING
    }
} 