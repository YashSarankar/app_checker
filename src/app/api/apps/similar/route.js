import gplay from 'google-play-scraper';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('appId');

    if (!appId) return NextResponse.json([], { status: 400 });

    try {
        const results = await gplay.similar({ appId });
        return NextResponse.json(results);
    } catch (error) {
        console.error('Similar apps error:', error);
        return NextResponse.json([]);
    }
}
