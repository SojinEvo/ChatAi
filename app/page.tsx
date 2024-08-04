
'use client'

import React from "react";
import { useState, useRef, useEffect } from "react";

import { Container, Box, TextField, IconButton, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import PendingIcon from '@mui/icons-material/Pending';

import Chat from './components/chat';

import { chatApi } from "./api/openAi";

import type { ChatType, MessageState } from './ts/chat';
import type { OpenAiRes } from "./ts/openAiApi";

const ChatAi = () => {

  // 系统用户角色
  const role = 'User';

  // 默认聊天
  const defaultChat = [
    {
      role: 'ChatGPT',
      content: '你好啊,我能帮你做什么吗?'
    }]

  // 聊天记录
  const [chat, setChat] = useState<ChatType[]>(defaultChat);

  // 默认消息配置
  const defaultMessage: MessageState = {
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: '',
  }

  // 弹窗消息
  const [messageState, setMessageState] = useState<MessageState>(defaultMessage)

  // 聊天状态
  const [chatState, setChatState] = useState<boolean>(false);

  // 取消生成
  const [chatStop, setChatStop] = useState<boolean>(false);

  // 弹窗配置
  const { open, vertical, horizontal, message } = messageState;

  // 输入框
  const inputRef = useRef(null);

  // 当前用户发送聊天内容
  const [curContent, setCurContent] = useState('');

  // 暂停状态
  const [chatPause, setChatPause] = useState<boolean>(false);

  // 取消调用
  const [abortSignal, setAbortSignal] = useState(null);

  useEffect(() => {
    // 取消调用当前接口
    if (chatStop && abortSignal) {
      abortSignal.abort();
    }
  }, [chatStop, abortSignal]);

  // 弹窗消息
  const handleClick = (newState: Pick<MessageState, 'horizontal' | 'vertical' | 'message'>) => {
    setMessageState({ ...newState, open: true });
    setTimeout(() => {
      setMessageState({ ...defaultMessage, open: false });
    }, 1000)
  };

  // 生成中
  const chatIng = async (role: string, content: string, reload?: boolean) => {
    setChatState(true);
    setChatStop(false);
    setChat((prevChat) => {
      const loadingChat = { role: 'ChatGPT', content: 'Loading...', loading: true, chatStop: false };
      if (reload) {
        if (prevChat.length === 1) return [...defaultChat]
        prevChat[prevChat.length - 1] = loadingChat;
        return [...prevChat]
      }
      return [...prevChat, { role, content }, loadingChat];
    })
  }

  // 生成完成
  const chatAPiFun = async (role: string, content: string) => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    setAbortSignal(abortController);
    try {
      const res: OpenAiRes = await chatApi(role, content, signal);
      if (res) {
        const resContent = res.choices ? res.choices[0].message.content : res.message;
        setChat((prevChat) => {
          if (!prevChat[prevChat.length - 1].chatStop) {
            prevChat[prevChat.length - 1] = {
              role: 'ChatGPT',
              content: resContent,
              chatStop: false,
            }
          }
          return [...prevChat];
        })
      }
    } catch (error) {
      error.name === 'AbortError' ? console.log('已取消当前接口调用') : console.log(error);
    } finally {
      setAbortSignal(null);
    }
  }

  // 提交交互数据，更新聊天
  const subMit = async () => {
    const content = inputRef.current.value;
    if (chatPause) return handleClick({ vertical: 'top', horizontal: 'center', message: '当前暂停生成，需停止生成' });
    if (content.trim() === '') return handleClick({ vertical: 'top', horizontal: 'center', message: '无内容，请输入' });
    if (chatState) return handleClick({ vertical: 'top', horizontal: 'center', message: '当前回复内容处于生成状态，需停止生成' });
    setCurContent(content);
    await chatIng(role, content);
    await chatAPiFun(role, content);
  }

  // 取消生成
  const stopMit = async () => {
    setChatStop(true);
    setChat((prev) => {
      prev[prev.length - 1] = {
        role: 'ChatGPT',
        content: '已取消生成',
        chatStop: true
      }
      return [
        ...prev,
      ]
    });
  }

  // 监听回车键
  const handleKeyDown = (event: { key: string; preventDefault: () => void; }) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      subMit();
    }
  };

  // 公共图标样式
  const publicIconStyle = {
    background: 'rgba(178, 176, 176, 0.6)',
    color: 'white',
    borderRadius: '10px',
    width: 32,
    height: 32
  }

  // 发送图标样式
  const ArrowUpwardIconBg = styled(ArrowUpwardIcon)({
    ...publicIconStyle
  });

  // 发送ing图标样式
  const PendingIconBg = styled(PendingIcon)({
    ...publicIconStyle
  });

  // 多文本框表单样式
  const CssTextField = styled(TextField)({
    '& div': {
      borderRadius: '20px',
      outline: 'none',
    },
    '& label': {
      lineHeight: '48px'
    }
  });

  return (
    <Container maxWidth={false}>
      <Snackbar anchorOrigin={{ vertical, horizontal }}
        open={open}
        message={message}
        key={vertical + horizontal}
      />
      <Chat chat={chat} chatStop={chatStop} chatState={chatState} chatPause={chatPause} onCease={(val) => setChat((prev) => {
        setChatState(false);
        setChatPause(false);
        prev[prev.length - 1] = {
          role: 'ChatGPT',
          content: val,
        }
        return [
          ...prev,
        ]
      })} onReload={async () => {
        if (chat.length === 1) {
          await chatIng(role, curContent, true);
          return;
        };
        await chatIng(role, curContent, true);
        await chatAPiFun(role, curContent);
      }} onPause={(pauseState) => { setChatPause(pauseState); }} onChatState={(chatState) => { setChatState(chatState); }} />
      <Box className={'textFieldBox'}>
        <CssTextField
          fullWidth
          id="outlined-multiline-flexible"
          label="Message ChatGPT... "
          InputLabelProps={{
            style: { textAlign: 'center' }
          }}
          multiline
          maxRows={3}
          inputRef={inputRef}
          onKeyDownCapture={handleKeyDown}
          autoFocus={chat.length > 1 ? true : false}
          InputProps={{
            endAdornment: (
              <React.Fragment>
                {
                  chat[chat.length - 1].loading ?
                    <IconButton id={'stop'} aria-label={'stop'} onClick={stopMit}>
                      <PendingIconBg />
                    </IconButton> :
                    <IconButton id={'sub'} aria-label={'sub'} onClick={subMit}>
                      <ArrowUpwardIconBg />
                    </IconButton>
                }
              </React.Fragment>
            ),
          }}
        >
        </CssTextField>
      </Box>
    </Container >
  );
}

export default ChatAi;
