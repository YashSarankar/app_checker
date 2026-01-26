import gplay from 'google-play-scraper';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { appId, term, country = 'us', lang = 'en' } = await request.json();

        if (!appId || !term) {
            return NextResponse.json({ error: 'appId and term are required' }, { status: 400 });
        }

        // Quantum Depth Logic: Patched to search up to 1000 positions
        let finalPosition = '1000+';
        let foundRegion = null;
        let isDeepFound = false;

        const primaryResults = await gplay.search({
            term,
            num: 1000, // Patched core to allow this
            country,
            lang
        });

        const pos = primaryResults.findIndex(item => item.appId === appId) + 1;

        if (pos > 0) {
            finalPosition = pos;
            foundRegion = country;
            isDeepFound = true;
        } else {
            // Niche Permutation Scan: If invisible in Top 1000, find the closest entry point
            const niches = [`${term} app`, `best ${term}`, `${term} manager`, `${term} tracker`].slice(0, 3);
            for (const niche of niches) {
                try {
                    const results = await gplay.search({ term: niche, num: 250, country, lang });
                    const p = results.findIndex(item => item.appId === appId) + 1;
                    if (p > 0) {
                        finalPosition = `#${p} (found via "${niche}")`;
                        foundRegion = country;
                        isDeepFound = true;
                        break;
                    }
                } catch (e) { }
            }
        }

        return NextResponse.json({
            term,
            position: finalPosition,
            region: foundRegion,
            isQuantumScan: !isDeepFound,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Keyword error:', error);
        return NextResponse.json({ error: 'Failed to find ranking' }, { status: 500 });
    }
}
