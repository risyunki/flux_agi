import { Task } from './task.service';
import { Agent } from './agent.service';
import { config } from '../config';

export interface WebSocketMessage {
  type: string;
  data: Task | Agent | AgentActivity | TaskProgress;
  timestamp: string;
}

export interface AgentActivity {
  agent_id: string;
  activity: string;
  details: Record<string, any>;
}

export interface TaskProgress {
  task_id: string;
  progress: number;
  status: string;
  current_action: string | null;
}

interface MessageHandler {
  (message: WebSocketMessage): void;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  connect(): WebSocket {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return this.ws;
    }

    this.ws = new WebSocket(config.wsUrl);
    
    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        this.messageHandlers.forEach(handler => handler(message));
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
      this.attemptReconnect();
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
      this.attemptReconnect();
    };

    this.ws.onopen = () => {
      console.log('WebSocket connection established');
      this.reconnectAttempts = 0;
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    };

    return this.ws;
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      this.reconnectTimeout = setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.reconnectAttempts = 0;
  }

  addMessageHandler(handler: MessageHandler): void {
    this.messageHandlers.add(handler);
  }

  removeMessageHandler(handler: MessageHandler): void {
    this.messageHandlers.delete(handler);
  }
}

export const websocketService = new WebSocketService(); 