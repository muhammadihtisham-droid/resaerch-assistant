import { BaseOpenAICompatibleProvider } from './BaseOpenAICompatibleProvider.ts';
import { AIProviderId } from '../../src/types/research.ts';

export class GrokProvider extends BaseOpenAICompatibleProvider {
  readonly id: AIProviderId = 'grok';
  readonly name = 'Grok (xAI)';
  readonly baseUrl = 'https://api.x.ai/v1';
  readonly defaultModel = 'grok-4.6';

  protected getApiKey(): string | undefined {
    return process.env.XAI_API_KEY;
  }

  protected getConfiguredModel(): string {
    return process.env.XAI_MODEL || this.defaultModel;
  }
}
