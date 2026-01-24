import gplay from 'google-play-scraper';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { appId, term } = await request.json();

        if (!appId || !term) {
            return NextResponse.json({ error: 'appId and term are required' }, { status: 400 });
        }

        // Scrape Ranking live
        const results = await gplay.search({
            term,
            num: 250,
        });

        const position = results.findIndex(item => item.appId === appId) + 1;
        const finalPosition = position > 0 ? position : '250+';

        return NextResponse.json({
            term,
            position: finalPosition,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Keyword error:', error);
        return NextResponse.json({ error: 'Failed to find ranking' }, { status: 500 });
    }
}
