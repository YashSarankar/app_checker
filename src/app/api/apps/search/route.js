import gplay from 'google-play-scraper';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term');

    if (!term) {
        return NextResponse.json({ error: 'Term is required' }, { status: 400 });
    }

    try {
        const results = await gplay.search({
            term,
            num: 10,
        });
        return NextResponse.json(results);
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ error: 'Failed to search apps' }, { status: 500 });
    }
}
