import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import sensible from '@fastify/sensible';
import { config, validateConfig } from './config.js';

// Validate config on startup
validateConfig();

const fastify = Fastify({
    logger: {
        level: config.nodeEnv === 'production' ? 'info' : 'debug',
        transport: config.nodeEnv === 'development' ? {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        } : undefined,
    },
});

// Global error handler
fastify.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    const err = error as Error & { statusCode?: number; issues?: unknown[] };

    // Zod validation errors
    if (err.name === 'ZodError') {
        return reply.status(400).send({
            error: 'Validation Error',
            message: 'Invalid request data',
            details: err.issues,
        });
    }

    // Supabase/Database errors
    if (err.message?.includes('PGRST')) {
        return reply.status(500).send({
            error: 'Database Error',
            message: 'A database error occurred',
        });
    }

    // Default error response
    const statusCode = err.statusCode || 500;
    return reply.status(statusCode).send({
        error: err.name || 'Internal Server Error',
        message: config.nodeEnv === 'production'
            ? 'An unexpected error occurred'
            : err.message,
    });
});

// Plugins
await fastify.register(cors, {
    origin: config.corsOrigin,
    credentials: true,
});

await fastify.register(helmet, {
    contentSecurityPolicy: false,
});

await fastify.register(sensible);

// Health check
fastify.get('/health', async () => {
    return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    };
});

// API version info
fastify.get('/api', async () => {
    return {
        message: 'Welcome to LifeOS API',
        version: '1.0.0',
        docs: '/api/docs',
    };
});

// Register API v1 routes
import { tasksController } from './modules/tasks/tasks.controller.js';
import { aiController } from './modules/ai/ai.controller.js';

fastify.register(tasksController, { prefix: '/api/v1/tasks' });
fastify.register(aiController, { prefix: '/api/v1/ai' });

// Legacy routes (for backward compatibility during migration)
// TODO: Remove these after frontend migration
import { taskRoutes } from './routes/tasks.js';
import { habitRoutes } from './routes/habits.js';
fastify.register(taskRoutes, { prefix: '/api/tasks' });
fastify.register(habitRoutes, { prefix: '/api/habits' });

// Start server
const start = async () => {
    try {
        await fastify.listen({ port: config.port, host: config.host });
        console.log(`
🚀 LifeOS API Server
━━━━━━━━━━━━━━━━━━━━
📍 Running at: http://localhost:${config.port}
🌍 Environment: ${config.nodeEnv}
📚 API Docs: http://localhost:${config.port}/api
━━━━━━━━━━━━━━━━━━━━
    `);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
