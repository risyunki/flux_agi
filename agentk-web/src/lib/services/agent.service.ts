export interface Agent {
  id: string;
  name: string;
  type: 'coordinator' | 'architect' | 'engineer' | 'researcher';
  status: 'active' | 'inactive';
  description: string;
  capabilities: string[];
}

class AgentService {
  private readonly baseUrl = 'http://localhost:8000';

  async getAgents(): Promise<Agent[]> {
    try {
      const response = await fetch(`${this.baseUrl}/agents`);
      if (!response.ok) {
        throw new Error(`Failed to fetch agents: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch agents');
    }
  }

  async getAgentStatus(id: string): Promise<Agent> {
    try {
      const response = await fetch(`${this.baseUrl}/agents/${id}/status`);
      if (!response.ok) {
        throw new Error(`Failed to fetch agent status: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching agent status:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch agent status');
    }
  }
}

export const agentService = new AgentService() 