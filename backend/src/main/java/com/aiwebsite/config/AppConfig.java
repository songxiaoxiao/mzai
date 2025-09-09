package com.aiwebsite.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import lombok.Data;

@Data
@Configuration
@ConfigurationProperties(prefix = "app")
public class AppConfig {
    
    private Security security = new Security();
    private Ai ai = new Ai();
    private Database database = new Database();
    
    @Data
    public static class Security {
        private String jwtSecret;
        private long jwtExpiration;
        private String corsOrigins;
    }
    
    @Data
    public static class Ai {
        private OpenAi openAi = new OpenAi();
        private Points points = new Points();
        
        @Data
        public static class OpenAi {
            private String apiKey;
            private String baseUrl;
        }
        
        @Data
        public static class Points {
            private int chat;
            private int textGeneration;
            private int imageRecognition;
            private int speechToText;
            private int codeGeneration;
            private int documentSummary;
        }
    }
    
    @Data
    public static class Database {
        private String url;
        private String username;
        private String password;
        private String driverClassName;
    }
    
    /**
     * OpenAI ChatClient
     */
    @Bean("openAiChatClient")
    public ChatClient openAiChatClient(OpenAiChatModel openAiChatModel) {
        return ChatClient.builder(openAiChatModel).build();
    }
    
    /**
     * Ollama ChatClient
     */
    @Bean("ollamaChatClient")
    public ChatClient ollamaChatClient(OllamaChatModel ollamaChatModel) {
        return ChatClient.builder(ollamaChatModel).build();
    }
    
    /**
     * 默认ChatClient，可以通过配置切换
     */
    @Bean("defaultChatClient")
    @Primary
    public ChatClient defaultChatClient(@Qualifier("openAiChatClient") ChatClient openAiChatClient) {
        // 默认使用OpenAI，可以通过配置切换
        return openAiChatClient;
    }
} 