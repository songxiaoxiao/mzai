package com.aiwebsite.service;

import com.aiwebsite.exception.AiFunctionException;
import com.aiwebsite.service.AiFunctionConfigService.AiFunctionConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * AI处理器抽象基类
 * 提供通用的处理逻辑和配置管理
 */
@Slf4j
@RequiredArgsConstructor
public abstract class AbstractAiProcessor implements AiProcessor {
    
    protected final AiFunctionConfigService configService;
    protected final AiChatService aiChatService;
    
    @Override
    public final String process(String input) {
        long startTime = System.currentTimeMillis();
        
        try {
            log.debug("开始处理AI功能 [{}]: {}", getFunctionName(), input);
            
            String result = processInternal(input);
            
            long executionTime = System.currentTimeMillis() - startTime;
            log.info("AI功能 [{}] 处理成功，耗时: {}ms", getFunctionName(), executionTime);
            
            return result;
        } catch (Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            log.error("AI功能 [{}] 处理失败，耗时: {}ms", getFunctionName(), executionTime, e);
            throw new AiFunctionException(getFunctionName(), "AI功能处理失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    public final int getRequiredPoints() {
        return configService.getFunctionConfig(getFunctionName()).getPoints();
    }
    
    @Override
    public boolean validateInput(String input) {
        if (input == null || input.trim().isEmpty()) {
            return false;
        }
        
        // 基本长度限制
        if (input.length() > 10000) {
            return false;
        }
        
        return validateInputInternal(input);
    }
    
    /**
     * 子类实现具体的处理逻辑
     */
    protected abstract String processInternal(String input);
    
    /**
     * 子类可以重写此方法进行特定的输入验证
     */
    protected boolean validateInputInternal(String input) {
        return true;
    }
    
    /**
     * 获取功能配置
     */
    protected AiFunctionConfig getConfig() {
        return configService.getFunctionConfig(getFunctionName());
    }
    
    /**
     * 构建系统提示词
     */
    protected String buildSystemPrompt() {
        return "你是一个专业的AI助手，请根据用户的需求提供高质量的服务。";
    }
}