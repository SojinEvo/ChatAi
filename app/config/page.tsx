'use client'
import React, { useContext, useEffect } from 'react';

import { Box, Button, Grid, TextField, Typography } from '@mui/material';

import FetchRequest from '../api/request';
import { AiKeysConfigContext } from '../context';


interface AiKey {
    name: string,
    value: string
}

const Config: React.FC = () => {
    const [aiKey, setAiKey] = React.useState<AiKey[]>([]);

    // 获得全局context
    const { aiKeysConfig } = useContext(AiKeysConfigContext);

    useEffect(() => {
        setAiKey(aiKeysConfig)
    }, [aiKeysConfig])

    const handelChange = (e: any) => {
        setAiKey((pre: AiKey[]) => {
            const { name, value } = e.target
            const index = pre.findIndex((item) => item.name === name);
            pre[index].value = value
            return [...pre]
        })
    }
    const subMit = async () => {
        const resData = aiKey.reduce((pre, cur) => {
            const { name, value } = cur;
            return pre && pre.concat({ name, value })
        }, []);
        const { message } = await FetchRequest('/api/setAiKey', 'POST', { data: resData });
        console.log('message', message);
    }
    return (
        <React.Fragment>
            <Typography variant={'h5'} marginTop={3} marginLeft={2} gutterBottom>配置AI_KEYS</Typography>
            <Grid container spacing={2} margin={'0 auto'} maxHeight={'50%'} overflow={'auto'}>
                {
                    aiKey?.length > 0 ?
                        aiKey.map((data, index) => {
                            const { name, value } = data
                            return (
                                <Grid item xs={2} key={index}>
                                    <TextField key={index} name={name} label={name} defaultValue={value} onChange={handelChange}>
                                    </TextField>
                                </Grid>
                            )
                        }) : <Typography marginTop={3} marginLeft={2} gutterBottom>无数据</Typography>
                }

            </Grid>
            {aiKey?.length > 0 && <Button onClick={subMit}>提交</Button>}
        </React.Fragment>
    )
}

export default Config;