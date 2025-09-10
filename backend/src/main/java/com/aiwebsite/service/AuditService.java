package com.aiwebsite.service;

import com.aiwebsite.entity.AiUsage;
import com.aiwebsite.entity.User;
import com.aiwebsite.mapper.AiUsageMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * 审计服务
 * 负责记录AI使用情况、性能监控等
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuditService {
    
    private final AiUsageMapper aiUsageMapper;
    
    /**
     * 记录AI功能使用情况
     */
    public void recordAiUsage(User user, String functionName, String input, 
                             String output, int pointsConsumed, long executionTimeMs, 
                             AiUsage.Status status, String errorMessage) {
        try {
            AiUsage aiUsage = new AiUsage();
            aiUsage.setUserId(user.getId());
            aiUsage.setFunctionName(functionName);
            aiUsage.setInputData(truncateText(input, 1000)); // 限制输入长度
            aiUsage.setOutputData(truncateText(output, 2000)); // 限制输出长度
            aiUsage.setPointsConsumed(pointsConsumed);
            aiUsage.setExecutionTimeMs(executionTimeMs);
            aiUsage.setStatus(status);
            aiUsage.setErrorMessage(errorMessage);
            aiUsage.setCreatedAt(LocalDateTime.now());
            
            aiUsageMapper.insert(aiUsage);
            
            log.info("记录AI使用情况 - 用户: {}, 功能: {}, 状态: {}, 耗时: {}ms", 
                    user.getId(), functionName, status, executionTimeMs);
        } catch (Exception e) {
            log.error("记录AI使用情况失败", e);
        }
    }
    
    /**
     * 记录成功的AI使用
     */
    public void recordSuccess(User user, String functionName, String input, 
                             String output, int pointsConsumed, long executionTimeMs) {
        recordAiUsage(user, functionName, input, output, pointsConsumed, 
                     executionTimeMs, AiUsage.Status.SUCCESS, null);
    }
    
    /**
     * 记录失败的AI使用
     */
    public void recordFailure(User user, String functionName, String input, 
                             int pointsConsumed, long executionTimeMs, String errorMessage) {
        recordAiUsage(user, functionName, input, null, pointsConsumed, 
                     executionTimeMs, AiUsage.Status.FAILED, errorMessage);
    }
    
    /**
     * 记录处理中的AI使用
     */
    public void recordProcessing(User user, String functionName, String input, int pointsConsumed) {
        recordAiUsage(user, functionName, input, null, pointsConsumed, 
                     0L, AiUsage.Status.PROCESSING, null);
    }
    
    /**
     * 截断文本，防止数据过长
     */
    private String truncateText(String text, int maxLength) {
        if (text == null) return null;
        if (text.length() <= maxLength) return text;
        return text.substring(0, maxLength - 3) + "...";
    }
}