import gplay from 'google-play-scraper';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('appId');
    const country = searchParams.get('country') || 'us';
    const lang = searchParams.get('lang') || 'en';

    if (!appId) return NextResponse.json({ error: 'appId is required' }, { status: 400 });

    try {
        const details = await gplay.app({
            appId,
            country,
            lang
        });
        return NextResponse.json(details);
    } catch (error) {
        console.error('Details error:', error);
        return NextResponse.json({ error: 'Failed to fetch details' }, { status: 500 });
    }
}
