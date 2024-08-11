// AI模式配置
export const API_CONFIG = {
    "ChatGpt": {
        API_URL: "https://api.openai.com/v1/chat/completions",   // API_URL
        AI_MODEL: "gpt-4o",  // AI模型
    },
    "QianWen": {
        API_URL: "https://openrouter.ai/api/v1/chat/completions",   // API_URL
        AI_MODEL: "qwen/qwen-2-7b-instruct:free",  // AI模型 free (每分钟将限制为20个请求和每天200个请求)
    }
}


export const SITE_URL = 'https://chat.qwen.ai'; // 网站地址
export const SITE_NAME = 'Chat AI'; // 网站名称
