import gplay from 'google-play-scraper';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const devId = searchParams.get('devId');

    if (!devId) return NextResponse.json([], { status: 400 });

    try {
        const results = await gplay.developer({ devId });
        return NextResponse.json(results);
    } catch (error) {
        console.error('Developer portfolio error:', error);
        return NextResponse.json([]);
    }
}
