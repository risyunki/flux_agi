import { config } from '../config';

export interface Agent {
  id: string;
  name: string;
  type: 'coordinator' | 'architect' | 'engineer' | 'researcher';
  status: 'active' | 'inactive';
  description: string;
  capabilities: string[];
}

export class AgentService {
  private readonly baseUrl = config.apiUrl;

  async getAgents(): Promise<Agent[]> {
    try {
      const response = await fetch(`${this.baseUrl}/agents`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch agents: ${response.statusText}`);
      }
      const data = await response.json();
      return Array.isArray(data.agents) ? data.agents : [];
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  }

  async getAgentStatus(id: string): Promise<Agent> {
    try {
      const response = await fetch(`${this.baseUrl}/agents/${id}/status`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch agent status: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching agent status:', error);
      throw error;
    }
  }
}

export const agentService = new AgentService();