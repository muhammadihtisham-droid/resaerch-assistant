import {
  AIProviderId,
  AIProviderStatus,
  CitationStyle,
  Project,
  Source,
  EvidenceRecord,
  WebSearchResult
} from '../../types/research.ts';

export interface RunTaskResponse<T = any> {
  success: boolean;
  data: T;
  providerUsed: string;
  modelUsed: string;
  fallbackUsed: boolean;
  fallbackMessage?: string;
  simulated: boolean;
  error?: string;
}

export class ClientAiService {
  async getProviderStatuses(): Promise<AIProviderStatus[]> {
    try {
      const res = await fetch('/api/ai/status');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.providers || [];
    } catch (err) {
      console.warn('Failed to fetch provider status from server:', err);
      return [
        {
          id: 'grok',
          name: 'Grok (xAI)',
          configured: false,
          model: 'grok-4.6',
          defaultModel: 'grok-4.6',
          baseUrl: 'https://api.x.ai/v1',
          status: 'Not Configured'
        },
        {
          id: 'groq',
          name: 'Groq Cloud',
          configured: false,
          model: 'llama-3.3-70b-versatile',
          defaultModel: 'llama-3.3-70b-versatile',
          baseUrl: 'https://api.groq.com/openai/v1',
          status: 'Not Configured'
        }
      ];
    }
  }

  async testConnection(provider: AIProviderId, model?: string): Promise<{ success: boolean; message: string; latencyMs: number; model: string }> {
    try {
      const res = await fetch('/api/ai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, model })
      });
      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          message: data.error || 'Connection failed',
          latencyMs: 0,
          model: model || 'unknown'
        };
      }
      return data.result;
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Network error',
        latencyMs: 0,
        model: model || 'unknown'
      };
    }
  }

  async runTask<T = any>(params: {
    provider: AIProviderId;
    task: string;
    payload: any;
    model?: string;
    failoverEnabled?: boolean;
    fallbackProvider?: AIProviderId | 'none';
  }): Promise<RunTaskResponse<T>> {
    const res = await fetch('/api/ai/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'AI execution failed');
    }

    return json;
  }

  async searchWeb(query: string, projectId: string): Promise<WebSearchResult[]> {
    try {
      const res = await fetch('/api/ai/web-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, projectId })
      });
      const json = await res.json();
      return json.results || [];
    } catch (err) {
      console.warn('Web search error:', err);
      return [];
    }
  }

  async getDemoProject(): Promise<Project> {
    try {
      const res = await fetch('/api/ai/demo-project');
      const json = await res.json();
      if (json.success && json.project) return json.project;
    } catch (err) {
      console.warn('Failed to fetch demo project from API, using client fallback', err);
    }
    // Fallback import
    const { DEMO_PROJECT } = await import('../../../server/demoData.ts');
    return DEMO_PROJECT;
  }
}

export const aiClient = new ClientAiService();
