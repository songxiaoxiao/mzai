package com.aiwebsite.service.impl;

import com.aiwebsite.service.AbstractAiProcessor;
import com.aiwebsite.service.AiChatService;
import com.aiwebsite.service.AiFunctionConfigService;
import org.springframework.stereotype.Component;

@Component
public class TextGenerationProcessor extends AbstractAiProcessor {
    
    public TextGenerationProcessor(AiFunctionConfigService configService, AiChatService aiChatService) {
        super(configService, aiChatService);
    }
    
    @Override
    public String getFunctionName() {
        return "text-generation";
    }
    
    @Override
    protected String processInternal(String input) {
        return aiChatService.generateText(input);
    }
    
    @Override
    protected String buildSystemPrompt() {
        return "你是一个专业的文本生成助手，请根据用户的需求生成高质量、富有创意的文本内容。注重内容的逻辑性和可读性。";
    }
    
    @Override
    protected boolean validateInputInternal(String input) {
        // 文本生成输入长度限制
        return input.length() >= 10 && input.length() <= 1000;
    }
} 