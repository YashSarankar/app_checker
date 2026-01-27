import gplay from 'google-play-scraper';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { appId, term, country = 'us', lang = 'en' } = await request.json();

        if (!appId || !term) {
            return NextResponse.json({ error: 'appId and term are required' }, { status: 400 });
        }

        // Search through top 250 apps for the keyword
        let finalPosition = '250+';
        let foundRegion = null;

        const searchResults = await gplay.search({
            term,
            num: 250,
            country,
            lang
        });

        const position = searchResults.findIndex(item => item.appId === appId) + 1;

        if (position > 0) {
            finalPosition = position;
            foundRegion = country;
        }

        return NextResponse.json({
            term,
            position: finalPosition,
            region: foundRegion,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Keyword error:', error);
        return NextResponse.json({ error: 'Failed to find ranking' }, { status: 500 });
    }
}
