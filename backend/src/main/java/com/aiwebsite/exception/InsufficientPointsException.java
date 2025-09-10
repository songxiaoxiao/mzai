package com.aiwebsite.exception;

/**
 * 积分不足异常
 */
public class InsufficientPointsException extends RuntimeException {
    
    public InsufficientPointsException(String message) {
        super(message);
    }
    
    public InsufficientPointsException(String message, Throwable cause) {
        super(message, cause);
    }
}