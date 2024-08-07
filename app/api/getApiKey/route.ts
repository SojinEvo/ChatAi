
// 获取apiKey API 
// 请求方式：GET
// 请求地址：/getApiKey
// 请求参数： all or name
// 返回数据：[{ name: 'ChatGpt', value: 'sk-xxxxxx' }]

import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET(req: { url: string | URL; }) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');

    try {
        const client = await clientPromise;
        const db = client.db('ai');
        const collection = db.collection('apikeys');
        if (name) {
            // 获取指定apiKey
            const apiKey = await collection.findOne({ name });
            if (!apiKey) {
                return NextResponse.json({ message: 'API Key not found' }, { status: 404 });
            }
            return NextResponse.json(apiKey, { status: 200 });
        }
        else {
            const apiKeys = await collection.find({}).toArray();
            // 获得所有apiKey 
            return NextResponse.json(apiKeys, { status: 200 })
        }
    } catch (e) {
        console.error(e);
        NextResponse.json({ message: 'Could not connect to database' }, { status: 503 })
    }

}
