import gplay from 'google-play-scraper';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term');

    if (!term) return NextResponse.json([]);

    try {
        const results = await gplay.suggest({ term });
        return NextResponse.json(results);
    } catch (error) {
        console.error('Suggest error:', error);
        return NextResponse.json([]);
    }
}
