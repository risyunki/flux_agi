import { config } from '@/lib/config';

export interface Task {
  id: string;
  description: string;
  status: 'in_progress' | 'completed';
  result?: string;
  agent_id: string;
  created_at: string;
}

export interface CreateTaskRequest {
  description: string;
}

class TaskService {
  private pollingInterval: NodeJS.Timeout | null = null;
  private lastKnownTasks: Task[] = [];

  async getTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${config.apiUrl}/tasks`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      const tasks = Array.isArray(data.tasks) ? data.tasks : [];
      
      // Merge with last known tasks to preserve completed results
      this.lastKnownTasks = tasks.map((newTask: Task) => {
        const existingTask = this.lastKnownTasks.find(t => t.id === newTask.id);
        // If task was completed and had a result, preserve it
        if (existingTask?.status === 'completed' && existingTask?.result) {
          return { ...newTask, result: existingTask.result };
        }
        return newTask;
      });
      
      return this.lastKnownTasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return this.lastKnownTasks;
    }
  }

  async createTask(description: string, agentId: string): Promise<Task> {
    const response = await fetch(`${config.apiUrl}/tasks`, {
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

  startPolling(callback: (tasks: Task[]) => void) {
    // Clear any existing polling
    this.stopPolling();
    
    // Initial fetch
    this.getTasks().then(callback);
    
    // Start polling every 2 seconds
    this.pollingInterval = setInterval(async () => {
      const tasks = await this.getTasks();
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