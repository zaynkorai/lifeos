import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { aiService } from './ai.service.js';
import { tasksService } from '../tasks/tasks.service.js';
import { PlanDayRequestSchema, TaskBreakdownRequestSchema } from './ai.schema.js';
import { authMiddleware, AuthenticatedRequest } from '../../shared/middleware/auth.js';
import { getSupabaseAdmin, ProfileRow, SubscriptionRow } from '../../shared/db/supabase.js';
import { config } from '../../config.js';

export async function aiController(fastify: FastifyInstance): Promise<void> {
    // Apply auth middleware to all routes
    fastify.addHook('preHandler', authMiddleware);

    /**
     * POST /api/v1/ai/plan-day - Generate AI-powered daily schedule
     */
    fastify.post('/plan-day', async (request: FastifyRequest, reply: FastifyReply) => {
        const { userId, userTier } = request as AuthenticatedRequest;
        const body = PlanDayRequestSchema.parse(request.body || {});

        // Check rate limits based on tier
        const allowed = await checkAIRateLimit(userId, userTier);
        if (!allowed) {
            return reply.status(429).send({
                error: 'Too Many Requests',
                message: 'AI request limit reached for your plan. Upgrade for more.',
            });
        }

        // Get target date (default to today in user's timezone)
        const targetDate = body.target_date || new Date().toISOString().split('T')[0];

        // Get user preferences
        const supabase = getSupabaseAdmin();
        const { data: profile } = await supabase
            .from('profiles')
            .select('timezone, preferences')
            .eq('id', userId)
            .single();

        const profileData = profile as ProfileRow | null;
        const timezone = profileData?.timezone || 'UTC';
        const prefs = profileData?.preferences as Record<string, unknown> || {};

        const preferences = {
            timezone,
            peakHoursStart: (prefs.peakHoursStart as string) || '09:00',
            peakHoursEnd: (prefs.peakHoursEnd as string) || '12:00',
            maxFocusHours: Number(prefs.maxFocusHours) || 6,
        };

        // Get tasks for planning
        const tasks = await tasksService.getTasksForPlanning(userId, targetDate);

        if (tasks.length === 0) {
            return reply.send({
                data: {
                    scheduledTasks: [],
                    unscheduledTasks: [],
                    insights: ['No pending tasks to schedule. Create some tasks first!'],
                    warnings: [],
                },
            });
        }

        // Get calendar events for the target date
        const startOfDay = `${targetDate}T00:00:00.000Z`;
        const endOfDay = `${targetDate}T23:59:59.999Z`;

        const { data: calendarEvents } = await supabase
            .from('calendar_events')
            .select('title, start_time, end_time, is_all_day')
            .eq('user_id', userId)
            .gte('start_time', startOfDay)
            .lte('start_time', endOfDay)
            .is('deleted_at', null);

        // Call AI service
        const plan = await aiService.planDay(
            userId,
            tasks,
            (calendarEvents || []) as Array<{ title: string; start_time: string; end_time: string; is_all_day: boolean }>,
            preferences,
            targetDate
        );

        // Apply scheduled times to tasks
        if (plan.scheduledTasks.length > 0) {
            await tasksService.applyScheduledTimes(userId, plan.scheduledTasks);
        }

        // Increment AI usage counter
        await incrementAIUsage(userId);

        // Log the AI request
        await supabase.from('events').insert({
            user_id: userId,
            event_type: 'ai.plan_generated',
            entity_type: 'ai',
            entity_id: userId,
            action: 'create',
            payload: {
                targetDate,
                tasksScheduled: plan.scheduledTasks.length,
                tasksUnscheduled: plan.unscheduledTasks.length,
            },
            source: 'api',
        });

        return reply.send({ data: plan });
    });

    /**
     * POST /api/v1/ai/breakdown - Break down a task into subtasks
     */
    fastify.post('/breakdown', async (request: FastifyRequest, reply: FastifyReply) => {
        const { userId, userTier } = request as AuthenticatedRequest;
        const body = TaskBreakdownRequestSchema.parse(request.body);

        // Check rate limits
        const allowed = await checkAIRateLimit(userId, userTier);
        if (!allowed) {
            return reply.status(429).send({
                error: 'Too Many Requests',
                message: 'AI request limit reached for your plan. Upgrade for more.',
            });
        }

        // Get the task
        const task = await tasksService.getTask(userId, body.task_id);
        if (!task) {
            return reply.status(404).send({
                error: 'Not Found',
                message: 'Task not found',
            });
        }

        // Call AI service
        const breakdown = await aiService.breakdownTask(task);

        // Increment AI usage counter
        await incrementAIUsage(userId);

        return reply.send({ data: breakdown });
    });
}

/**
 * Check if user has remaining AI requests for their tier
 */
async function checkAIRateLimit(userId: string, tier: string): Promise<boolean> {
    const supabase = getSupabaseAdmin();

    // Get current usage
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('ai_requests_this_period, ai_requests_limit')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

    // Get limit based on tier
    const limit = config.rateLimit.aiRequestsPerHour[tier as keyof typeof config.rateLimit.aiRequestsPerHour]
        || config.rateLimit.aiRequestsPerHour.free;

    if (!subscription) {
        // Free tier - check hourly limit via events table
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const { count } = await supabase
            .from('events')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('event_type', 'ai.plan_generated')
            .gte('created_at', oneHourAgo);

        return (count || 0) < limit;
    }

    // Paid tier - check subscription limit
    const subData = subscription as SubscriptionRow;
    const used = subData.ai_requests_this_period || 0;
    const subLimit = subData.ai_requests_limit || limit * 24 * 30; // Monthly limit

    return used < subLimit;
}

/**
 * Increment AI usage counter for billing
 */
async function incrementAIUsage(userId: string): Promise<void> {
    const supabase = getSupabaseAdmin();

    // Update the timestamp - actual increment is handled by DB trigger
    await supabase
        .from('subscriptions')
        .update({ updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('status', 'active');
}
