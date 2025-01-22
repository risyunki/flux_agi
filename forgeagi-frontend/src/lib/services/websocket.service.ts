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
  private maxReconnectAttempts = 10; 
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isConnecting = false;

  connect(): WebSocket | null {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return this.ws;
    }

    if (this.isConnecting) {
      return null;
    }

    this.isConnecting = true;

    try {
      this.ws = new WebSocket(config.wsUrl);
      
      this.ws.onmessage = (event: MessageEvent) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          this.messageHandlers.forEach(handler => handler(message));
        } catch (error) {
          console.warn('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = () => {
        console.warn('WebSocket connection failed');
        this.attemptReconnect();
      };

      this.ws.onclose = () => {
        console.info('WebSocket connection closed');
        this.ws = null;
        this.attemptReconnect();
      };

      this.ws.onopen = () => {
        console.info('WebSocket connection established');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
      };

      return this.ws;
    } catch (error) {
      console.warn('Failed to create WebSocket connection:', error);
      this.isConnecting = false;
      this.attemptReconnect();
      return null;
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && !this.isConnecting) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 10000); 
      console.info(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }

      this.reconnectTimeout = setTimeout(() => {
        this.connect();
      }, delay);
    } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('Max reconnection attempts reached. Please check if the server is running.');
    }
  }

  disconnect(): void {
    this.reconnectAttempts = this.maxReconnectAttempts; 
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  addMessageHandler(handler: MessageHandler): void {
    this.messageHandlers.add(handler);
  }

  removeMessageHandler(handler: MessageHandler): void {
    this.messageHandlers.delete(handler);
  }
}

export const websocketService = new WebSocketService();