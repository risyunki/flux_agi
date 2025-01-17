import { Task } from './task.service';
import { Agent } from './agent.service';
import { config } from '../config';

export interface WebSocketMessage {
  type: string;
  data: Task | Agent;
}

interface MessageHandler {
  (message: WebSocketMessage): void;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();

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
    };

    return this.ws;
  }

  disconnect(): void {
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