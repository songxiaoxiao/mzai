package com.aiwebsite.service.impl;

import com.aiwebsite.service.AiProcessor;
import org.springframework.stereotype.Component;

@Component
public class CodeGenerationProcessor implements AiProcessor {
    
    @Override
    public String getFunctionName() {
        return "code-generation";
    }
    
    @Override
    public int getRequiredPoints() {
        return 40;
    }
    
    @Override
    public boolean validateInput(String input) {
        return input != null && !input.trim().isEmpty();
    }
    
    @Override
    public String process(String input) {
        return "代码生成功能 - 已处理输入: " + input;
    }
} 