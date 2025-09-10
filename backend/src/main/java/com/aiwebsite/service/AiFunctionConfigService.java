package com.aiwebsite.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * AI功能配置服务
 * 负责管理AI功能的配置信息，包括积分消耗、描述等
 */
@Slf4j
@Service
public class AiFunctionConfigService {

    // AI功能配置映射
    private final Map<String, AiFunctionConfig> functionConfigs;

    public AiFunctionConfigService(
            @Value("${ai.functions.chat.points:10}") int chatPoints,
            @Value("${ai.functions.text-generation.points:20}") int textGenPoints,
            @Value("${ai.functions.code-generation.points:40}") int codeGenPoints,
            @Value("${ai.functions.document-summary.points:35}") int docSummaryPoints,
            @Value("${ai.functions.movie-clip.points:50}") int movieClipPoints,
            @Value("${ai.functions.image-recognition.points:30}") int imageRecPoints
    ) {
        this.functionConfigs = new HashMap<>();
        initFunctionConfigs(chatPoints, textGenPoints, codeGenPoints, 
                           docSummaryPoints, movieClipPoints, imageRecPoints);
    }

    private void initFunctionConfigs(int chatPoints, int textGenPoints, int codeGenPoints,
                                   int docSummaryPoints, int movieClipPoints, int imageRecPoints) {
        functionConfigs.put("chat", AiFunctionConfig.builder()
            .name("chat")
            .displayName("智能对话")
            .description("与AI助手进行智能对话，获取专业建议和帮助")
            .points(chatPoints)
            .enabled(true)
            .category("communication")
            .build());

        functionConfigs.put("text-generation", AiFunctionConfig.builder()
            .name("text-generation")
            .displayName("文本生成")
            .description("基于您的输入，AI将生成创意文本内容")
            .points(textGenPoints)
            .enabled(true)
            .category("generation")
            .build());

        functionConfigs.put("code-generation", AiFunctionConfig.builder()
            .name("code-generation")
            .displayName("代码生成")
            .description("描述您的需求，AI将为您生成相应的代码")
            .points(codeGenPoints)
            .enabled(true)
            .category("generation")
            .build());

        functionConfigs.put("document-summary", AiFunctionConfig.builder()
            .name("document-summary")
            .displayName("文档总结")
            .description("智能总结文档内容，提取关键信息")
            .points(docSummaryPoints)
            .enabled(true)
            .category("analysis")
            .build());

        functionConfigs.put("movie-clip", AiFunctionConfig.builder()
            .name("movie-clip")
            .displayName("电影快剪")
            .description("使用AI智能剪辑您的视频，快速生成精彩片段")
            .points(movieClipPoints)
            .enabled(true)
            .category("media")
            .build());

        functionConfigs.put("image-recognition", AiFunctionConfig.builder()
            .name("image-recognition")
            .displayName("图像识别")
            .description("上传图片，AI将识别图像中的内容并为您提供详细描述")
            .points(imageRecPoints)
            .enabled(true)
            .category("analysis")
            .build());
    }

    /**
     * 获取功能配置
     */
    @Cacheable("functionConfig")
    public AiFunctionConfig getFunctionConfig(String functionName) {
        AiFunctionConfig config = functionConfigs.get(functionName);
        if (config == null) {
            throw new IllegalArgumentException("未知的AI功能: " + functionName);
        }
        return config;
    }

    /**
     * 获取所有功能的积分配置
     */
    @Cacheable("functionPoints")
    public Map<String, Integer> getFunctionPoints() {
        Map<String, Integer> points = new HashMap<>();
        functionConfigs.forEach((name, config) -> points.put(name, config.getPoints()));
        return points;
    }

    /**
     * 获取所有功能配置
     */
    @Cacheable("allFunctionConfigs")
    public Map<String, AiFunctionConfig> getAllFunctionConfigs() {
        return new HashMap<>(functionConfigs);
    }

    /**
     * 获取启用的功能
     */
    @Cacheable("enabledFunctions")
    public Set<String> getEnabledFunctions() {
        return functionConfigs.entrySet().stream()
            .filter(entry -> entry.getValue().isEnabled())
            .map(Map.Entry::getKey)
            .collect(java.util.stream.Collectors.toSet());
    }

    /**
     * 按分类获取功能
     */
    @Cacheable("functionsByCategory")
    public Map<String, java.util.List<AiFunctionConfig>> getFunctionsByCategory() {
        return functionConfigs.values().stream()
            .filter(AiFunctionConfig::isEnabled)
            .collect(java.util.stream.Collectors.groupingBy(AiFunctionConfig::getCategory));
    }

    /**
     * AI功能配置类
     */
    @lombok.Builder
    @lombok.Data
    public static class AiFunctionConfig {
        private String name;           // 功能名称
        private String displayName;    // 显示名称
        private String description;    // 功能描述
        private int points;           // 积分消耗
        private boolean enabled;      // 是否启用
        private String category;      // 功能分类
    }
}