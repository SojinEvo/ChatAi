import { API_CONFIG, SITE_URL, SITE_NAME } from '../config'

export const chatApi = (role: string, content: string, signal: AbortSignal, aiMode: string, API_KEY: string) => {
    const { API_URL, AI_MODEL } = API_CONFIG[aiMode];
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
                "message": "API_KEY无效，请点击头像配置或请更换其它AI模型"
            }
        }
        else {
            console.log('Fetch failed' + res);
            return {
                "message": "接口异常，请重新生成"
            }
        }
    })
}