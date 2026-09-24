import {
  ResearchPlan,
  SourceAnalysis,
  ChatStructuredAnswer,
  EvidenceRecord,
  SourceComparison,
  ResearchSynthesis,
  ResearchGapAnalysis,
  ResearchReport,
  Source,
  Project,
  CitationStyle,
  AIProviderId
} from '../../src/types/research.ts';

export interface AIProviderConfig {
  apiKey: string;
  baseUrl: string;
  defaultModel: string;
}

export interface ConnectionTestResult {
  success: boolean;
  model: string;
  message: string;
  latencyMs: number;
}

export interface ResearchChatParams {
  question: string;
  sources: Source[];
  projectContext: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  model?: string;
}

export interface ReportGenerationParams {
  project: Project;
  selectedSources: Source[];
  selectedEvidence: EvidenceRecord[];
  selectedNotesContent?: string[];
  citationStyle: CitationStyle;
  model?: string;
}

export const ANTI_HALLUCINATION_SYSTEM_INSTRUCTIONS = `You are ResearchFlow AI, an empirical, academic and technical research intelligence engine.
You operate strictly under these non-negotiable Anti-Hallucination & Scholarly Integrity Directives:
1. NEVER fabricate sources, citations, DOI numbers, journals, page numbers, or publication years. If metadata is missing or unverifiable, state explicitly: "Metadata unavailable" or "Not stated or not verifiable from the provided source."
2. NEVER fabricate statistics, metrics, confidence intervals, sample sizes, or experimental outcomes.
3. NEVER fabricate author names or affiliations.
4. NEVER claim to have searched the web or live databases unless explicitly provided with external web results in the context.
5. NEVER claim to have read or parsed a document that was not provided in the actual prompt context.
6. NEVER hide uncertainty. Always quantify or qualify confidence levels, missing parameters, and boundary conditions.
7. NEVER convert AI hypotheses or suggestions into established scientific facts. Label speculative points clearly as AI SUGGESTIONS or HYPOTHESES.
8. ALWAYS strictly bifurcate factual SOURCE EVIDENCE from AI INTERPRETATION and AI SUGGESTIONS.
9. If sources disagree on a finding, parameter, or conclusion, EXPLICITLY report the disagreement with the conflicting stances; do not arbitrarily declare a winner.
10. If provided evidence is insufficient to answer a research inquiry, declare that fact without hesitation.

When outputting structured JSON, return strictly valid, parseable JSON without wrapping narrative.`;

export interface AIProvider {
  readonly id: AIProviderId;
  readonly name: string;
  readonly baseUrl: string;
  readonly defaultModel: string;

  isConfigured(): boolean;
  getModel(): string;
  testConnection(modelOverride?: string): Promise<ConnectionTestResult>;
  
  generateText(prompt: string, systemPrompt?: string, modelOverride?: string): Promise<string>;
  generateStructuredOutput<T>(prompt: string, systemPrompt?: string, modelOverride?: string, schemaName?: string): Promise<T>;
  
  generateResearchPlan(projectData: Partial<Project>, modelOverride?: string): Promise<ResearchPlan>;
  analyzeSource(source: Source, projectContext: string, modelOverride?: string): Promise<SourceAnalysis>;
  researchChat(params: ResearchChatParams): Promise<ChatStructuredAnswer>;
  extractEvidence(source: Source, projectContext: string, modelOverride?: string): Promise<EvidenceRecord[]>;
  compareSources(sources: Source[], projectContext: string, modelOverride?: string): Promise<SourceComparison>;
  generateSynthesis(sources: Source[], evidence: EvidenceRecord[], projectContext: string, modelOverride?: string): Promise<ResearchSynthesis>;
  analyzeGaps(sources: Source[], evidence: EvidenceRecord[], projectContext: string, modelOverride?: string): Promise<ResearchGapAnalysis[]>;
  generateReport(params: ReportGenerationParams): Promise<ResearchReport['sections']>;
}
