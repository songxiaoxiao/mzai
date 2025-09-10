package com.aiwebsite.service;

import com.aiwebsite.entity.User;
import com.aiwebsite.exception.AiFunctionException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.annotation.PostConstruct;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * AI服务类 - 重构版本
 * 负责协调各种AI功能的处理，职责更加清晰
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AiService {
    
    private final UserService userService;
    private final PointsService pointsService;
    private final AuditService auditService;
    private final AiFunctionConfigService configService;
    private final List<AiProcessor> aiProcessors;
    
    // 处理器映射，提高查找效率
    private Map<String, AiProcessor> processorMap;
    
    @PostConstruct
    public void init() {
        this.processorMap = aiProcessors.stream()
                .collect(Collectors.toMap(AiProcessor::getFunctionName, Function.identity()));
        log.info("已加载 {} 个AI处理器: {}", processorMap.size(), processorMap.keySet());
    }
    
    /**
     * 处理AI功能 - 重构版本
     * @param userId 用户ID
     * @param functionName 功能名称
     * @param input 输入数据
     * @return 处理结果
     */
    @Transactional
    public String processAiFunction(Long userId, String functionName, String input) {
        long startTime = System.currentTimeMillis();
        User user = getUserById(userId);
        AiProcessor processor = getProcessor(functionName);
        int requiredPoints = processor.getRequiredPoints();
        
        // 验证输入
        if (!processor.validateInput(input)) {
            throw new IllegalArgumentException("输入数据无效");
        }
        
        // 检查并扣除积分
        pointsService.deductPoints(userId, requiredPoints, 
            "使用" + configService.getFunctionConfig(functionName).getDisplayName() + "功能", 
            functionName);
        
        try {
            // 处理AI功能
            String output = processor.process(input);
            long executionTime = System.currentTimeMillis() - startTime;
            
            // 记录成功使用
            auditService.recordSuccess(user, functionName, input, output, requiredPoints, executionTime);
            
            return output;
        } catch (Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            
            // 记录失败使用（不退还积分，因为已经消耗了AI资源）
            auditService.recordFailure(user, functionName, input, requiredPoints, executionTime, e.getMessage());
            
            throw e; // 重新抛出异常
        }
    }
    
    /**
     * 电影快剪功能（特殊处理，因为有多个参数）
     */
    @Transactional
    public String movieClip(Long userId, String description, String clipType, String style, int targetLength) {
        // 构建输入参数
        String input = String.format("描述:%s|类型:%s|风格:%s|时长:%d", description, clipType, style, targetLength);
        return processAiFunction(userId, "movie-clip", input);
    }
    
    /**
     * 获取所有功能的积分配置
     */
    public Map<String, Integer> getFunctionPoints() {
        return configService.getFunctionPoints();
    }
    
    /**
     * 获取所有功能配置
     */
    public Map<String, AiFunctionConfigService.AiFunctionConfig> getAllFunctionConfigs() {
        return configService.getAllFunctionConfigs();
    }
    
    /**
     * 检查功能是否可用
     */
    public boolean isFunctionAvailable(String functionName) {
        return processorMap.containsKey(functionName) && 
               configService.getEnabledFunctions().contains(functionName);
    }
    
    // 私有辅助方法
    
    /**
     * 获取处理器
     */
    private AiProcessor getProcessor(String functionName) {
        AiProcessor processor = processorMap.get(functionName);
        if (processor == null) {
            throw new AiFunctionException(functionName, "未知的AI功能: " + functionName);
        }
        return processor;
    }
    
    /**
     * 获取用户信息
     */
    private User getUserById(Long userId) {
        return userService.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("用户不存在: " + userId));
    }
} 