
import { useState, useEffect } from "react";

import type { ReadChat } from "../ts/chat";

const useReadChat = (args: ReadChat) => {
    const { chat, chatStop, chatCease, chatState, chatPause } = args;

    // 间隙读字
    const [readChat, setReadChat] = useState<string>('');

    useEffect(() => {
        if (chatStop) { setReadChat('已取消生成'); return; }
        let index = 0;
        let interval = null;
        if (chatState) {
            setReadChat('');
        } else {
            index = readChat.length;
        }
        interval = setInterval(() => {
            if (index >= chat[chat.length - 1].content.length || chatCease || chatPause) {
                clearInterval(interval);
            }
            else {
                // 间隔读出
                const curIndex = index;
                setReadChat((prev) => prev + chat[chat.length - 1].content[curIndex]);
                index++;
            }
        }, 30);
        return () => clearInterval(interval);
    }, [chat, chatCease, chatPause, chatState, chatStop]);

    return (
        { readChat }
    )
};

export {
    useReadChat
}