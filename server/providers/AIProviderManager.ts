import { AIProvider } from './AIProvider.ts';
import { GrokProvider } from './GrokProvider.ts';
import { GroqProvider } from './GroqProvider.ts';
import { SimulatedScholarlyProvider } from './SimulatedScholarlyProvider.ts';
import {
  AIProviderId,
  AIProviderStatus
} from '../../src/types/research.ts';

export interface RunAIOptions {
  provider: AIProviderId;
  task:
    | 'plan'
    | 'analyze-source'
    | 'chat'
    | 'extract-evidence'
    | 'compare'
    | 'synthesis'
    | 'gaps'
    | 'report'
    | 'generate-text';
  payload: any;
  model?: string;
  failoverEnabled?: boolean;
  fallbackProvider?: AIProviderId | 'none';
}

export interface RunAIResult<T = any> {
  data: T;
  providerUsed: string;
  modelUsed: string;
  fallbackUsed: boolean;
  fallbackMessage?: string;
  simulated: boolean;
}

export class AIProviderManager {
  private grokProvider: GrokProvider;
  private groqProvider: GroqProvider;
  private simulatedProvider: SimulatedScholarlyProvider;

  constructor() {
    this.grokProvider = new GrokProvider();
    this.groqProvider = new GroqProvider();
    this.simulatedProvider = new SimulatedScholarlyProvider();
  }

  public getProvider(id: AIProviderId): AIProvider {
    if (id === 'groq') return this.groqProvider;
    return this.grokProvider;
  }

  public getStatus(): AIProviderStatus[] {
    return [
      {
        id: 'grok',
        name: this.grokProvider.name,
        configured: this.grokProvider.isConfigured(),
        model: this.grokProvider.getModel(),
        defaultModel: this.grokProvider.defaultModel,
        baseUrl: this.grokProvider.baseUrl,
        status: this.grokProvider.isConfigured() ? 'Configured' : 'Not Configured'
      },
      {
        id: 'groq',
        name: this.groqProvider.name,
        configured: this.groqProvider.isConfigured(),
        model: this.groqProvider.getModel(),
        defaultModel: this.groqProvider.defaultModel,
        baseUrl: this.groqProvider.baseUrl,
        status: this.groqProvider.isConfigured() ? 'Configured' : 'Not Configured'
      }
    ];
  }

  public async testProvider(id: AIProviderId, modelOverride?: string) {
    const provider = this.getProvider(id);
    return await provider.testConnection(modelOverride);
  }

  private async executeTask(provider: AIProvider, task: RunAIOptions['task'], payload: any, model?: string): Promise<any> {
    switch (task) {
      case 'plan':
        return await provider.generateResearchPlan(payload, model);
      case 'analyze-source':
        return await provider.analyzeSource(payload.source, payload.projectContext, model);
      case 'chat':
        return await provider.researchChat({
          question: payload.question,
          sources: payload.sources || [],
          projectContext: payload.projectContext || '',
          history: payload.history || [],
          model
        });
      case 'extract-evidence':
        return await provider.extractEvidence(payload.source, payload.projectContext, model);
      case 'compare':
        return await provider.compareSources(payload.sources, payload.projectContext, model);
      case 'synthesis':
        return await provider.generateSynthesis(payload.sources, payload.evidence, payload.projectContext, model);
      case 'gaps':
        return await provider.analyzeGaps(payload.sources, payload.evidence, payload.projectContext, model);
      case 'report':
        return await provider.generateReport({
          project: payload.project,
          selectedSources: payload.selectedSources || [],
          selectedEvidence: payload.selectedEvidence || [],
          selectedNotesContent: payload.selectedNotesContent || [],
          citationStyle: payload.citationStyle || 'IEEE',
          model
        });
      case 'generate-text':
        return await provider.generateText(payload.prompt, payload.systemPrompt, model);
      default:
        throw new Error(`Unknown research task: ${task}`);
    }
  }

  public async runAI<T = any>(options: RunAIOptions): Promise<RunAIResult<T>> {
    const { provider: primaryId, task, payload, model, failoverEnabled = true, fallbackProvider } = options;
    const primary = this.getProvider(primaryId);

    // Try Primary Provider if configured
    if (primary.isConfigured()) {
      try {
        const result = await this.executeTask(primary, task, payload, model);
        return {
          data: result,
          providerUsed: primary.name,
          modelUsed: model || primary.getModel(),
          fallbackUsed: false,
          simulated: false
        };
      } catch (primaryErr: any) {
        console.warn(`[AIProviderManager] Primary provider ${primary.name} failed:`, primaryErr.message);

        // Check if failover is permitted and configured
        const fallbackId = fallbackProvider && fallbackProvider !== 'none'
          ? fallbackProvider
          : (primaryId === 'grok' ? 'groq' : 'grok');

        if (failoverEnabled && fallbackId !== primaryId) {
          const fallback = this.getProvider(fallbackId);
          if (fallback.isConfigured()) {
            try {
              const fallbackResult = await this.executeTask(fallback, task, payload);
              return {
                data: fallbackResult,
                providerUsed: fallback.name,
                modelUsed: fallback.getModel(),
                fallbackUsed: true,
                fallbackMessage: 'Primary AI provider unavailable. Response generated using fallback provider.',
                simulated: false
              };
            } catch (fallbackErr: any) {
              console.warn(`[AIProviderManager] Fallback provider ${fallback.name} also failed:`, fallbackErr.message);
            }
          }
        }

        // If failover failed or was disabled, rethrow or fall to simulation
        throw new Error(`Primary provider ${primary.name} error: ${primaryErr.message}`);
      }
    }

    // Primary is not configured: Check if fallback is configured
    const secondaryId = primaryId === 'grok' ? 'groq' : 'grok';
    const secondary = this.getProvider(secondaryId);

    if (failoverEnabled && secondary.isConfigured()) {
      try {
        const fallbackResult = await this.executeTask(secondary, task, payload);
        return {
          data: fallbackResult,
          providerUsed: secondary.name,
          modelUsed: secondary.getModel(),
          fallbackUsed: true,
          fallbackMessage: 'Primary AI provider unavailable. Response generated using fallback provider.',
          simulated: false
        };
      } catch (err: any) {
        console.warn(`[AIProviderManager] Fallback execution failed:`, err.message);
      }
    }

    // If neither provider has API keys configured:
    // We execute the simulated scholarly engine so the workspace is 100% interactive and does not crash,
    // while clearly informing the user that keys are not configured.
    console.info(`[AIProviderManager] Running in Scholarly Simulation Mode (API keys not configured).`);
    const simResult = await this.executeTask(this.simulatedProvider, task, payload);
    return {
      data: simResult,
      providerUsed: 'Simulated Engine (API Key Not Configured)',
      modelUsed: this.simulatedProvider.getModel(),
      fallbackUsed: true,
      fallbackMessage: 'AI provider is not configured. Please add the required API key to the server environment.',
      simulated: true
    };
  }
}
