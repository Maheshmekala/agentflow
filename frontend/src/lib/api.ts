import axios from 'axios';

export interface AgentResult {
  output: string;
  steps: { type: string; content: string; timestamp: string; metadata: any }[];
  metadata: any;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: any;
}

const api = axios.create({ baseURL: '/api' });

export const agentApi = {
  run: (agent: string, input: string) =>
    api.post<AgentResult>('/agents/run', { agent, input }).then(r => r.data),
  listTools: () => api.get<ToolDefinition[]>('/agents/tools').then(r => r.data),
  registerTool: (tool: ToolDefinition) =>
    api.post('/agents/tools/register', tool).then(r => r.data),
};
