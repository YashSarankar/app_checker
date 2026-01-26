import gplay from 'google-play-scraper';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term');
    const country = searchParams.get('country') || 'us';
    const lang = searchParams.get('lang') || 'en';

    try {
        const results = await gplay.search({
            term,
            num: 15,
            country,
            lang
        });
        return NextResponse.json(results);
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ error: 'Failed to search apps' }, { status: 500 });
    }
}
