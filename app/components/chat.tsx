import React, { useEffect, useState, useRef, useCallback } from "react";

import AccountCircle from '@mui/icons-material/AccountCircle';
import ReactMarkdown from 'react-markdown';

import { Box, Stack, IconButton, SvgIcon } from '@mui/material';
import { styled } from '@mui/material/styles';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CachedIcon from '@mui/icons-material/Cached';

import { useReadChat } from "../hooks/chatHooks";

import type { ChatType } from "../ts/chat";

interface ChatProps {
    chat: ChatType[]; // 聊天内容
    chatStop: boolean; // 是否取消生成
    chatState: boolean; // 是否生成状态
    chatPause: boolean; // 是否暂停状态
    onCease: (readChat: string) => void; // 触发停止生成
    onReload: () => void; // 触发重新生成
    onPause: (pauseState: boolean) => void; // 触发暂停
    onChatState: (chatState: boolean) => void; // 触发聊天状态
}
const Chat = (props: ChatProps) => {
    const { chat, chatStop, chatState, chatPause, onCease, onReload, onPause, onChatState } = props;
    const boxShowRef = useRef(null);

    // 停止生成状态
    const [chatCease, setChatCease] = useState(false);

    // 间隙读字
    const { readChat } = useReadChat({ chat, chatStop, chatCease, chatState, chatPause });

    useEffect(() => {
        // 滚动条到最底部
        boxShowRef.current.scrollTop = boxShowRef.current.scrollHeight - boxShowRef.current.clientHeight;

        // 聊天开始
        if (chatState) {
            onPause(false);
        }
        // 聊天结束
        if (!chat[chat.length - 1].loading && chat[chat.length - 1].content.length === readChat.length) {
            onChatState(false);
        }
        return () => {
            setChatCease(false);
        }
    }, [chat, chatState, onChatState, onPause, readChat.length]);

    // 角色样式
    const Role = styled('h4')`
    font-family: ${({ theme }) => theme.typography.subtitle2};
    `;

    // 内容样式
    const Content = styled('span')`
    color: ${({ theme }) => theme.palette.text.secondary};
    font-family: ${({ theme }) => theme.typography.body2};
    `

    // 公共状态样式
    const publicStateStyle = {
        color: '#007bf3',
        width: 32,
        height: 32
    }

    // 停止生成样式
    const Cease = styled(StopCircleIcon)({
        ...publicStateStyle
    });

    // 重新生成样式
    const Reload = styled(CachedIcon)({
        ...publicStateStyle
    });

    // 暂停样式
    const Pause = styled(PauseCircleIcon)({
        ...publicStateStyle
    });

    // 继续样式
    const Resume = styled(PlayCircleIcon)({
        ...publicStateStyle
    });

    // 停止生成触发
    const cease = useCallback(() => {
        setChatCease(true);
        onPause(false);
        onCease(readChat);
    }, [onCease, onPause, readChat])

    // 重新生成触发
    const reload = useCallback(() => {
        onReload();
    }, [onReload])

    // 暂停生成触发
    const pause = useCallback(() => {
        onPause(true);
        onChatState(false);
    }, [onChatState, onPause])

    // 继续生成触发
    const resume = () => {
        onPause(false);
    }

    return (
        <Box className={'contentBox'} ref={boxShowRef} display="flex" flexDirection="column" marginTop={'3vh'} marginBottom={'1vh'}>
            {
                chat.map((item, index) => {
                    return (
                        <Stack key={index} direction="row" spacing={1}>
                            {
                                item.role === 'ChatGPT' ?
                                    <SvgIcon className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                                        <path d="M855.823059 439.235765c10.059294-27.587765 12.589176-55.175529 10.059294-82.82353-2.529882-27.587765-12.528941-55.175529-25.118118-80.293647a216.907294 216.907294 0 0 0-92.822588-85.353412 196.487529 196.487529 0 0 0-125.530353-12.528941 263.951059 263.951059 0 0 0-67.764706-50.176c-25.057882-12.589176-55.175529-17.588706-82.823529-17.588706-42.646588 0-85.293176 12.528941-120.470588 37.647059-35.117176 25.118118-60.235294 60.235294-72.764236 100.412236-30.117647 7.529412-55.235765 20.058353-80.293647 35.117176-22.588235 17.588706-40.176941 40.176941-55.235764 62.765176-22.588235 37.647059-30.117647 80.293647-25.118118 122.940236 5.059765 42.706824 22.588235 82.823529 50.236235 115.471059a188.536471 188.536471 0 0 0-10.059294 82.823529c2.529882 27.587765 12.528941 55.235765 25.118118 80.293647a216.967529 216.967529 0 0 0 92.822588 85.353412 196.427294 196.427294 0 0 0 125.530353 12.528941c20.058353 20.118588 42.646588 37.647059 67.764706 50.236235 25.057882 12.528941 55.175529 17.528471 82.823529 17.528471 42.646588 0 85.293176-12.528941 120.470588-37.647059 35.117176-25.057882 60.235294-60.235294 72.764236-100.352a182.512941 182.512941 0 0 0 77.824-35.177412c22.588235-17.528471 42.646588-37.647059 55.175529-62.704941 22.588235-37.647059 30.117647-80.353882 25.118118-123.00047-4.999529-42.646588-20.058353-82.823529-47.706353-115.471059z m-301.176471 421.647059a146.070588 146.070588 0 0 1-97.882353-35.117177s2.529882-2.529882 5.059765-2.529882l160.587294-92.822589a19.636706 19.636706 0 0 0 10.059294-10.059294c2.529882-4.999529 2.529882-7.529412 2.529883-12.528941V481.882353l67.764705 40.116706v185.765647a147.937882 147.937882 0 0 1-148.118588 153.057882z m-323.764706-137.999059c-17.528471-30.117647-25.057882-65.295059-17.52847-100.412236 0 0 2.469647 2.529882 4.999529 2.529883l160.64753 92.822588A22.588235 22.588235 0 0 0 391.529412 720.414118c4.999529 0 10.059294 0 12.528941-2.529883l195.764706-112.941176v77.824L436.705882 778.059294a148.961882 148.961882 0 0 1-112.941176 15.058824 146.733176 146.733176 0 0 1-92.882824-70.234353z m-42.646588-348.882824c17.588706-30.117647 45.176471-52.705882 77.824-65.234823V499.471059c0 5.059765 0 10.059294 2.469647 12.589176a19.576471 19.576471 0 0 0 10.059294 9.999059l195.764706 112.941177-67.764706 40.176941-160.647529-92.882824c-35.117176-20.058353-60.235294-52.705882-70.234353-90.352941-10.059294-37.647059-7.529412-82.823529 12.528941-117.940706z m554.646588 128l-195.764706-112.941176 67.764706-40.176941 160.64753 92.882823c25.118118 15.058824 45.176471 35.117176 57.705412 60.235294 12.589176 25.118118 20.118588 52.705882 17.588705 82.82353A150.588235 150.588235 0 0 1 752.941176 712.824471V522.059294c0-4.999529 0-9.999059-2.529882-12.528941 0 0-2.469647-4.999529-7.529412-7.529412z m67.764706-100.412235s-2.469647-2.469647-4.999529-2.469647l-160.64753-92.882824c-4.999529-2.529882-7.529412-2.529882-12.528941-2.529882-4.999529 0-10.059294 0-12.528941 2.529882l-195.764706 112.941177V341.353412L587.294118 246.000941c25.118118-15.058824 52.705882-20.058353 82.823529-20.058353 27.587765 0 55.235765 9.999059 80.293647 27.587765 22.588235 17.588706 42.706824 40.176941 52.705882 65.234823 10.059294 25.118118 12.589176 55.235765 7.529412 82.82353z m-421.647059 140.589176l-67.764705-40.176941V313.765647c0-27.587765 7.529412-57.705412 22.588235-80.293647 15.058824-25.118118 37.647059-42.706824 62.765176-55.235765 25.118118-12.528941 55.235765-17.588706 82.82353-12.528941 27.587765 2.469647 55.235765 15.058824 77.824 32.587294 0 0-2.529882 2.529882-5.059765 2.529883L401.588706 293.707294A19.576471 19.576471 0 0 0 391.529412 303.706353c-2.529882 5.059765-2.529882 7.529412-2.529883 12.589176V542.117647z m35.177412-80.353882L512 411.648l87.823059 50.176v100.412235L512 612.412235l-87.823059-50.176V461.824z" p-id="1600"></path>
                                    </SvgIcon>
                                    :
                                    <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            }
                            <Stack spacing={1}>
                                <Role>{item.role}</Role>
                                <Content><ReactMarkdown>{item.role === 'ChatGPT' && index === chat.length - 1 ? readChat : item.content}</ReactMarkdown></Content>
                                {
                                    index === chat.length - 1 && readChat.length > 0 && !chat[chat.length - 1].loading ?
                                        readChat.length !== chat[chat.length - 1].content.length || chatPause ?
                                            <Stack direction="row" spacing={1}>
                                                <span style={{ color: "#0057A3" }}>
                                                    停止生成
                                                    <IconButton id={'case'} aria-label={'case'} onClick={cease}>
                                                        <Cease />
                                                    </IconButton>
                                                </span>
                                                {
                                                    chatPause ?
                                                        <span style={{ color: "#0057A3" }}>继续生成
                                                            <IconButton id={'resume'} aria-label={'resume'} onClick={resume}>
                                                                <Resume />
                                                            </IconButton>
                                                        </span> : <span style={{ color: "#0057A3" }}>暂停生成
                                                            <IconButton id={'pause'} aria-label={'pause'} onClick={pause}>
                                                                <Pause />
                                                            </IconButton>
                                                        </span>
                                                }

                                            </Stack>
                                            : <span style={{ color: "#0057A3" }}>
                                                重新生成
                                                <IconButton id={'reload'} aria-label={'reload'} onClick={reload}>
                                                    <Reload />
                                                </IconButton>
                                            </span>
                                        : null
                                }
                            </Stack>
                        </Stack>
                    )
                })
            }
        </Box>
    )
};

export default React.memo(Chat);