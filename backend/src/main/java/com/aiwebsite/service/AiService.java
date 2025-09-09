package com.aiwebsite.service;

import com.aiwebsite.entity.AiUsage;
import com.aiwebsite.entity.Transaction;
import com.aiwebsite.entity.User;
import com.aiwebsite.mapper.AiUsageMapper;
import com.aiwebsite.mapper.TransactionMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.annotation.PostConstruct;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * AI服务类
 * 负责协调各种AI功能的处理
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AiService {
    
    private final UserService userService;
    private final TransactionMapper transactionMapper;
    private final AiUsageMapper aiUsageMapper;
    private final AiChatService aiChatService;
    private final List<AiProcessor> aiProcessors;
    
    // 处理器映射，提高查找效率
    private Map<String, AiProcessor> processorMap;
    
    @PostConstruct
    public void init() {
        this.processorMap = aiProcessors.stream()
                .collect(Collectors.toMap(AiProcessor::getFunctionName, Function.identity()));
    }
    
    /**
     * 处理AI功能
     * @param userId 用户ID
     * @param functionName 功能名称
     * @param input 输入数据
     * @return 处理结果
     */
    @Transactional
    public String processAiFunction(Long userId, String functionName, String input) {
        // 获取处理器
        AiProcessor processor = getProcessor(functionName);
        
        // 验证输入
        if (!processor.validateInput(input)) {
            throw new IllegalArgumentException("输入数据无效");
        }
        
        // 检查用户积分
        validateUserPoints(userId, processor.getRequiredPoints());
        
        // 处理AI功能
        String output = processor.process(input);
        
        // 扣除积分并记录
        deductPointsAndRecord(userId, processor, input, output);
        
        return output;
    }
    
    /**
     * 聊天功能
     */
    @Transactional
    public String chat(Long userId, String message) {
        // 检查积分
        validateUserPoints(userId, 10);
        
        // 处理聊天
        String response = aiChatService.chat(message);
        
        // 扣除积分并记录
        deductPointsAndRecord(userId, getProcessor("chat"), message, response);
        
        return response;
    }
    
    /**
     * 代码生成功能
     */
    @Transactional
    public String generateCode(Long userId, String requirements) {
        // 检查积分
        validateUserPoints(userId, 40);
        
        // 生成代码
        String code = aiChatService.generateCode(requirements);
        
        // 扣除积分并记录
        deductPointsAndRecord(userId, getProcessor("code-generation"), requirements, code);
        
        return code;
    }
    
    /**
     * 文本生成功能
     */
    @Transactional
    public String generateText(Long userId, String prompt) {
        // 检查积分
        validateUserPoints(userId, 20);
        
        // 生成文本
        String text = aiChatService.generateText(prompt);
        
        // 扣除积分并记录
        deductPointsAndRecord(userId, getProcessor("text-generation"), prompt, text);
        
        return text;
    }
    
    /**
     * 文档摘要功能
     */
    @Transactional
    public String summarizeDocument(Long userId, String document) {
        // 检查积分
        validateUserPoints(userId, 35);
        
        // 生成摘要
        String summary = aiChatService.summarizeDocument(document);
        
        // 扣除积分并记录
        deductPointsAndRecord(userId, getProcessor("document-summary"), document, summary);
        
        return summary;
    }
    
    /**
     * 电影快剪功能
     */
    @Transactional
    public String movieClip(Long userId, String description, String clipType, String style, int targetLength) {
        // 检查积分
        validateUserPoints(userId, 50);
        
        // 生成剪辑方案
        String clipPlan = aiChatService.movieClip(description, clipType, style, targetLength);
        
        // 扣除积分并记录
        deductPointsAndRecord(userId, getProcessor("movie-clip"), description, clipPlan);
        
        return clipPlan;
    }
    
    /**
     * 获取所有功能的积分配置
     */
    public Map<String, Integer> getFunctionPoints() {
        return aiProcessors.stream()
                .collect(Collectors.toMap(
                    AiProcessor::getFunctionName,
                    AiProcessor::getRequiredPoints
                ));
    }
    
    /**
     * 获取处理器
     */
    private AiProcessor getProcessor(String functionName) {
        AiProcessor processor = processorMap.get(functionName);
        if (processor == null) {
            throw new IllegalArgumentException("未知的AI功能: " + functionName);
        }
        return processor;
    }
    
    /**
     * 验证用户积分
     */
    private void validateUserPoints(Long userId, int requiredPoints) {
        Integer currentPoints = userService.getPoints(userId);
        if (currentPoints < requiredPoints) {
            throw new RuntimeException(
                String.format("积分不足，需要%d积分，当前只有%d积分", requiredPoints, currentPoints)
            );
        }
    }
    
    /**
     * 扣除积分并记录使用情况
     */
    private void deductPointsAndRecord(Long userId, AiProcessor processor, String input, String output) {
        User user = userService.findById(userId).orElseThrow();
        int requiredPoints = processor.getRequiredPoints();
        
        // 扣除积分
        Integer newPoints = user.getPoints() - requiredPoints;
        userService.updatePoints(userId, newPoints);
        
        // 记录交易
        recordTransaction(user, processor, requiredPoints, newPoints);
        
        // 记录AI使用
        recordAiUsage(user, processor, input, output, requiredPoints);
    }
    
    /**
     * 记录交易
     */
    private void recordTransaction(User user, AiProcessor processor, int requiredPoints, int newPoints) {
        Transaction transaction = new Transaction();
        transaction.setUserId(user.getId());
        transaction.setType(Transaction.TransactionType.CONSUME);
        transaction.setAmount(-requiredPoints);
        transaction.setBalanceAfter(newPoints);
        transaction.setDescription("使用" + processor.getFunctionName() + "功能");
        transaction.setAiFunction(processor.getFunctionName());
        transaction.setCreatedAt(LocalDateTime.now());
        transactionMapper.insert(transaction);
    }
    
    /**
     * 记录AI使用情况
     */
    private void recordAiUsage(User user, AiProcessor processor, String input, String output, int requiredPoints) {
        AiUsage aiUsage = new AiUsage();
        aiUsage.setUserId(user.getId());
        aiUsage.setFunctionName(processor.getFunctionName());
        aiUsage.setInputData(input);
        aiUsage.setOutputData(output);
        aiUsage.setPointsConsumed(requiredPoints);
        aiUsage.setExecutionTimeMs(System.currentTimeMillis());
        aiUsage.setStatus(AiUsage.Status.SUCCESS);
        aiUsage.setCreatedAt(LocalDateTime.now());
        aiUsageMapper.insert(aiUsage);
    }
} 