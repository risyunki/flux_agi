import { config } from '../config';

export interface Task {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: string | null;
}

export interface CreateTaskRequest {
  description: string;
}

class TaskService {
  private readonly baseUrl = config.apiUrl;

  async getTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${this.baseUrl}/tasks`);
      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.statusText}`);
      }
      const data = await response.json();
      return data.tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch tasks');
    }
  }

  async createTask(task: CreateTaskRequest): Promise<Task> {
    try {
      const response = await fetch(`${this.baseUrl}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create task: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to create task');
    }
  }
}

export const taskService = new TaskService(); 