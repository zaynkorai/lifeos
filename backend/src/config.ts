import 'dotenv/config';

// Server Configuration
export const config = {
    // Server
    port: Number(process.env.PORT) || 8001,
    host: process.env.HOST || '0.0.0.0',
    nodeEnv: process.env.NODE_ENV || 'development',

    // CORS
    corsOrigin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001'],

    // Supabase
    supabase: {
        url: process.env.SUPABASE_URL!,
        anonKey: process.env.SUPABASE_ANON_KEY!,
        serviceKey: process.env.SUPABASE_SERVICE_KEY!,
    },

    // OpenAI
    openai: {
        apiKey: process.env.OPENAI_API_KEY!,
        model: process.env.OPENAI_MODEL || 'gpt-4o',
    },

    // Stripe
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY!,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
        prices: {
            starter: process.env.STRIPE_PRICE_STARTER!,
            pro: process.env.STRIPE_PRICE_PRO!,
            team: process.env.STRIPE_PRICE_TEAM!,
        },
    },

    // Google OAuth
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:8001/api/v1/calendar/callback',
    },

    // Rate Limiting
    rateLimit: {
        aiRequestsPerHour: {
            free: 3,
            starter: 10,
            pro: 100,
            team: 500,
        },
    },
} as const;

// Validate required config in production
export function validateConfig(): void {
    if (config.nodeEnv === 'production') {
        const required = [
            'SUPABASE_URL',
            'SUPABASE_SERVICE_KEY',
            'OPENAI_API_KEY',
            'STRIPE_SECRET_KEY',
            'STRIPE_WEBHOOK_SECRET',
        ];

        for (const key of required) {
            if (!process.env[key]) {
                throw new Error(`Missing required environment variable: ${key}`);
            }
        }
    }
}
