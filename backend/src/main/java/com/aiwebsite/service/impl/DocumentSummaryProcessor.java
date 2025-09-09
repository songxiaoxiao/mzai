package com.aiwebsite.service.impl;

import com.aiwebsite.service.AiProcessor;
import org.springframework.stereotype.Component;

@Component
public class DocumentSummaryProcessor implements AiProcessor {
    
    @Override
    public String getFunctionName() {
        return "document-summary";
    }
    
    @Override
    public int getRequiredPoints() {
        return 35;
    }
    
    @Override
    public boolean validateInput(String input) {
        return input != null && !input.trim().isEmpty();
    }
    
    @Override
    public String process(String input) {
        return "文档总结功能 - 已处理输入: " + input;
    }
} 