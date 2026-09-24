import { BaseOpenAICompatibleProvider } from './BaseOpenAICompatibleProvider.ts';
import { AIProviderId } from '../../src/types/research.ts';

export class GroqProvider extends BaseOpenAICompatibleProvider {
  readonly id: AIProviderId = 'groq';
  readonly name = 'Groq Cloud';
  readonly baseUrl = 'https://api.groq.com/openai/v1';
  readonly defaultModel = 'llama-3.3-70b-versatile';

  protected getApiKey(): string | undefined {
    return process.env.GROQ_API_KEY;
  }

  protected getConfiguredModel(): string {
    return process.env.GROQ_MODEL || this.defaultModel;
  }
}
