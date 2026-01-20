import { FastifyRequest, FastifyReply } from 'fastify';
import { getSupabaseAdmin, SubscriptionRow } from '../db/supabase.js';

export interface AuthenticatedRequest extends FastifyRequest {
    userId: string;
    userEmail: string;
    userTier: 'free' | 'starter' | 'pro' | 'team' | 'enterprise';
}

/**
 * Authentication middleware that validates JWT and extracts user info
 */
export async function authMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return reply.status(401).send({
            error: 'Unauthorized',
            message: 'Missing or invalid authorization header',
        });
    }

    const token = authHeader.slice(7);

    try {
        const supabase = getSupabaseAdmin();

        // Verify the JWT and get user
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return reply.status(401).send({
                error: 'Unauthorized',
                message: 'Invalid or expired token',
            });
        }

        // Get user's subscription tier
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('tier, status')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single();

        // Attach user info to request
        (request as AuthenticatedRequest).userId = user.id;
        (request as AuthenticatedRequest).userEmail = user.email!;
        (request as AuthenticatedRequest).userTier = (subscription as SubscriptionRow | null)?.tier || 'free';

    } catch (err) {
        request.log.error(err, 'Auth middleware error');
        return reply.status(500).send({
            error: 'Internal Server Error',
            message: 'Authentication failed',
        });
    }
}

/**
 * Optional auth middleware - doesn't fail if no auth, just sets userId to null
 */
export async function optionalAuthMiddleware(
    request: FastifyRequest,
    _reply: FastifyReply
): Promise<void> {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return;
    }

    const token = authHeader.slice(7);

    try {
        const supabase = getSupabaseAdmin();
        const { data: { user } } = await supabase.auth.getUser(token);

        if (user) {
            (request as AuthenticatedRequest).userId = user.id;
            (request as AuthenticatedRequest).userEmail = user.email!;
        }
    } catch {
        // Ignore errors for optional auth
    }
}
