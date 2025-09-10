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
            
            // 检查功能是否可用
            if (!aiService.isFunctionAvailable(functionName)) {
                return ResponseEntity.badRequest().body(
                    ApiResponse.error("功能不可用: " + functionName)
                );
            }
            
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userService.findByUsername(username).orElseThrow();
            
            String output = aiService.processAiFunction(user.getId(), functionName, input);
            return ResponseEntity.ok(ApiResponse.success("处理成功", output));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 聊天功能 - 保留独立接口以保持兼容性
     */
    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<String>> chat(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("消息内容不能为空"));
        }
        
        // 转发到通用处理接口
        request.put("input", message);
        return processAiFunction("chat", request);
    }
    
    /**
     * 代码生成功能 - 保留独立接口以保持兼容性
     */
    @PostMapping("/code-generation")
    public ResponseEntity<ApiResponse<String>> generateCode(@RequestBody Map<String, String> request) {
        String requirements = request.get("requirements");
        if (requirements == null || requirements.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("需求描述不能为空"));
        }
        
        // 转发到通用处理接口
        request.put("input", requirements);
        return processAiFunction("code-generation", request);
    }
    
    /**
     * 文本生成功能 - 保留独立接口以保持兼容性
     */
    @PostMapping("/text-generation")
    public ResponseEntity<ApiResponse<String>> generateText(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        if (prompt == null || prompt.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("提示词不能为空"));
        }
        
        // 转发到通用处理接口
        request.put("input", prompt);
        return processAiFunction("text-generation", request);
    }
    
    /**
     * 文档摘要功能 - 保留独立接口以保持兼容性
     */
    @PostMapping("/document-summary")
    public ResponseEntity<ApiResponse<String>> summarizeDocument(@RequestBody Map<String, String> request) {
        String document = request.get("document");
        if (document == null || document.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("文档内容不能为空"));
        }
        
        // 转发到通用处理接口
        request.put("input", document);
        return processAiFunction("document-summary", request);
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
    public ResponseEntity<ApiResponse<Object>> getAvailableFunctions() {
        try {
            // 使用配置服务获取功能信息
            var functions = aiService.getAllFunctionConfigs();
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