import 'dotenv/config';

export default {
    expo: {
        name: 'cat-and-cash-front',
        slug: 'cat-and-cash-front',
        version: '1.0.0',
        scheme: 'catandcash',
        extra: {
            API_BASE_URL: process.env.API_BASE_URL,
        },
    },
};