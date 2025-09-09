package com.aiwebsite.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiChatService {
    
    @Autowired
    @Qualifier("defaultChatClient")
    private ChatClient chatClient;
    
    @Autowired
    @Qualifier("openAiChatClient")
    private ChatClient openAiChatClient;
    
    @Autowired
    @Qualifier("ollamaChatClient")
    private ChatClient ollamaChatClient;
    
    @Value("${ai.provider:openai}")
    private String aiProvider;
    
    /**
     * 获取当前使用的ChatClient
     */
    private ChatClient getCurrentChatClient() {
        switch (aiProvider.toLowerCase()) {
            case "ollama":
                return ollamaChatClient;
            case "openai":
            default:
                return openAiChatClient;
        }
    }
    
    /**
     * 发送聊天消息
     */
    public String chat(String message) {
        UserMessage userMessage = new UserMessage(message);
        Prompt prompt = new Prompt(List.of(userMessage));
        ChatClient.CallResponseSpec response = getCurrentChatClient().prompt(prompt).call();
        return response.content();
    }
    
    /**
     * 发送带系统提示的聊天消息
     */
    public String chatWithSystemPrompt(String systemPrompt, String userMessage) {
        Message systemMessage = new org.springframework.ai.chat.messages.SystemMessage(systemPrompt);
        UserMessage userMsg = new UserMessage(userMessage);
        Prompt prompt = new Prompt(List.of(systemMessage, userMsg));
        ChatClient.CallResponseSpec response = getCurrentChatClient().prompt(prompt).call();
        return response.content();
    }
    
    /**
     * 代码生成
     */
    public String generateCode(String requirements) {
        String systemPrompt = "你是一个专业的程序员，请根据用户的需求生成高质量的代码。请只返回代码，不要包含解释。";
        return chatWithSystemPrompt(systemPrompt, requirements);
    }
    
    /**
     * 文本生成
     */
    public String generateText(String prompt) {
        String systemPrompt = "你是一个专业的文本生成助手，请根据用户的需求生成高质量的文本内容。";
        return chatWithSystemPrompt(systemPrompt, prompt);
    }
    
    /**
     * 文档摘要
     */
    public String summarizeDocument(String document) {
        String systemPrompt = "你是一个专业的文档摘要助手，请对给定的文档进行简洁而全面的摘要。";
        return chatWithSystemPrompt(systemPrompt, "请对以下文档进行摘要：\n\n" + document);
    }
    
    /**
     * 电影快剪
     */
    public String movieClip(String description, String clipType, String style, int targetLength) {
        String systemPrompt = "你是一个专业的视频剪辑师，请根据用户的需求提供详细的视频剪辑方案。包括场景选择、剪辑节奏、转场效果、音乐配乐等建议。";
        
        String userPrompt = String.format(
            "请为以下视频剪辑需求提供详细的剪辑方案：\n" +
            "剪辑描述：%s\n" +
            "剪辑类型：%s\n" +
            "剪辑风格：%s\n" +
            "目标时长：%d秒\n\n" +
            "请提供包括场景分析、剪辑建议、转场效果、音乐配乐等详细方案。",
            description, clipType, style, targetLength
        );
        
        return chatWithSystemPrompt(systemPrompt, userPrompt);
    }
    
    /**
     * 获取当前AI提供商
     */
    public String getCurrentProvider() {
        return aiProvider;
    }
    
    /**
     * 切换AI提供商
     */
    public void switchProvider(String provider) {
        this.aiProvider = provider.toLowerCase();
    }
} 
