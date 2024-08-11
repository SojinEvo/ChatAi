'use client'
import React, { createContext, useState, useEffect, ReactNode } from "react";

import FetchRequest from "../api/request";

interface ContextProviderProps {
    children: ReactNode;
}


export const AiKeysConfigContext = createContext({
    aiKeysConfig: [],
    contextState: false,
    setAiKeysConfig: (data: string[]) => { },
    setContextState: (data: boolean) => { }
});

const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
    const [aiKeysConfig, setAiKeysConfig] = useState([]); // aiKeys配置信息
    const [contextState, setContextState] = useState(false); // 状态刷新
    useEffect(() => {
        (async () => {
            const { data } = await FetchRequest('/api/getAiKeys', 'GET');
            setAiKeysConfig(data ?? [])
        })();
        return () => {
            setContextState(false);
        }
    }, [contextState]);

    return (
        <AiKeysConfigContext.Provider value={{ aiKeysConfig, contextState, setAiKeysConfig, setContextState }} >
            {children}
        </AiKeysConfigContext.Provider>
    )
}

export default ContextProvider;