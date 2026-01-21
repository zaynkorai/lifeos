// API configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

// Fetch wrapper with auth
export async function api<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = typeof window !== 'undefined'
        ? localStorage.getItem('supabase-auth-token')
        : null;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP ${response.status}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return null as T;
    }

    return response.json();
}

// Typed API methods
export const apiClient = {
    get: <T>(endpoint: string) => api<T>(endpoint, { method: 'GET' }),
    post: <T>(endpoint: string, body?: unknown) => api<T>(endpoint, {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined
    }),
    patch: <T>(endpoint: string, body?: unknown) => api<T>(endpoint, {
        method: 'PATCH',
        body: body ? JSON.stringify(body) : undefined
    }),
    delete: <T>(endpoint: string) => api<T>(endpoint, { method: 'DELETE' }),
};
