import gplay from 'google-play-scraper';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('appId');
    const country = searchParams.get('country') || 'us';

    if (!appId) return NextResponse.json({ reviews: [], statistics: {} }, { status: 400 });

    try {
        const results = await gplay.reviews({
            appId,
            sort: gplay.sort.NEWEST,
            num: 15,
            country
        });

        // Simple mock sentiment analysis based on keyword frequency
        const positiveWords = ['good', 'great', 'awesome', 'best', 'useful', 'nice', 'smooth', 'excellent', 'love', 'easy'];
        const negativeWords = ['bad', 'worst', 'poor', 'slow', 'crash', 'bugs', 'terrible', 'useless', 'difficult', 'waste'];

        let posCount = 0;
        let negCount = 0;

        const processedReviews = results.data.map(review => {
            const text = review.text.toLowerCase();
            let sentiment = 'neutral';

            const hasPos = positiveWords.some(word => text.includes(word));
            const hasNeg = negativeWords.some(word => text.includes(word));

            if (hasPos && !hasNeg) {
                sentiment = 'positive';
                posCount++;
            } else if (hasNeg && !hasPos) {
                sentiment = 'negative';
                negCount++;
            }

            return {
                userName: review.userName,
                text: review.text,
                score: review.score,
                date: review.date,
                sentiment
            };
        });

        return NextResponse.json({
            reviews: processedReviews,
            statistics: {
                totalAnalysed: processedReviews.length,
                positive: posCount,
                negative: negCount,
                neutral: processedReviews.length - (posCount + negCount)
            }
        });
    } catch (error) {
        console.error('Reviews error:', error);
        return NextResponse.json({ reviews: [], statistics: {} });
    }
}
