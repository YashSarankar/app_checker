import gplay from 'google-play-scraper';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || 'us';
    const lang = searchParams.get('lang') || 'en';
    const category = searchParams.get('category') || undefined;

    try {
        const results = await gplay.list({
            category,
            collection: gplay.collection.TOP_FREE,
            num: 10,
            country,
            lang
        });
        return NextResponse.json(results);
    } catch (error) {
        console.error('Charts error:', error);
        return NextResponse.json({ error: 'Failed to fetch charts' }, { status: 500 });
    }
}
