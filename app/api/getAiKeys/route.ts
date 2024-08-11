
// 获取aiKey API (获得所有aiKey 或 指定name的apiKey)
// 请求方式：GET
// 请求地址：/getAiKey
// 请求参数： null or name
// 返回数据：[{ name: 'ChatGpt', value: 'sk-xxxxxx' }]

import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export const GET = async (req: { url: string | URL; }) => {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');

    try {
        const client = await clientPromise;
        const db = client.db('ai');
        const collection = db.collection('aiKeys');

        if (name) {
            // 获取指定apiKey
            const apiKey = await collection.findOne({ name });
            if (!apiKey) {
                return NextResponse.json({ message: 'AI Key not found' }, { status: 404 });
            }
            return NextResponse.json(apiKey, { status: 200 });
        }
        else {
            const aiKeys = await collection.find({}).toArray();
            // 获得所有apiKey 
            return NextResponse.json({ data: aiKeys, message: '获得aiKeys成功' }, { status: 200 })
        }
    } catch (e) {
        console.error(e);
        NextResponse.json({ message: 'Could not connect to database' }, { status: 503 })
    }
}

