package com.aiwebsite.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@TableName("transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    @TableField("user_id")
    private Long userId;
    
    private TransactionType type;
    
    private Integer amount;
    
    @TableField("balance_after")
    private Integer balanceAfter;
    
    private String description;
    
    @TableField("ai_function")
    private String aiFunction;
    
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    public enum TransactionType {
        RECHARGE,    // 充值
        CONSUME,     // 消费
        REFUND,      // 退款
        BONUS        // 奖励
    }
} 