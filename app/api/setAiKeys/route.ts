
// 获取aiKey API (配置aiKey)
// 请求方式：POST
// 请求地址：/setAiKey
// 请求参数：[{},{}]
// 返回数据：{message}

import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export const dynamic = "force-dynamic"; // 确保该路由始终动态生成
export const POST = async (req: NextRequest) => {
    const body = await req.json();
    const { data } = body;
    if (!data) return NextResponse.json({ message: '缺少参数' }, { status: 403 })
    try {
        const client = await clientPromise;
        const db = client.db('ai');
        const collection = await db.collection('aiKeys');
        const empty = await collection.deleteMany({}).then(res => res);
        if (empty.acknowledged) {
            // 设置apiKey
            const result = await collection.insertMany(data).then(res => res);
            if (result.insertedCount) {
                return NextResponse.json({
                    message: '更新成功'
                }, { status: 200 })
            }
        }
        return NextResponse.json({ message: '更新失败' }, { status: 403 })

    } catch (e) {
        console.error(e);
        NextResponse.json({ message: 'Could not connect to database' }, { status: 503 })
    }
}
