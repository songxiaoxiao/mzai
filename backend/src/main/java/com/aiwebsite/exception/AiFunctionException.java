package com.aiwebsite.exception;

/**
 * AI功能处理异常
 */
public class AiFunctionException extends RuntimeException {
    
    private final String functionName;
    
    public AiFunctionException(String functionName, String message) {
        super(message);
        this.functionName = functionName;
    }
    
    public AiFunctionException(String functionName, String message, Throwable cause) {
        super(message, cause);
        this.functionName = functionName;
    }
    
    public String getFunctionName() {
        return functionName;
    }
}