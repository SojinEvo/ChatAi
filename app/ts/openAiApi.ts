export interface OpenAiRes {
    choices: OpenAiChoice[];
    created: number;
    id: string;
    model: string;
    object: string;
    usage: OpenAiUsage;
    message: string; // 非200状态码时，会返回错误信息
}

interface OpenAiChoice {
    finish_reason: string;
    index: number;
    logprobs: null | any;
    message: OpenAiMessage;
}

interface OpenAiUsage {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
}

interface OpenAiMessage {
    content: string;
    role: string;
}
