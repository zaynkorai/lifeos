import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { tasksService } from './tasks.service.js';
import {
    CreateTaskSchema,
    UpdateTaskSchema,
    CompleteTaskSchema,
    ListTasksQuerySchema,
    TaskIdParamSchema,
} from './tasks.schema.js';
import { authMiddleware, AuthenticatedRequest } from '../../shared/middleware/auth.js';

export async function tasksController(fastify: FastifyInstance): Promise<void> {
    // Apply auth middleware to all routes
    fastify.addHook('preHandler', authMiddleware);

    /**
     * GET /api/v1/tasks - List tasks
     */
    fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
        const { userId } = request as AuthenticatedRequest;
        const query = ListTasksQuerySchema.parse(request.query);

        const result = await tasksService.getTasks(userId, query);

        return reply.send({
            data: result.tasks,
            pagination: {
                total: result.total,
                limit: query.limit,
                offset: query.offset,
            },
        });
    });

    /**
     * GET /api/v1/tasks/:id - Get single task
     */
    fastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        const { userId } = request as AuthenticatedRequest;
        const { id } = TaskIdParamSchema.parse(request.params);

        const task = await tasksService.getTask(userId, id);

        if (!task) {
            return reply.status(404).send({
                error: 'Not Found',
                message: 'Task not found',
            });
        }

        return reply.send({ data: task });
    });

    /**
     * POST /api/v1/tasks - Create task
     */
    fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
        const { userId } = request as AuthenticatedRequest;
        const input = CreateTaskSchema.parse(request.body);

        const task = await tasksService.createTask(userId, input);

        return reply.status(201).send({ data: task });
    });

    /**
     * PATCH /api/v1/tasks/:id - Update task
     */
    fastify.patch('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        const { userId } = request as AuthenticatedRequest;
        const { id } = TaskIdParamSchema.parse(request.params);
        const input = UpdateTaskSchema.parse(request.body);

        const task = await tasksService.updateTask(userId, id, input);

        if (!task) {
            return reply.status(404).send({
                error: 'Not Found',
                message: 'Task not found',
            });
        }

        return reply.send({ data: task });
    });

    /**
     * POST /api/v1/tasks/:id/complete - Mark task as complete
     */
    fastify.post('/:id/complete', async (request: FastifyRequest, reply: FastifyReply) => {
        const { userId } = request as AuthenticatedRequest;
        const { id } = TaskIdParamSchema.parse(request.params);
        const input = CompleteTaskSchema.parse(request.body || {});

        const task = await tasksService.completeTask(userId, id, input);

        if (!task) {
            return reply.status(404).send({
                error: 'Not Found',
                message: 'Task not found',
            });
        }

        return reply.send({ data: task });
    });

    /**
     * DELETE /api/v1/tasks/:id - Delete task
     */
    fastify.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        const { userId } = request as AuthenticatedRequest;
        const { id } = TaskIdParamSchema.parse(request.params);

        const deleted = await tasksService.deleteTask(userId, id);

        if (!deleted) {
            return reply.status(404).send({
                error: 'Not Found',
                message: 'Task not found',
            });
        }

        return reply.status(204).send();
    });
}
