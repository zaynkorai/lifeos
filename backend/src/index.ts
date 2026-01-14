import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import sensible from '@fastify/sensible';

const fastify = Fastify({
    logger: {
        level: 'info',
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    },
});

// Plugins
await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN ?? ['http://localhost:3001'],
    credentials: true,
});

await fastify.register(helmet, {
    contentSecurityPolicy: false,
});

await fastify.register(sensible);

// Health check
fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
});

// API routes
import { taskRoutes } from './routes/tasks.js';
import { habitRoutes } from './routes/habits.js';
fastify.register(taskRoutes, { prefix: '/api/tasks' });
fastify.register(habitRoutes, { prefix: '/api/habits' });

fastify.get('/api', async () => {
    return { message: 'Welcome to LifeOS API', version: '1.0.0' };
});

// Start server
const start = async () => {
    try {
        const port = Number(process.env.PORT) || 8001;
        const host = process.env.HOST || '0.0.0.0';

        await fastify.listen({ port, host });
        console.log(`🚀 Server running at http://localhost:${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
