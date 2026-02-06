export default function sitemap() {
    return [
        {
            url: 'https://apprankpro.com',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'https://apprankpro.com/add-app',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        // We can't list all dynamic tracker pages, but we list the main ones
    ]
}
