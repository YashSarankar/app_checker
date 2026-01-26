export const getTimeBasedTheme = (countryCode) => {
    const timezones = {
        'us': 'America/New_York',
        'in': 'Asia/Kolkata',
        'gb': 'Europe/London',
        'ca': 'America/Toronto',
        'au': 'Australia/Sydney',
        'de': 'Europe/Berlin',
        'fr': 'Europe/Paris',
        'br': 'America/Sao_Paulo'
    };

    try {
        const zone = timezones[countryCode?.toLowerCase()] || 'UTC';
        // Get current hour in that timezone
        const date = new Date().toLocaleString("en-US", { timeZone: zone, hour: 'numeric', hour12: false });
        const hour = parseInt(date);

        // Light mode between 6 AM (6) and 6 PM (18)
        return (hour >= 6 && hour < 18) ? 'light' : 'dark';
    } catch (e) {
        return 'dark'; // Fallback
    }
};
