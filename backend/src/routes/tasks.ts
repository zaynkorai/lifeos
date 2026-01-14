import { FastifyInstance } from 'fastify';
import { CreateTaskSchema } from '../types/task.js';
import { taskService } from '../services/taskService.js';

export async function taskRoutes(fastify: FastifyInstance) {

    // GET /api/tasks
    fastify.get('/', async (request, reply) => {
        const tasks = await taskService.findAll();
        return reply.send(tasks);
    });

    // POST /api/tasks
    fastify.post('/', async (request, reply) => {
        // Validate input using Zod
        const result = CreateTaskSchema.safeParse(request.body);

        if (!result.success) {
            return reply.status(400).send({ error: 'Invalid Input', details: result.error });
        }

        const newTask = await taskService.create(result.data);
        return reply.status(201).send(newTask);
    });

    // PATCH /api/tasks/:id/complete
    fastify.patch('/:id/complete', async (request, reply) => {
        const { id } = request.params as { id: string };
        const completedTask = await taskService.complete(id);

        if (!completedTask) {
            return reply.status(404).send({ error: 'Task not found' });
        }

        return reply.send(completedTask);
    });
}
