package com.aiwebsite.controller;

import com.aiwebsite.dto.ApiResponse;
import com.aiwebsite.entity.User;
import com.aiwebsite.service.AiService;
import com.aiwebsite.service.AiChatService;
import com.aiwebsite.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AiController {
    
    private final AiService aiService;
    private final UserService userService;
    private final AiChatService aiChatService;
    
    @PostMapping("/{functionName}")
    public ResponseEntity<ApiResponse<String>> processAiFunction(
            @PathVariable String functionName,
            @RequestBody Map<String, String> request) {
        try {
            String input = request.get("input");
            if (input == null || input.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("输入内容不能为空"));
            }
            
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userService.findByUsername(username).orElseThrow();
            
            String output = aiService.processAiFunction(user.getId(), functionName, input);
            return ResponseEntity.ok(ApiResponse.success("处理成功", output));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<String>> chat(@RequestBody Map<String, String> request) {
        try {
            String message = request.get("message");
            if (message == null || message.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("消息内容不能为空"));
            }
            
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userService.findByUsername(username).orElseThrow();
            
            String response = aiService.chat(user.getId(), message);
            return ResponseEntity.ok(ApiResponse.success("聊天成功", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/code-generation")
    public ResponseEntity<ApiResponse<String>> generateCode(@RequestBody Map<String, String> request) {
        try {
            String requirements = request.get("requirements");
            if (requirements == null || requirements.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("需求描述不能为空"));
            }
            
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userService.findByUsername(username).orElseThrow();
            
            String code = aiService.generateCode(user.getId(), requirements);
            return ResponseEntity.ok(ApiResponse.success("代码生成成功", code));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/text-generation")
    public ResponseEntity<ApiResponse<String>> generateText(@RequestBody Map<String, String> request) {
        try {
            String prompt = request.get("prompt");
            if (prompt == null || prompt.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("提示词不能为空"));
            }
            
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userService.findByUsername(username).orElseThrow();
            
            String text = aiService.generateText(user.getId(), prompt);
            return ResponseEntity.ok(ApiResponse.success("文本生成成功", text));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/document-summary")
    public ResponseEntity<ApiResponse<String>> summarizeDocument(@RequestBody Map<String, String> request) {
        try {
            String document = request.get("document");
            if (document == null || document.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("文档内容不能为空"));
            }
            
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userService.findByUsername(username).orElseThrow();
            
            String summary = aiService.summarizeDocument(user.getId(), document);
            return ResponseEntity.ok(ApiResponse.success("文档摘要成功", summary));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/movie-clip")
    public ResponseEntity<ApiResponse<String>> movieClip(
            @RequestParam("videoFile") MultipartFile videoFile,
            @RequestParam("description") String description,
            @RequestParam("clipType") String clipType,
            @RequestParam("style") String style,
            @RequestParam("targetLength") int targetLength) {
        try {
            if (videoFile.isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("视频文件不能为空"));
            }
            
            if (description == null || description.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("剪辑描述不能为空"));
            }
            
            if (clipType == null || clipType.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("剪辑类型不能为空"));
            }
            
            if (style == null || style.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("剪辑风格不能为空"));
            }
            
            if (targetLength <= 0) {
                return ResponseEntity.badRequest().body(ApiResponse.error("目标时长必须大于0"));
            }
            
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userService.findByUsername(username).orElseThrow();
            
            String clipPlan = aiService.movieClip(user.getId(), description, clipType, style, targetLength);
            return ResponseEntity.ok(ApiResponse.success("电影快剪成功", clipPlan));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/functions/points")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> getFunctionPoints() {
        try {
            Map<String, Integer> points = aiService.getFunctionPoints();
            return ResponseEntity.ok(ApiResponse.success(points));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/functions")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAvailableFunctions() {
        try {
            Map<String, Object> functions = Map.of(
                "chat", Map.of("name", "智能对话", "description", "与AI助手进行智能对话"),
                "text-generation", Map.of("name", "文本生成", "description", "生成创意文本内容"),
                "image-recognition", Map.of("name", "图像识别", "description", "识别图像中的内容"),
                "speech-to-text", Map.of("name", "语音转文字", "description", "将语音转换为文字"),
                "code-generation", Map.of("name", "代码生成", "description", "根据需求生成代码"),
                "document-summary", Map.of("name", "文档总结", "description", "智能总结文档内容"),
                "movie-clip", Map.of("name", "电影快剪", "description", "使用AI智能剪辑视频，快速生成精彩片段")
            );
            return ResponseEntity.ok(ApiResponse.success(functions));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 获取当前AI提供商
     */
    @GetMapping("/provider")
    public ResponseEntity<ApiResponse<String>> getCurrentProvider() {
        try {
            String provider = aiChatService.getCurrentProvider();
            return ResponseEntity.ok(ApiResponse.success("获取成功", provider));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 切换AI提供商
     */
    @PostMapping("/provider/switch")
    public ResponseEntity<ApiResponse<String>> switchProvider(@RequestBody Map<String, String> request) {
        try {
            String provider = request.get("provider");
            if (provider == null || provider.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("提供商不能为空"));
            }
            
            if (!provider.equalsIgnoreCase("openai") && !provider.equalsIgnoreCase("ollama")) {
                return ResponseEntity.badRequest().body(ApiResponse.error("不支持的AI提供商，支持：openai, ollama"));
            }
            
            aiChatService.switchProvider(provider);
            return ResponseEntity.ok(ApiResponse.success("切换成功", "已切换到 " + provider));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
} 