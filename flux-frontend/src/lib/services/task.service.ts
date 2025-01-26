export interface Task {
  id: string;
  description: string;
  status: 'in_progress' | 'completed';
  result?: string;
  agent_id: string;
  created_at: string;
  archived: boolean;
}

export interface CreateTaskRequest {
  description: string;
}

export class TaskService {
  private apiUrl: string;
  private pollingInterval: NodeJS.Timeout | null = null;
  private lastKnownTasks: Task[] = [];

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  async getTasks(archived: boolean = false): Promise<Task[]> {
    try {
      const response = await fetch(`${this.apiUrl}/tasks?archived=${archived}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const tasks = await response.json();
      this.lastKnownTasks = tasks;
      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return this.lastKnownTasks;
    }
  }

  async createTask(description: string, agentId: string): Promise<Task> {
    const response = await fetch(`${this.apiUrl}/tasks`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description, agent_id: agentId })
    });
    if (!response.ok) throw new Error('Failed to create task');
    const task = await response.json();
    return task;
  }

  async archiveTask(taskId: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/tasks/${taskId}/archive`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to archive task');
  }

  async unarchiveTask(taskId: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/tasks/${taskId}/unarchive`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to unarchive task');
  }

  startPolling(callback: (tasks: Task[]) => void, archived: boolean = false) {
    this.stopPolling();
    this.getTasks(archived).then(callback);
    
    this.pollingInterval = setInterval(async () => {
      const tasks = await this.getTasks(archived);
      callback(tasks);
    }, 2000);
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
}

export const taskService = new TaskService(); 