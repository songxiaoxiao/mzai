package com.aiwebsite.service;

import com.aiwebsite.entity.Transaction;
import com.aiwebsite.entity.User;
import com.aiwebsite.exception.InsufficientPointsException;
import com.aiwebsite.mapper.TransactionMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * 积分管理服务
 * 专门负责积分的扣除、充值、查询等操作
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PointsService {
    
    private final UserService userService;
    private final TransactionMapper transactionMapper;
    
    /**
     * 验证用户积分是否足够
     */
    public void validatePoints(Long userId, int requiredPoints) {
        Integer currentPoints = userService.getPoints(userId);
        if (currentPoints < requiredPoints) {
            throw new InsufficientPointsException(
                String.format("积分不足，需要%d积分，当前只有%d积分", requiredPoints, currentPoints)
            );
        }
    }
    
    /**
     * 扣除用户积分
     */
    @Transactional
    public Integer deductPoints(Long userId, int points, String reason, String functionName) {
        User user = userService.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("用户不存在"));
        
        // 验证积分是否足够
        validatePoints(userId, points);
        
        // 扣除积分
        Integer newPoints = user.getPoints() - points;
        userService.updatePoints(userId, newPoints);
        
        // 记录交易
        recordTransaction(user, Transaction.TransactionType.CONSUME, 
                         -points, newPoints, reason, functionName);
        
        log.info("用户{}扣除积分{}, 原因: {}, 余额: {}", userId, points, reason, newPoints);
        return newPoints;
    }
    
    /**
     * 充值积分
     */
    @Transactional
    public Integer addPoints(Long userId, int points, String reason) {
        User user = userService.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("用户不存在"));
        
        Integer newPoints = user.getPoints() + points;
        userService.updatePoints(userId, newPoints);
        
        // 记录交易
        recordTransaction(user, Transaction.TransactionType.RECHARGE, 
                         points, newPoints, reason, null);
        
        log.info("用户{}充值积分{}, 原因: {}, 余额: {}", userId, points, reason, newPoints);
        return newPoints;
    }
    
    /**
     * 奖励积分
     */
    @Transactional
    public Integer rewardPoints(Long userId, int points, String reason) {
        User user = userService.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("用户不存在"));
        
        Integer newPoints = user.getPoints() + points;
        userService.updatePoints(userId, newPoints);
        
        // 记录交易
        recordTransaction(user, Transaction.TransactionType.BONUS, 
                         points, newPoints, reason, null);
        
        log.info("用户{}获得奖励积分{}, 原因: {}, 余额: {}", userId, points, reason, newPoints);
        return newPoints;
    }
    
    /**
     * 记录交易
     */
    private void recordTransaction(User user, Transaction.TransactionType type, 
                                  int amount, int balanceAfter, String description, String functionName) {
        Transaction transaction = new Transaction();
        transaction.setUserId(user.getId());
        transaction.setType(type);
        transaction.setAmount(amount);
        transaction.setBalanceAfter(balanceAfter);
        transaction.setDescription(description);
        transaction.setAiFunction(functionName);
        transaction.setCreatedAt(LocalDateTime.now());
        transactionMapper.insert(transaction);
    }
    
    /**
     * 获取用户积分余额
     */
    public Integer getUserBalance(Long userId) {
        return userService.getPoints(userId);
    }
}