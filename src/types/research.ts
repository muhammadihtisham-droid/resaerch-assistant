export type AcademicField =
  | 'Engineering'
  | 'Computer Science'
  | 'Physics'
  | 'Mathematics'
  | 'Biology'
  | 'Business'
  | 'Social Sciences'
  | 'Other';

export type ResearchLevel =
  | 'School'
  | 'Undergraduate'
  | 'Graduate'
  | 'Researcher';

export type SourceType =
  | 'Journal Article'
  | 'Conference Paper'
  | 'Preprint'
  | 'Technical Report'
  | 'Book Chapter'
  | 'Book / Book Chapter'
  | 'Dataset'
  | 'Thesis'
  | 'Web Document';

export type ChatScope = 'project' | 'selected';

export type GapCategory =
  | 'insufficient_datasets'
  | 'limited_experimental_validation'
  | 'lack_of_industrial_validation'
  | 'limited_operating_conditions'
  | 'limited_algorithm_comparisons'
  | 'missing_variables'
  | 'unresolved_disagreements'
  | 'unexplored_applications';

export type SourceStatus = 'Added' | 'Processing' | 'Analyzed' | 'Needs Review';

export type SourceRelevance = 'Core' | 'Supporting' | 'Contextual' | 'Methodological';

export type EvidenceType =
  | 'Empirical'
  | 'Statistical'
  | 'Theoretical'
  | 'Methodological'
  | 'Qualitative';

export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export type CitationStyle = 'IEEE' | 'APA' | 'MLA';

export type AIProviderId = 'grok' | 'groq';

export interface ResearchPlan {
  researchObjective: string;
  subquestions: string[];
  importantKeywords: string[];
  suggestedStructure: string[];
  sourceCategories: string[];
  methodologyPossibilities: string[];
  variablesToInvestigate: string[];
  potentialLimitations: string[];
  potentialResearchGaps: string[];
  providerUsed: string;
  modelUsed: string;
  generatedAt: string;
}

export interface SourceAnalysis {
  summary: string;
  researchObjective: string;
  methodology: string;
  datasetExperimentalInfo: string;
  variables: string[];
  keyFindings: string[];
  limitations: string[];
  futureWork: string[];
  importantEvidence: string[];
  researchRelevance: string;
  analyzedAt: string;
  providerUsed: string;
}

export interface Source {
  id: string;
  projectId: string;
  title: string;
  authors: string[];
  publicationDate: string;
  sourceType: SourceType;
  url: string;
  doi?: string;
  abstract: string;
  fullText?: string;
  summary?: string;
  relevance: SourceRelevance;
  tags: string[];
  status: SourceStatus;
  analysis?: SourceAnalysis;
  isDemo?: boolean;
  addedAt: string;
}

export interface EvidenceRecord {
  id: string;
  projectId: string;
  sourceId: string;
  sourceTitle: string;
  claim: string;
  sourceEvidence: string; // Verbatim or direct excerpt
  location: string; // e.g. "Section 4.1, Table 2"
  evidenceType: EvidenceType;
  confidence: ConfidenceLevel;
  aiInterpretation: string; // Explicitly labeled AI interpretation
  aiSuggestion: string; // Explicitly labeled AI suggestion
  userNotes: string;
  createdAt: string;
}

export interface SourceComparison {
  id: string;
  projectId: string;
  sourceIds: string[];
  sourceTitles: string[];
  objectiveComparison: string;
  methodologyComparison: string;
  datasetComparison: string;
  variablesComparison: string;
  algorithmsComparison: string;
  conditionsComparison: string;
  resultsComparison: string;
  limitationsComparison: string;
  futureWorkComparison: string;
  areasOfAgreement: string[];
  areasOfDifference: string[];
  potentialResearchGaps: string[];
  createdAt: string;
  providerUsed: string;
}

export interface ResearchSynthesis {
  id: string;
  projectId: string;
  title: string;
  sourceIds: string[];
  evidenceSupportedFindings: {
    finding: string;
    supportingSourceIds: string[];
    sourceCitations: string;
  }[];
  interpretation: string;
  unresolvedQuestions: string[];
  conflictingEvidence: {
    topic: string;
    sourceA: string;
    stanceA: string;
    sourceB: string;
    stanceB: string;
  }[];
  potentialResearchDirections: string[];
  createdAt: string;
  providerUsed: string;
}

export interface ResearchGapAnalysis {
  id: string;
  projectId: string;
  category:
    | 'insufficient_datasets'
    | 'limited_experimental_validation'
    | 'lack_of_industrial_validation'
    | 'limited_operating_conditions'
    | 'limited_algorithm_comparisons'
    | 'missing_variables'
    | 'unresolved_disagreements'
    | 'unexplored_applications';
  categoryLabel: string;
  title: string;
  description: string;
  supportingEvidence: string;
  impactAssessment: string;
  suggestedInvestigation: string;
  createdAt: string;
}

export type NoteType =
  | 'General Note'
  | 'Source Note'
  | 'Finding'
  | 'Research Question'
  | 'Idea'
  | 'Hypothesis';

export interface ResearchNote {
  id: string;
  projectId: string;
  type: NoteType;
  title: string;
  content: string;
  tags: string[];
  sourceId?: string;
  sourceTitle?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchReport {
  id: string;
  projectId: string;
  title: string;
  citationStyle: CitationStyle;
  sections: {
    title: string;
    abstract: string;
    introduction: string;
    background: string;
    literatureReview: string;
    methodology: string;
    findings: string;
    discussion: string;
    potentialResearchGaps: string;
    futureWork: string;
    conclusion: string;
    references: string[];
  };
  generatedAt: string;
  providerUsed: string;
  modelUsed: string;
}

export interface ChatStructuredAnswer {
  answer: string;
  evidence: string[];
  sources: string[];
  interpretation: string;
  uncertainty: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  structuredAnswer?: ChatStructuredAnswer;
  scope: 'project' | 'selected' | 'single';
  targetedSourceIds?: string[];
  timestamp: string;
  providerUsed?: string;
  modelUsed?: string;
  fallbackUsed?: boolean;
}

export interface WebSearchResult {
  id: string;
  projectId: string;
  query: string;
  title: string;
  url: string;
  source: string;
  retrievalTimestamp: string;
  excerpt: string;
}

export interface Project {
  id: string;
  title: string;
  topic: string;
  question: string;
  objectives: string;
  field: AcademicField;
  keywords: string[];
  level: ResearchLevel;
  createdAt: string;
  updatedAt: string;
  selectedProvider: AIProviderId;
  selectedModel: string;
  plan?: ResearchPlan;
  sources: Source[];
  evidence: EvidenceRecord[];
  comparisons: SourceComparison[];
  syntheses: ResearchSynthesis[];
  gaps: ResearchGapAnalysis[];
  notes: ResearchNote[];
  reports: ResearchReport[];
  webResults: WebSearchResult[];
  chatHistory: ChatMessage[];
}

export interface AIProviderStatus {
  id: AIProviderId;
  name: string;
  configured: boolean;
  model: string;
  defaultModel: string;
  baseUrl: string;
  status: 'Configured' | 'Not Configured' | 'Connection Error';
  lastTested?: string;
  errorMessage?: string;
}

export interface SettingsState {
  primaryProvider: AIProviderId;
  fallbackProvider: AIProviderId | 'none';
  failoverEnabled: boolean;
  citationStyle: CitationStyle;
  grokModel: string;
  groqModel: string;
}
