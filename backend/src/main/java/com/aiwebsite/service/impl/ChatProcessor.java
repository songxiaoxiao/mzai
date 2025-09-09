package com.aiwebsite.service.impl;

import com.aiwebsite.service.AiProcessor;
import org.springframework.stereotype.Component;

@Component
public class ChatProcessor implements AiProcessor {
    
    @Override
    public String getFunctionName() {
        return "chat";
    }
    
    @Override
    public int getRequiredPoints() {
        return 10;
    }
    
    @Override
    public boolean validateInput(String input) {
        return input != null && !input.trim().isEmpty();
    }
    
    @Override
    public String process(String input) {
        return "聊天功能 - 已处理输入: " + input;
    }
} 