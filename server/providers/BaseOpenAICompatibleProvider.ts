import {
  AIProvider,
  ANTI_HALLUCINATION_SYSTEM_INSTRUCTIONS,
  ConnectionTestResult,
  ReportGenerationParams,
  ResearchChatParams
} from './AIProvider.ts';
import {
  AIProviderId,
  CitationStyle,
  ChatStructuredAnswer,
  EvidenceRecord,
  Project,
  ResearchGapAnalysis,
  ResearchPlan,
  ResearchReport,
  ResearchSynthesis,
  Source,
  SourceAnalysis,
  SourceComparison
} from '../../src/types/research.ts';

export abstract class BaseOpenAICompatibleProvider implements AIProvider {
  abstract readonly id: AIProviderId;
  abstract readonly name: string;
  abstract readonly baseUrl: string;
  abstract readonly defaultModel: string;

  protected abstract getApiKey(): string | undefined;
  protected abstract getConfiguredModel(): string;

  public isConfigured(): boolean {
    const key = this.getApiKey();
    return Boolean(key && key.trim().length > 0 && !key.includes('your-') && !key.includes('MY_'));
  }

  public getModel(): string {
    return this.getConfiguredModel() || this.defaultModel;
  }

  protected cleanJsonResponse(text: string): string {
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return cleaned.trim();
  }

  public async testConnection(modelOverride?: string): Promise<ConnectionTestResult> {
    const startTime = Date.now();
    const model = modelOverride || this.getModel();

    if (!this.isConfigured()) {
      return {
        success: false,
        model,
        message: `${this.name} API key is not configured in server environment.`,
        latencyMs: 0
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getApiKey()}`
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'user',
              content: 'Return only the word OK for latency healthcheck.'
            }
          ],
          max_tokens: 10,
          temperature: 0.1
        })
      });

      const latencyMs = Date.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        let errorMsg = `HTTP ${response.status} ${response.statusText}`;
        try {
          const parsed = JSON.parse(errorText);
          if (parsed.error?.message) {
            errorMsg = parsed.error.message;
          }
        } catch {
          // ignore json parse error
        }
        return {
          success: false,
          model,
          message: errorMsg,
          latencyMs
        };
      }

      const data = await response.json();
      return {
        success: true,
        model: data.model || model,
        message: `Connection successful (${latencyMs}ms)`,
        latencyMs
      };
    } catch (err: any) {
      return {
        success: false,
        model,
        message: err.message || 'Network connection failed',
        latencyMs: Date.now() - startTime
      };
    }
  }

  public async generateText(prompt: string, systemPrompt?: string, modelOverride?: string): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error(`AI provider is not configured. Please add the required API key to the server environment.`);
    }

    const model = modelOverride || this.getModel();
    const fullSystem = systemPrompt
      ? `${ANTI_HALLUCINATION_SYSTEM_INSTRUCTIONS}\n\n${systemPrompt}`
      : ANTI_HALLUCINATION_SYSTEM_INSTRUCTIONS;

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.getApiKey()}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: fullSystem },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      let errorMsg = `Provider error (${response.status}): ${response.statusText}`;
      try {
        const parsed = JSON.parse(errBody);
        if (parsed.error?.message) errorMsg = parsed.error.message;
      } catch {
        // pass
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  public async generateStructuredOutput<T>(
    prompt: string,
    systemPrompt?: string,
    modelOverride?: string
  ): Promise<T> {
    if (!this.isConfigured()) {
      throw new Error(`AI provider is not configured. Please add the required API key to the server environment.`);
    }

    const model = modelOverride || this.getModel();
    const fullSystem = `${ANTI_HALLUCINATION_SYSTEM_INSTRUCTIONS}\n\n${systemPrompt || ''}\n\nCRITICAL: Respond ONLY with a valid JSON object matching the requested schema. No code fences, no introductory or concluding text.`;

    const requestBody: any = {
      model,
      messages: [
        { role: 'system', content: fullSystem },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' }
    };

    let response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.getApiKey()}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      // In case provider doesn't support response_format: json_object, retry once without it
      delete requestBody.response_format;
      response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getApiKey()}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`AI Provider failure: ${errBody}`);
      }
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || '';
    const cleaned = this.cleanJsonResponse(rawContent);

    try {
      return JSON.parse(cleaned) as T;
    } catch (parseErr) {
      // Attempt safe substring extraction
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        try {
          return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1)) as T;
        } catch {
          // fallback
        }
      }
      throw new Error(`Failed to parse structured JSON from ${this.name}: ${rawContent.slice(0, 150)}...`);
    }
  }

  public async generateResearchPlan(projectData: Partial<Project>, modelOverride?: string): Promise<ResearchPlan> {
    const prompt = `Generate a rigorous, scholarly research plan for the following project:
Title: ${projectData.title || 'Untitled'}
Topic: ${projectData.topic || 'General Technical Research'}
Primary Question: ${projectData.question || 'Unspecified'}
Objectives: ${projectData.objectives || 'None provided'}
Academic Field: ${projectData.field || 'Engineering'}
Keywords: ${(projectData.keywords || []).join(', ')}
Research Level: ${projectData.level || 'Researcher'}

Return a JSON object with this exact shape:
{
  "researchObjective": "A precise, empirical academic objective statement",
  "subquestions": ["subquestion 1", "subquestion 2", "subquestion 3"],
  "importantKeywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4"],
  "suggestedStructure": ["Section I...", "Section II...", "Section III...", "Section IV...", "Section V..."],
  "sourceCategories": ["category 1", "category 2", "category 3"],
  "methodologyPossibilities": ["methodology 1", "methodology 2"],
  "variablesToInvestigate": ["variable 1", "variable 2", "variable 3"],
  "potentialLimitations": ["limitation 1", "limitation 2"],
  "potentialResearchGaps": ["potential gap 1", "potential gap 2"]
}`;

    const parsed = await this.generateStructuredOutput<any>(
      prompt,
      'You are generating an academic research plan. Clearly label AI suggestions as possibilities, not established dogma.',
      modelOverride
    );

    return {
      researchObjective: parsed.researchObjective || 'Comprehensive systematic investigation of research topic.',
      subquestions: Array.isArray(parsed.subquestions) ? parsed.subquestions : [],
      importantKeywords: Array.isArray(parsed.importantKeywords) ? parsed.importantKeywords : [],
      suggestedStructure: Array.isArray(parsed.suggestedStructure) ? parsed.suggestedStructure : [],
      sourceCategories: Array.isArray(parsed.sourceCategories) ? parsed.sourceCategories : [],
      methodologyPossibilities: Array.isArray(parsed.methodologyPossibilities) ? parsed.methodologyPossibilities : [],
      variablesToInvestigate: Array.isArray(parsed.variablesToInvestigate) ? parsed.variablesToInvestigate : [],
      potentialLimitations: Array.isArray(parsed.potentialLimitations) ? parsed.potentialLimitations : [],
      potentialResearchGaps: Array.isArray(parsed.potentialResearchGaps) ? parsed.potentialResearchGaps : [],
      providerUsed: this.name,
      modelUsed: modelOverride || this.getModel(),
      generatedAt: new Date().toISOString()
    };
  }

  public async analyzeSource(source: Source, projectContext: string, modelOverride?: string): Promise<SourceAnalysis> {
    const prompt = `Analyze this academic or technical source strictly using the text provided below.
DO NOT invent, embellish, or hallucinate missing information.
If any section is not explicitly present or verifiable from the text, write: "Not stated or not verifiable from the provided source."

PROJECT CONTEXT:
${projectContext}

SOURCE METADATA:
Title: ${source.title}
Authors: ${(source.authors || []).join(', ') || 'Not stated'}
Publication Date: ${source.publicationDate || 'Not stated'}
Type: ${source.sourceType}
Abstract: ${source.abstract || 'None'}

SOURCE CONTENT / FULL TEXT / EXCERPT:
${source.fullText || source.abstract || 'No content provided'}

Return a JSON object with this exact shape:
{
  "summary": "Concise factual summary of the source",
  "researchObjective": "Explicit objective stated in the paper",
  "methodology": "Empirical, theoretical, or computational methods used",
  "datasetExperimentalInfo": "Specific datasets, sample sizes, test rigs, or experimental parameters",
  "variables": ["variable 1", "variable 2"],
  "keyFindings": ["finding 1", "finding 2", "finding 3"],
  "limitations": ["explicit limitation 1", "explicit limitation 2"],
  "futureWork": ["future direction 1", "future direction 2"],
  "importantEvidence": ["exact or faithful quote/evidence 1", "quote/evidence 2"],
  "researchRelevance": "How this source informs the user's research question"
}`;

    const parsed = await this.generateStructuredOutput<any>(
      prompt,
      'Perform rigorous, factual source extraction. Strictly obey anti-hallucination rules.',
      modelOverride
    );

    return {
      summary: parsed.summary || 'Summary unavailable.',
      researchObjective: parsed.researchObjective || 'Not stated or not verifiable from the provided source.',
      methodology: parsed.methodology || 'Not stated or not verifiable from the provided source.',
      datasetExperimentalInfo: parsed.datasetExperimentalInfo || 'Not stated or not verifiable from the provided source.',
      variables: Array.isArray(parsed.variables) ? parsed.variables : [],
      keyFindings: Array.isArray(parsed.keyFindings) ? parsed.keyFindings : [],
      limitations: Array.isArray(parsed.limitations) ? parsed.limitations : [],
      futureWork: Array.isArray(parsed.futureWork) ? parsed.futureWork : [],
      importantEvidence: Array.isArray(parsed.importantEvidence) ? parsed.importantEvidence : [],
      researchRelevance: parsed.researchRelevance || 'Relevant to general project scope.',
      analyzedAt: new Date().toISOString(),
      providerUsed: this.name
    };
  }

  public async extractEvidence(source: Source, projectContext: string, modelOverride?: string): Promise<EvidenceRecord[]> {
    const prompt = `Extract discrete, verifiable evidence records from this research source.
DO NOT hallucinate data or claims. Every claim must have verifiable backing in the text.
If location (e.g. section, table, paragraph) is not stated, say "Full text" or "Abstract".

PROJECT CONTEXT:
${projectContext}

SOURCE TITLE: ${source.title}
CONTENT:
${source.fullText || source.abstract}

Return a JSON object with a list of extracted evidence:
{
  "records": [
    {
      "claim": "Specific empirical or theoretical claim",
      "sourceEvidence": "Verbatim quote or direct factual excerpt from the source supporting this claim",
      "location": "e.g. Section 3.2, Table 1, or Paragraph 4",
      "evidenceType": "Empirical | Statistical | Theoretical | Methodological | Qualitative",
      "confidence": "High | Medium | Low",
      "aiInterpretation": "Clear, objective academic interpretation of the claim's significance",
      "aiSuggestion": "Practical recommendation or next investigation step for the researcher",
      "userNotes": ""
    }
  ]
}`;

    const parsed = await this.generateStructuredOutput<any>(
      prompt,
      'Extract rigorous structured evidence records. Maintain clear distinction between SOURCE EVIDENCE and AI INTERPRETATION.',
      modelOverride
    );

    const records = Array.isArray(parsed?.records) ? parsed.records : [];
    return records.map((rec: any, idx: number) => ({
      id: `ev-${Date.now()}-${idx}`,
      projectId: source.projectId,
      sourceId: source.id,
      sourceTitle: source.title,
      claim: rec.claim || 'Unspecified claim',
      sourceEvidence: rec.sourceEvidence || 'Evidence excerpt not specified.',
      location: rec.location || 'Location not verifiable',
      evidenceType: ['Empirical', 'Statistical', 'Theoretical', 'Methodological', 'Qualitative'].includes(rec.evidenceType)
        ? rec.evidenceType
        : 'Empirical',
      confidence: ['High', 'Medium', 'Low'].includes(rec.confidence) ? rec.confidence : 'Medium',
      aiInterpretation: rec.aiInterpretation || 'No interpretation recorded.',
      aiSuggestion: rec.aiSuggestion || 'No suggestion recorded.',
      userNotes: '',
      createdAt: new Date().toISOString()
    }));
  }

  public async compareSources(sources: Source[], projectContext: string, modelOverride?: string): Promise<SourceComparison> {
    const sourceSummaries = sources.map((s, i) => `
[SOURCE ${i + 1}]: "${s.title}" (Authors: ${(s.authors || []).join(', ')}; Year: ${s.publicationDate || 'n/a'})
Abstract/Summary: ${s.analysis?.summary || s.summary || s.abstract}
Methodology: ${s.analysis?.methodology || 'Not stated'}
Dataset: ${s.analysis?.datasetExperimentalInfo || 'Not stated'}
Variables: ${(s.analysis?.variables || []).join(', ')}
Key Findings: ${(s.analysis?.keyFindings || []).join('; ')}
Limitations: ${(s.analysis?.limitations || []).join('; ')}
Future Work: ${(s.analysis?.futureWork || []).join('; ')}
`).join('\n---\n');

    const prompt = `Perform a structured, critical comparative synthesis of the following ${sources.length} sources.
If sources disagree on findings or methodologies, EXPLICITLY state the disagreement.
Do not automatically declare one correct over another.

PROJECT CONTEXT:
${projectContext}

SOURCES TO COMPARE:
${sourceSummaries}

Return a JSON object with this exact structure:
{
  "objectiveComparison": "Synthesis of how objectives differ or align across sources",
  "methodologyComparison": "Comparison of experimental, theoretical, or computational methods",
  "datasetComparison": "Comparison of datasets, sample sizes, and empirical validation rigs",
  "variablesComparison": "Comparison of investigated parameters and control variables",
  "algorithmsComparison": "Comparison of algorithms, architectures, or statistical procedures",
  "conditionsComparison": "Comparison of operating conditions, speed, temperature, environment",
  "resultsComparison": "Direct comparison of numerical or qualitative results",
  "limitationsComparison": "Comparative critique of reported limitations",
  "futureWorkComparison": "Synthesis of authors' suggested future research",
  "areasOfAgreement": ["Point of consensus 1", "Point of consensus 2"],
  "areasOfDifference": ["Divergence/disagreement 1", "Divergence/disagreement 2"],
  "potentialResearchGaps": ["Identified research gap 1", "Identified research gap 2"]
}`;

    const parsed = await this.generateStructuredOutput<any>(
      prompt,
      'Comparative scholarly synthesis. Ensure disagreements are stated explicitly without biased bias.',
      modelOverride
    );

    return {
      id: `comp-${Date.now()}`,
      projectId: sources[0]?.projectId || '',
      sourceIds: sources.map((s) => s.id),
      sourceTitles: sources.map((s) => s.title),
      objectiveComparison: parsed.objectiveComparison || 'Objective comparison unavailable.',
      methodologyComparison: parsed.methodologyComparison || 'Methodology comparison unavailable.',
      datasetComparison: parsed.datasetComparison || 'Dataset comparison unavailable.',
      variablesComparison: parsed.variablesComparison || 'Variables comparison unavailable.',
      algorithmsComparison: parsed.algorithmsComparison || 'Algorithms comparison unavailable.',
      conditionsComparison: parsed.conditionsComparison || 'Conditions comparison unavailable.',
      resultsComparison: parsed.resultsComparison || 'Results comparison unavailable.',
      limitationsComparison: parsed.limitationsComparison || 'Limitations comparison unavailable.',
      futureWorkComparison: parsed.futureWorkComparison || 'Future work comparison unavailable.',
      areasOfAgreement: Array.isArray(parsed.areasOfAgreement) ? parsed.areasOfAgreement : [],
      areasOfDifference: Array.isArray(parsed.areasOfDifference) ? parsed.areasOfDifference : [],
      potentialResearchGaps: Array.isArray(parsed.potentialResearchGaps) ? parsed.potentialResearchGaps : [],
      createdAt: new Date().toISOString(),
      providerUsed: this.name
    };
  }

  public async generateSynthesis(
    sources: Source[],
    evidence: EvidenceRecord[],
    projectContext: string,
    modelOverride?: string
  ): Promise<ResearchSynthesis> {
    const prompt = `Synthesize the collected literature and evidence to answer:
"What does the collected literature collectively indicate?"

PROJECT CONTEXT:
${projectContext}

COLLECTED SOURCES:
${sources.map((s) => `- [${s.id}] "${s.title}" (${(s.authors || []).join(', ')})`).join('\n')}

EXTRACTED EVIDENCE:
${evidence.map((e) => `- Source [${e.sourceId}] (${e.sourceTitle}): Claim: "${e.claim}" | Evidence: "${e.sourceEvidence}"`).join('\n')}

Return a JSON object structured as follows:
{
  "title": "A precise title for this research synthesis",
  "evidenceSupportedFindings": [
    {
      "finding": "Specific collective finding supported strictly by the evidence",
      "supportingSourceIds": ["source-id-1"],
      "sourceCitations": "Author et al. (Year)"
    }
  ],
  "interpretation": "Objective scholarly interpretation of the overarching patterns across the literature",
  "unresolvedQuestions": ["Critical scientific question 1", "Critical question 2"],
  "conflictingEvidence": [
    {
      "topic": "Specific point of contention",
      "sourceA": "Source A Title / Author",
      "stanceA": "Their finding/assertion",
      "sourceB": "Source B Title / Author",
      "stanceB": "Their contrasting finding/assertion"
    }
  ],
  "potentialResearchDirections": ["Promising research direction 1", "Promising research direction 2"]
}`;

    const parsed = await this.generateStructuredOutput<any>(
      prompt,
      'Synthesize empirical literature. Separate evidence-supported findings from interpretation and conflicting evidence.',
      modelOverride
    );

    return {
      id: `syn-${Date.now()}`,
      projectId: sources[0]?.projectId || evidence[0]?.projectId || '',
      title: parsed.title || 'Collective Research Synthesis',
      sourceIds: sources.map((s) => s.id),
      evidenceSupportedFindings: Array.isArray(parsed.evidenceSupportedFindings) ? parsed.evidenceSupportedFindings : [],
      interpretation: parsed.interpretation || 'No collective interpretation available.',
      unresolvedQuestions: Array.isArray(parsed.unresolvedQuestions) ? parsed.unresolvedQuestions : [],
      conflictingEvidence: Array.isArray(parsed.conflictingEvidence) ? parsed.conflictingEvidence : [],
      potentialResearchDirections: Array.isArray(parsed.potentialResearchDirections) ? parsed.potentialResearchDirections : [],
      createdAt: new Date().toISOString(),
      providerUsed: this.name
    };
  }

  public async analyzeGaps(
    sources: Source[],
    evidence: EvidenceRecord[],
    projectContext: string,
    modelOverride?: string
  ): Promise<ResearchGapAnalysis[]> {
    const prompt = `Analyze the collected research sources and evidence to identify POTENTIAL RESEARCH GAPS.
Under scholarly guidelines, label these as "Potential Research Gaps" and never declare a gap as absolute fact unless verified.

Examine these gap dimensions:
- insufficient_datasets
- limited_experimental_validation
- lack_of_industrial_validation
- limited_operating_conditions
- limited_algorithm_comparisons
- missing_variables
- unresolved_disagreements
- unexplored_applications

PROJECT CONTEXT:
${projectContext}

AVAILABLE SOURCES:
${sources.map((s) => `Title: ${s.title}\nFindings: ${(s.analysis?.keyFindings || []).join('; ')}\nLimitations: ${(s.analysis?.limitations || []).join('; ')}`).join('\n---\n')}

Return a JSON object:
{
  "gaps": [
    {
      "category": "one of the 8 category keys above",
      "categoryLabel": "Human readable label",
      "title": "Clear title of potential research gap",
      "description": "Scholarly description of what is lacking or unaddressed",
      "supportingEvidence": "Citation or excerpt demonstrating this deficiency in the reviewed literature",
      "impactAssessment": "High, Medium, or Low with justification",
      "suggestedInvestigation": "Concrete study or methodology to address this gap"
    }
  ]
}`;

    const parsed = await this.generateStructuredOutput<any>(
      prompt,
      'Identify potential research gaps. Strictly avoid exaggerating certainty.',
      modelOverride
    );

    const rawGaps = Array.isArray(parsed?.gaps) ? parsed.gaps : [];
    return rawGaps.map((g: any, i: number) => ({
      id: `gap-${Date.now()}-${i}`,
      projectId: sources[0]?.projectId || '',
      category: g.category || 'limited_operating_conditions',
      categoryLabel: g.categoryLabel || 'Operational Constraint',
      title: g.title || 'Identified Gap',
      description: g.description || 'Description unavailable.',
      supportingEvidence: g.supportingEvidence || 'Not stated in source.',
      impactAssessment: g.impactAssessment || 'Medium',
      suggestedInvestigation: g.suggestedInvestigation || 'Further empirical testing recommended.',
      createdAt: new Date().toISOString()
    }));
  }

  public async researchChat(params: ResearchChatParams): Promise<ChatStructuredAnswer> {
    const { question, sources, projectContext, history = [] } = params;

    const sourceContext = sources.map((s, idx) => `
[SOURCE ${idx + 1}]: "${s.title}"
Authors: ${(s.authors || []).join(', ') || 'Not stated'}
Year: ${s.publicationDate || 'Not stated'}
Abstract: ${s.abstract || 'None'}
Key Findings: ${(s.analysis?.keyFindings || []).join('; ') || 'None analyzed'}
Important Evidence: ${(s.analysis?.importantEvidence || []).join('; ') || 'None extracted'}
Full Text Snippet: ${(s.fullText || '').slice(0, 1500)}
`).join('\n---\n');

    const prompt = `The user is conducting academic research. Answer their question grounded strictly in the provided research sources.
Prioritize provided research sources over general knowledge.
Whenever making factual assertions, associate them with their supporting source.
If evidence is unavailable in the sources, clearly declare that fact.

PROJECT CONTEXT:
${projectContext}

ACCESSIBLE RESEARCH SOURCES (${sources.length} active):
${sourceContext || 'No sources currently selected.'}

RECENT CHAT HISTORY:
${history.map((h) => `${h.role.toUpperCase()}: ${h.content}`).join('\n')}

USER QUESTION:
"${question}"

Return a JSON object with this exact shape:
{
  "answer": "Direct, clear, concise academic answer to the question",
  "evidence": ["Exact or direct quotation/evidence from sources backing this answer"],
  "sources": ["Full title of each source used in this answer"],
  "interpretation": "Scholarly AI interpretation of implications and context",
  "uncertainty": "Explicit statement of limitations, missing evidence, or boundary conditions"
}`;

    const parsed = await this.generateStructuredOutput<any>(
      prompt,
      'Source-grounded research assistant. Adhere strictly to the Answer / Evidence / Sources / Interpretation / Uncertainty format.',
      params.model
    );

    return {
      answer: parsed.answer || 'No direct answer could be formulated from the available sources.',
      evidence: Array.isArray(parsed.evidence) ? parsed.evidence : [],
      sources: Array.isArray(parsed.sources) ? parsed.sources : [],
      interpretation: parsed.interpretation || 'No interpretation provided.',
      uncertainty: parsed.uncertainty || 'Evidence may be incomplete or limited to the provided sources.'
    };
  }

  public async generateReport(params: ReportGenerationParams): Promise<ResearchReport['sections']> {
    const { project, selectedSources, selectedEvidence, selectedNotesContent = [], citationStyle, model } = params;

    const sourceList = selectedSources.map((s, i) => `
[${i + 1}] Title: "${s.title}"
Authors: ${(s.authors || []).join(', ') || 'Metadata unavailable'}
Publication Date: ${s.publicationDate || 'Metadata unavailable'}
DOI: ${s.doi || 'Metadata unavailable'}
URL: ${s.url || 'Metadata unavailable'}
Key Findings: ${(s.analysis?.keyFindings || []).join('; ') || s.summary || s.abstract}
`).join('\n');

    const evidenceList = selectedEvidence.map((e) => `
- Claim: "${e.claim}"
  Evidence: "${e.sourceEvidence}" (Source: "${e.sourceTitle}", Loc: ${e.location})
`).join('\n');

    const prompt = `Compose a comprehensive, high-standard academic research report for the following project.
NEVER fabricate experimental results or citations.
Format all citations in ${citationStyle} style. For engineering, IEEE style uses bracketed numbers [1], [2] in-text and a numbered reference list at the end.
If citation metadata is missing, write "Metadata unavailable".

PROJECT DETAILS:
Title: ${project.title}
Topic: ${project.topic}
Research Question: ${project.question}
Field: ${project.field}
Research Level: ${project.level}

AVAILABLE SOURCES:
${sourceList}

VERIFIED EVIDENCE:
${evidenceList}

RESEARCHER NOTES / HYPOTHESES:
${selectedNotesContent.join('\n')}

Generate all sections of the report in JSON format with these exact keys:
{
  "title": "${project.title}",
  "abstract": "Rigorous 150-250 word abstract",
  "introduction": "Comprehensive introduction setting up the problem space",
  "background": "Theoretical and mechanical/scientific background",
  "literatureReview": "Critical literature review referencing the sources strictly",
  "methodology": "Comparative methodology and evaluation criteria",
  "findings": "Empirical and theoretical findings synthesized from the evidence",
  "discussion": "Discussion of implications, edge trade-offs, and industrial relevance",
  "potentialResearchGaps": "Identified potential research gaps labeled with scholarly precision",
  "futureWork": "Actionable future research avenues",
  "conclusion": "Rigorous final conclusion",
  "references": ["Properly formatted reference 1", "Properly formatted reference 2"]
}`;

    const parsed = await this.generateStructuredOutput<any>(
      prompt,
      `You are writing an empirical academic research report using ${citationStyle} citation guidelines. Maintain absolute integrity; never fabricate results.`,
      model
    );

    return {
      title: parsed.title || project.title,
      abstract: parsed.abstract || 'Abstract unavailable.',
      introduction: parsed.introduction || 'Introduction unavailable.',
      background: parsed.background || 'Background unavailable.',
      literatureReview: parsed.literatureReview || 'Literature review unavailable.',
      methodology: parsed.methodology || 'Methodology unavailable.',
      findings: parsed.findings || 'Findings unavailable.',
      discussion: parsed.discussion || 'Discussion unavailable.',
      potentialResearchGaps: parsed.potentialResearchGaps || 'Potential research gaps unavailable.',
      futureWork: parsed.futureWork || 'Future work unavailable.',
      conclusion: parsed.conclusion || 'Conclusion unavailable.',
      references: Array.isArray(parsed.references) ? parsed.references : []
    };
  }
}
