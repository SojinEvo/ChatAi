'use client'
import React, { useMemo, useState } from 'react';
import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';

function ChatInput() {

    // 使用useState钩子来管理输入框的值  
    const [inputValue, setInputValue] = useState('');

    // 处理输入框的值变化  
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

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
        <div>
            {/* 受控组件 */}
            <input
                value={inputValue}
                onChange={handleInputChange}
            >
            </input>
            <CssTextField
                autoComplete={inputValue}
                // autoFocus={true}
                fullWidth
                id="outlined-multiline-flexible"
                label="Message Chatbot... "
                InputLabelProps={{
                    style: { textAlign: 'center' }
                }}
                multiline
                maxRows={3}
                value={inputValue}
                onChange={handleInputChange}
            >
            </CssTextField>
        </div>
    );
}

export default ChatInput;