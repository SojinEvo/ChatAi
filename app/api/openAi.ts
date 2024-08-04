// AI模式配置
const API_CONFIG = {
    "ChatGpt": {
        API_URL: "https://api.openai.com/v1/chat/completions",   // API_URL
        API_KEY: "xxx", // API_KEY
        AI_MODEL: "gpt-4o",  // AI模型
    },
    "QianWen": {
        API_URL: "https://openrouter.ai/api/v1/chat/completions",   // API_URL
        API_KEY: "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", // API_KEY
        AI_MODEL: "qwen/qwen-2-7b-instruct:free",  // AI模型 free (每分钟将限制为20个请求和每天200个请求)
    }
}

export const chatApi = (role: string, content: string, signal: AbortSignal, aiModel: string) => {
    const { API_URL, AI_MODEL, API_KEY } = API_CONFIG[aiModel];
    return fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "HTTP-Referer": `${SITE_URL}`,
            "X-Title": `${SITE_NAME}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": AI_MODEL,
            "messages": [
                { role, content }
            ],
        }),
        signal,
    }).then(res => {
        if (res.status === 200) {
            return res.json()
        } else if (res.status === 429) {
            return {
                "message": "API 此时间段调用次数频繁，请稍后再试。或当天已用完，请更换API_KEY"
            }
        } else if (res.status === 401) {
            return {
                "message": "API_KEY无效，请更换其它AI模型"
            }
        }
        else {
            throw new Error('Fetch failed' + res);
        }
    })
}

const SITE_URL = 'https://chat.qwen.ai'; // 网站地址
const SITE_NAME = 'Chat AI'; // 网站名称
