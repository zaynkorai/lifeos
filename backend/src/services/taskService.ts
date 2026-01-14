import { CreateTaskInput, Task } from '../types/task.js';
import { randomUUID } from 'crypto';

// In-memory store (simulation of a real DB)
const tasks: Task[] = [];

export class TaskService {
    async findAll(): Promise<Task[]> {
        // Simulate DB latency
        // await new Promise(resolve => setTimeout(resolve, 50));
        return tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async create(input: CreateTaskInput): Promise<Task> {
        const newTask: Task = {
            id: randomUUID(),
            title: input.title,
            priority: input.priority || 'medium', // Default to medium
            status: 'todo',
            createdAt: new Date(),
        };

        tasks.push(newTask);
        return newTask;
    }

    async complete(id: string): Promise<Task | null> {
        const taskIndex = tasks.findIndex(t => t.id === id);
        if (taskIndex === -1) return null;

        tasks[taskIndex].status = 'done';
        return tasks[taskIndex];
    }
}

export const taskService = new TaskService();
