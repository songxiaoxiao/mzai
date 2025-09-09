# 后端重构说明 - MyBatis-Plus + Spring AI

## 重构内容

### 1. 依赖更新
- 移除了 `spring-boot-starter-data-jpa`
- 添加了 `mybatis-plus-boot-starter`
- 添加了 `spring-ai-openai-spring-boot-starter` 和 `spring-ai-ollama-spring-boot-starter`

### 2. 实体类重构
- 移除了所有JPA注解 (`@Entity`, `@Table`, `@Column` 等)
- 添加了MyBatis-Plus注解 (`@TableName`, `@TableId`, `@TableField` 等)
- 移除了JPA的关联关系，改为直接使用外键ID

### 3. 数据访问层重构
- 删除了所有JPA Repository接口
- 创建了MyBatis-Plus Mapper接口：
  - `UserMapper`
  - `AiUsageMapper` 
  - `TransactionMapper`

### 4. 服务层重构
- 更新了 `UserService`，使用 `UserMapper` 替代 `UserRepository`
- 更新了 `AiService`，使用MyBatis-Plus Mapper和Spring AI服务
- 添加了 `AiChatService` 用于与AI模型交互

### 5. 配置更新
- 添加了 `MybatisPlusConfig` 配置类
- 更新了 `application.yml`，添加MyBatis-Plus和Spring AI配置

## 新的AI功能

### 1. 聊天功能
- 端点：`POST /api/ai/chat`
- 参数：`{"message": "用户消息"}`
- 消耗积分：10

### 2. 代码生成
- 端点：`POST /api/ai/code-generation`
- 参数：`{"requirements": "需求描述"}`
- 消耗积分：40

### 3. 文本生成
- 端点：`POST /api/ai/text-generation`
- 参数：`{"prompt": "提示词"}`
- 消耗积分：20

### 4. 文档摘要
- 端点：`POST /api/ai/document-summary`
- 参数：`{"document": "文档内容"}`
- 消耗积分：35

## 配置说明

### MyBatis-Plus配置
```yaml
mybatis-plus:
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  global-config:
    db-config:
      id-type: auto
      logic-delete-field: deleted
      logic-delete-value: 1
      logic-not-delete-value: 0
  mapper-locations: classpath*:/mapper/**/*.xml
```

### Spring AI配置
```yaml
ai:
  openai:
    api-key: your-openai-api-key
    base-url: https://api.openai.com/v1
    chat:
      options:
        model: gpt-3.5-turbo
        temperature: 0.7
        max-tokens: 1000
  ollama:
    base-url: http://localhost:11434
    chat:
      options:
        model: llama2
        temperature: 0.7
```

## 优势

1. **性能提升**：MyBatis-Plus提供了更好的SQL控制和性能优化
2. **AI集成**：Spring AI提供了统一的AI模型访问接口
3. **代码简化**：减少了样板代码，提高了开发效率
4. **灵活性**：支持多种AI模型（OpenAI、Ollama等）

## 注意事项

1. 需要配置正确的AI API密钥
2. 数据库表结构保持不变
3. 所有现有功能都保持兼容
4. 新增的AI功能需要相应的积分系统支持 