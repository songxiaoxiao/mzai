package com.aiwebsite.service;

/**
 * AI处理器接口
 * 定义AI功能的标准处理流程
 */
public interface AiProcessor {
    
    /**
     * 处理AI功能
     * @param input 输入数据
     * @return 处理结果
     */
    String process(String input);
    
    /**
     * 获取功能名称
     * @return 功能名称
     */
    String getFunctionName();
    
    /**
     * 获取消耗积分
     * @return 消耗的积分数量
     */
    int getRequiredPoints();
    
    /**
     * 验证输入数据
     * @param input 输入数据
     * @return 是否有效
     */
    boolean validateInput(String input);
} 