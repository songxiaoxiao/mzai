package com.aiwebsite.service.impl;

import com.aiwebsite.service.AbstractAiProcessor;
import com.aiwebsite.service.AiChatService;
import com.aiwebsite.service.AiFunctionConfigService;
import org.springframework.stereotype.Component;

@Component
public class ChatProcessor extends AbstractAiProcessor {
    
    public ChatProcessor(AiFunctionConfigService configService, AiChatService aiChatService) {
        super(configService, aiChatService);
    }
    
    @Override
    public String getFunctionName() {
        return "chat";
    }
    
    @Override
    protected String processInternal(String input) {
        return aiChatService.chat(input);
    }
    
    @Override
    protected boolean validateInputInternal(String input) {
        // 聊天输入长度限制
        return input.length() <= 2000;
    }
} 