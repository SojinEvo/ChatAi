'use client'
import React, { useEffect } from 'react';

import { Container, TextField } from '@mui/material';

const Config: React.FC = () => {

    // 获得API_KEY 列表
    const getApiKey = async () => {
        // 获取API_KEY列表
        await fetch('/api/getApiKey', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        }).then(res => {
            return res.json()
        }).then((data) => {
            console.log(data);
        })
    }

    useEffect(() => {
        getApiKey();
    }, [])

    return (

        <Container sx={{ display: 'flex', justifyContent: 'center', marginTop: '5%' }}>
            <TextField name={'API_KEY'} label={'API_KEY'}>AA</TextField>
        </Container>

    )
}

export default Config;