import 'dotenv/config';

export default {
    expo: {
        name: 'cat-and-cash-front',
        slug: 'cat-and-cash-front',
        version: '1.0.0',
        scheme: 'catandcash',
        ios: {
            bundleIdentifier: 'com.cau.catncash',
            supportsTablet: true,
          },
        extra: {
            API_BASE_URL: process.env.API_BASE_URL,
            "eas": {
                "projectId": "0f718091-7302-4a48-8691-e8aa706dbff9"
            }
        },
    },
};