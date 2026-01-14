import { FastifyInstance } from 'fastify';
import { CreateHabitSchema } from '../types/habit.js';
import { habitService } from '../services/habitService.js';

export async function habitRoutes(fastify: FastifyInstance) {

    // GET /api/habits - Get all habits
    fastify.get('/', async (_request, reply) => {
        const habits = await habitService.findAllHabits();
        return reply.send(habits);
    });

    // POST /api/habits - Create a new habit
    fastify.post('/', async (request, reply) => {
        const result = CreateHabitSchema.safeParse(request.body);

        if (!result.success) {
            return reply.status(400).send({ error: 'Invalid Input', details: result.error });
        }

        const newHabit = await habitService.createHabit(result.data);
        return reply.status(201).send(newHabit);
    });

    // GET /api/habits/matrix - Get full habit matrix for dashboard
    fastify.get('/matrix', async (_request, reply) => {
        const matrix = await habitService.getHabitMatrix(30);
        return reply.send(matrix);
    });

    // POST /api/habits/:habitId/toggle - Toggle a habit log for a specific date
    fastify.post<{ Params: { habitId: string }; Body: { date: string } }>(
        '/:habitId/toggle',
        async (request, reply) => {
            const { habitId } = request.params;
            const { date } = request.body as { date: string };

            if (!date) {
                return reply.status(400).send({ error: 'Date is required (YYYY-MM-DD)' });
            }

            const log = await habitService.toggleHabitLog(habitId, date);
            return reply.send(log);
        }
    );
}
