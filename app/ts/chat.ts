// 聊天数据类型
export interface ChatType {
    role: string; // 角色
    content: string; // 内容
    chatStop?: boolean; // 聊天是否结束
    loading?: boolean; // 加载中状态
    aiMode?: string; // 聊天模式
}

// 弹窗信息
export interface MessageState {
    open: boolean;
    vertical?: 'top' | 'bottom';
    horizontal?: 'left' | 'center' | 'right';
    message: string;
}

// 间歇闪烁读聊天数据
export interface ReadChat {
    chat: ChatType[];
    chatStop: boolean;
    chatCease: boolean;
    chatState: boolean;
    chatPause: boolean;
}