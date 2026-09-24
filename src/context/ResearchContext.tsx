import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Project,
  Source,
  EvidenceRecord,
  SourceComparison,
  ResearchSynthesis,
  ResearchGapAnalysis,
  ResearchNote,
  ResearchReport,
  ChatMessage,
  WebSearchResult,
  AIProviderId,
  AIProviderStatus,
  SettingsState,
  CitationStyle
} from '../types/research.ts';
import { aiClient } from '../services/ai/clientAiService.ts';

export type WorkspaceView =
  | 'dashboard'
  | 'projects'
  | 'planner'
  | 'sources'
  | 'chat'
  | 'evidence'
  | 'comparisons'
  | 'syntheses'
  | 'gaps'
  | 'notes'
  | 'citations'
  | 'reports'
  | 'web-research'
  | 'settings';

interface ResearchContextType {
  projects: Project[];
  activeProject: Project | null;
  activeView: WorkspaceView;
  setActiveView: (view: WorkspaceView) => void;
  selectProject: (projectId: string) => void;
  createProject: (data: Partial<Project>, autoGeneratePlan?: boolean) => Promise<Project>;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  loadDemoProject: () => Promise<void>;

  // AI & Provider state
  settings: SettingsState;
  updateSettings: (newSettings: Partial<SettingsState>) => void;
  providerStatuses: AIProviderStatus[];
  refreshProviderStatuses: () => Promise<void>;
  activeProvider: AIProviderId;
  setActiveProvider: (provider: AIProviderId) => void;
  activeModel: string;
  testProviderConnection: (provider: AIProviderId) => Promise<{ success: boolean; message: string; latencyMs: number }>;

  // Loading & notification states
  isAILoading: boolean;
  aiTaskName: string;
  lastFallbackNotification: string | null;
  clearFallbackNotification: () => void;
  errorMessage: string | null;
  clearError: () => void;

  // Workflow actions
  generateResearchPlan: () => Promise<void>;
  addSource: (sourceData: Partial<Source>) => Promise<Source>;
  updateSource: (source: Source) => void;
  deleteSource: (sourceId: string) => void;
  analyzeSource: (sourceId: string) => Promise<void>;
  extractEvidenceFromSource: (sourceId: string) => Promise<void>;
  addEvidenceRecord: (rec: Partial<EvidenceRecord>) => void;
  updateEvidenceRecord: (rec: EvidenceRecord) => void;
  deleteEvidenceRecord: (evidenceId: string) => void;
  compareSources: (sourceIds: string[]) => Promise<SourceComparison>;
  generateSynthesis: (sourceIds?: string[]) => Promise<ResearchSynthesis>;
  analyzeResearchGaps: () => Promise<ResearchGapAnalysis[]>;
  addNote: (note: Partial<ResearchNote>) => void;
  updateNote: (note: ResearchNote) => void;
  deleteNote: (noteId: string) => void;
  generateReport: (options: {
    selectedSourceIds: string[];
    selectedEvidenceIds: string[];
    citationStyle: CitationStyle;
  }) => Promise<ResearchReport>;
  sendChatMessage: (message: string, scope?: 'project' | 'selected' | 'single', sourceIds?: string[]) => Promise<void>;
  performWebSearch: (query: string) => Promise<WebSearchResult[]>;
  promoteWebResultToSource: (resultId: string) => void;
}

const ResearchContext = createContext<ResearchContextType | null>(null);

const STORAGE_PROJECTS_KEY = 'researchflow_projects_v1';
const STORAGE_SETTINGS_KEY = 'researchflow_settings_v1';

const DEFAULT_SETTINGS: SettingsState = {
  primaryProvider: 'grok',
  fallbackProvider: 'groq',
  failoverEnabled: true,
  citationStyle: 'IEEE',
  grokModel: 'grok-4.6',
  groqModel: 'llama-3.3-70b-versatile'
};

export const ResearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeView, setActiveView] = useState<WorkspaceView>('dashboard');
  const [settings, setSettings] = useState<SettingsState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [providerStatuses, setProviderStatuses] = useState<AIProviderStatus[]>([]);
  const [isAILoading, setIsAILoading] = useState<boolean>(false);
  const [aiTaskName, setAiTaskName] = useState<string>('');
  const [lastFallbackNotification, setLastFallbackNotification] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active provider (derived from active project or settings)
  const activeProvider: AIProviderId = activeProject?.selectedProvider || settings.primaryProvider;
  const activeModel: string =
    activeProvider === 'grok' ? settings.grokModel : settings.groqModel;

  // Initialize and load projects from localStorage or Demo
  useEffect(() => {
    const init = async () => {
      try {
        const saved = localStorage.getItem(STORAGE_PROJECTS_KEY);
        if (saved) {
          const parsed: Project[] = JSON.parse(saved);
          if (parsed.length > 0) {
            setProjects(parsed);
            setActiveProject(parsed[0]);
            return;
          }
        }
      } catch (e) {
        console.error('Failed to read localStorage projects', e);
      }

      // Load initial demo project
      const demo = await aiClient.getDemoProject();
      setProjects([demo]);
      setActiveProject(demo);
    };

    init();
    refreshProviderStatuses();
  }, []);

  // Save projects to localStorage whenever changed
  useEffect(() => {
    if (projects.length > 0) {
      try {
        localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(projects));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }
    }
  }, [projects]);

  // Save settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('LocalStorage settings save error:', e);
    }
  }, [settings]);

  const refreshProviderStatuses = async () => {
    const statuses = await aiClient.getProviderStatuses();
    setProviderStatuses(statuses);
  };

  const updateSettings = (newSettings: Partial<SettingsState>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const setActiveProvider = (provider: AIProviderId) => {
    if (activeProject) {
      const updated = {
        ...activeProject,
        selectedProvider: provider,
        selectedModel: provider === 'grok' ? settings.grokModel : settings.groqModel
      };
      updateProject(updated);
    }
    updateSettings({ primaryProvider: provider });
  };

  const selectProject = (projectId: string) => {
    const found = projects.find((p) => p.id === projectId);
    if (found) {
      setActiveProject(found);
    }
  };

  const updateProject = (updated: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (activeProject?.id === updated.id) {
      setActiveProject(updated);
    }
  };

  const deleteProject = (projectId: string) => {
    const remaining = projects.filter((p) => p.id !== projectId);
    setProjects(remaining);
    if (activeProject?.id === projectId) {
      setActiveProject(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const loadDemoProject = async () => {
    setIsAILoading(true);
    setAiTaskName('Loading Reference Demo Workspace...');
    try {
      const demo = await aiClient.getDemoProject();
      const existingIdx = projects.findIndex((p) => p.id === demo.id);
      if (existingIdx !== -1) {
        const updated = [...projects];
        updated[existingIdx] = demo;
        setProjects(updated);
      } else {
        setProjects((prev) => [demo, ...prev]);
      }
      setActiveProject(demo);
      setActiveView('dashboard');
    } finally {
      setIsAILoading(false);
      setAiTaskName('');
    }
  };

  const createProject = async (data: Partial<Project>, autoGeneratePlan = true): Promise<Project> => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: data.title || 'Untitled Research Project',
      topic: data.topic || 'General Technical Research',
      question: data.question || 'What are the empirical limitations and opportunities?',
      objectives: data.objectives || '',
      field: data.field || 'Engineering',
      keywords: data.keywords || [],
      level: data.level || 'Researcher',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      selectedProvider: settings.primaryProvider,
      selectedModel: settings.primaryProvider === 'grok' ? settings.grokModel : settings.groqModel,
      sources: [],
      evidence: [],
      comparisons: [],
      syntheses: [],
      gaps: [],
      notes: [],
      reports: [],
      webResults: [],
      chatHistory: []
    };

    let finalProj = newProj;

    if (autoGeneratePlan) {
      setIsAILoading(true);
      setAiTaskName('Synthesizing Research Plan...');
      try {
        const res = await aiClient.runTask({
          provider: newProj.selectedProvider,
          task: 'plan',
          payload: newProj,
          model: newProj.selectedModel,
          failoverEnabled: settings.failoverEnabled,
          fallbackProvider: settings.fallbackProvider
        });

        finalProj = {
          ...newProj,
          plan: res.data
        };

        if (res.fallbackUsed && res.fallbackMessage) {
          setLastFallbackNotification(res.fallbackMessage);
        }
      } catch (err: any) {
        setErrorMessage(`Plan generation note: ${err.message}`);
      } finally {
        setIsAILoading(false);
        setAiTaskName('');
      }
    }

    setProjects((prev) => [finalProj, ...prev]);
    setActiveProject(finalProj);
    setActiveView('planner');
    return finalProj;
  };

  const generateResearchPlan = async () => {
    if (!activeProject) return;
    setIsAILoading(true);
    setAiTaskName('Synthesizing Research Plan...');
    setErrorMessage(null);

    try {
      const res = await aiClient.runTask({
        provider: activeProvider,
        task: 'plan',
        payload: activeProject,
        model: activeModel,
        failoverEnabled: settings.failoverEnabled,
        fallbackProvider: settings.fallbackProvider
      });

      const updated = {
        ...activeProject,
        plan: res.data,
        updatedAt: new Date().toISOString()
      };
      updateProject(updated);

      if (res.fallbackUsed && res.fallbackMessage) {
        setLastFallbackNotification(res.fallbackMessage);
      }
    } catch (err: any) {
      setErrorMessage(`Failed to generate research plan: ${err.message}`);
    } finally {
      setIsAILoading(false);
      setAiTaskName('');
    }
  };

  const addSource = async (sourceData: Partial<Source>): Promise<Source> => {
    if (!activeProject) throw new Error('No active project');
    const newSource: Source = {
      id: `src-${Date.now()}`,
      projectId: activeProject.id,
      title: sourceData.title || 'Untitled Source',
      authors: sourceData.authors || [],
      publicationDate: sourceData.publicationDate || new Date().toISOString().split('T')[0],
      sourceType: sourceData.sourceType || 'Journal Article',
      url: sourceData.url || '',
      doi: sourceData.doi,
      abstract: sourceData.abstract || '',
      fullText: sourceData.fullText || '',
      summary: sourceData.summary || '',
      relevance: sourceData.relevance || 'Supporting',
      tags: sourceData.tags || [],
      status: 'Added',
      addedAt: new Date().toISOString()
    };

    const updated = {
      ...activeProject,
      sources: [newSource, ...activeProject.sources],
      updatedAt: new Date().toISOString()
    };
    updateProject(updated);
    return newSource;
  };

  const updateSource = (source: Source) => {
    if (!activeProject) return;
    const updated = {
      ...activeProject,
      sources: activeProject.sources.map((s) => (s.id === source.id ? source : s)),
      updatedAt: new Date().toISOString()
    };
    updateProject(updated);
  };

  const deleteSource = (sourceId: string) => {
    if (!activeProject) return;
    const updated = {
      ...activeProject,
      sources: activeProject.sources.filter((s) => s.id !== sourceId),
      evidence: activeProject.evidence.filter((e) => e.sourceId !== sourceId),
      updatedAt: new Date().toISOString()
    };
    updateProject(updated);
  };

  const analyzeSource = async (sourceId: string) => {
    if (!activeProject) return;
    const source = activeProject.sources.find((s) => s.id === sourceId);
    if (!source) return;

    setIsAILoading(true);
    setAiTaskName(`Analyzing Source: "${source.title.slice(0, 30)}..."`);
    setErrorMessage(null);

    // Set status to processing
    updateSource({ ...source, status: 'Processing' });

    try {
      const res = await aiClient.runTask({
        provider: activeProvider,
        task: 'analyze-source',
        payload: {
          source,
          projectContext: `Project: ${activeProject.title}\nQuestion: ${activeProject.question}\nField: ${activeProject.field}`
        },
        model: activeModel,
        failoverEnabled: settings.failoverEnabled,
        fallbackProvider: settings.fallbackProvider
      });

      const updatedSource: Source = {
        ...source,
        analysis: res.data,
        summary: res.data.summary || source.summary,
        status: 'Analyzed'
      };
      updateSource(updatedSource);

      if (res.fallbackUsed && res.fallbackMessage) {
        setLastFallbackNotification(res.fallbackMessage);
      }
    } catch (err: any) {
      updateSource({ ...source, status: 'Needs Review' });
      setErrorMessage(`Source analysis error: ${err.message}`);
    } finally {
      setIsAILoading(false);
      setAiTaskName('');
    }
  };

  const extractEvidenceFromSource = async (sourceId: string) => {
    if (!activeProject) return;
    const source = activeProject.sources.find((s) => s.id === sourceId);
    if (!source) return;

    setIsAILoading(true);
    setAiTaskName(`Extracting Structured Evidence from: "${source.title.slice(0, 30)}..."`);
    setErrorMessage(null);

    try {
      const res = await aiClient.runTask({
        provider: activeProvider,
        task: 'extract-evidence',
        payload: {
          source,
          projectContext: `Project: ${activeProject.title}\nQuestion: ${activeProject.question}`
        },
        model: activeModel,
        failoverEnabled: settings.failoverEnabled,
        fallbackProvider: settings.fallbackProvider
      });

      const newRecords: EvidenceRecord[] = res.data;
      const updated = {
        ...activeProject,
        evidence: [...newRecords, ...activeProject.evidence],
        updatedAt: new Date().toISOString()
      };
      updateProject(updated);

      if (res.fallbackUsed && res.fallbackMessage) {
        setLastFallbackNotification(res.fallbackMessage);
      }
    } catch (err: any) {
      setErrorMessage(`Failed to extract evidence: ${err.message}`);
    } finally {
      setIsAILoading(false);
      setAiTaskName('');
    }
  };

  const addEvidenceRecord = (rec: Partial<EvidenceRecord>) => {
    if (!activeProject) return;
    const newRecord: EvidenceRecord = {
      id: `ev-${Date.now()}`,
      projectId: activeProject.id,
      sourceId: rec.sourceId || '',
      sourceTitle: rec.sourceTitle || 'Manual Entry',
      claim: rec.claim || '',
      sourceEvidence: rec.sourceEvidence || '',
      location: rec.location || 'Manual / User Note',
      evidenceType: rec.evidenceType || 'Empirical',
      confidence: rec.confidence || 'High',
      aiInterpretation: rec.aiInterpretation || '',
      aiSuggestion: rec.aiSuggestion || '',
      userNotes: rec.userNotes || '',
      createdAt: new Date().toISOString()
    };

    const updated = {
      ...activeProject,
      evidence: [newRecord, ...activeProject.evidence],
      updatedAt: new Date().toISOString()
    };
    updateProject(updated);
  };

  const updateEvidenceRecord = (rec: EvidenceRecord) => {
    if (!activeProject) return;
    const updated = {
      ...activeProject,
      evidence: activeProject.evidence.map((e) => (e.id === rec.id ? rec : e)),
      updatedAt: new Date().toISOString()
    };
    updateProject(updated);
  };

  const deleteEvidenceRecord = (evidenceId: string) => {
    if (!activeProject) return;
    const updated = {
      ...activeProject,
      evidence: activeProject.evidence.filter((e) => e.id !== evidenceId),
      updatedAt: new Date().toISOString()
    };
    updateProject(updated);
  };

  const compareSources = async (sourceIds: string[]): Promise<SourceComparison> => {
    if (!activeProject) throw new Error('No active project');
    const selected = activeProject.sources.filter((s) => sourceIds.includes(s.id));
    if (selected.length < 2) throw new Error('Select at least 2 sources to generate comparison matrix');

    setIsAILoading(true);
    setAiTaskName(`Comparing ${selected.length} Empirical Sources...`);
    setErrorMessage(null);

    try {
      const res = await aiClient.runTask({
        provider: activeProvider,
        task: 'compare',
        payload: {
          sources: selected,
          projectContext: `Project: ${activeProject.title}\nQuestion: ${activeProject.question}`
        },
        model: activeModel,
        failoverEnabled: settings.failoverEnabled,
        fallbackProvider: settings.fallbackProvider
      });

      const comparison: SourceComparison = res.data;
      const updated = {
        ...activeProject,
        comparisons: [comparison, ...activeProject.comparisons],
        updatedAt: new Date().toISOString()
      };
      updateProject(updated);

      if (res.fallbackUsed && res.fallbackMessage) {
        setLastFallbackNotification(res.fallbackMessage);
      }
      return comparison;
    } finally {
      setIsAILoading(false);
      setAiTaskName('');
    }
  };

  const generateSynthesis = async (sourceIds?: string[]): Promise<ResearchSynthesis> => {
    if (!activeProject) throw new Error('No active project');
    const sourcesToUse = sourceIds && sourceIds.length > 0
      ? activeProject.sources.filter((s) => sourceIds.includes(s.id))
      : activeProject.sources;

    setIsAILoading(true);
    setAiTaskName('Synthesizing Cross-Literature Findings...');
    setErrorMessage(null);

    try {
      const res = await aiClient.runTask({
        provider: activeProvider,
        task: 'synthesis',
        payload: {
          sources: sourcesToUse,
          evidence: activeProject.evidence,
          projectContext: `Project: ${activeProject.title}\nQuestion: ${activeProject.question}`
        },
        model: activeModel,
        failoverEnabled: settings.failoverEnabled,
        fallbackProvider: settings.fallbackProvider
      });

      const synthesis: ResearchSynthesis = res.data;
      const updated = {
        ...activeProject,
        syntheses: [synthesis, ...activeProject.syntheses],
        updatedAt: new Date().toISOString()
      };
      updateProject(updated);

      if (res.fallbackUsed && res.fallbackMessage) {
        setLastFallbackNotification(res.fallbackMessage);
      }
      return synthesis;
    } finally {
      setIsAILoading(false);
      setAiTaskName('');
    }
  };

  const analyzeResearchGaps = async (): Promise<ResearchGapAnalysis[]> => {
    if (!activeProject) throw new Error('No active project');
    setIsAILoading(true);
    setAiTaskName('Analyzing Potential Research Gaps...');
    setErrorMessage(null);

    try {
      const res = await aiClient.runTask({
        provider: activeProvider,
        task: 'gaps',
        payload: {
          sources: activeProject.sources,
          evidence: activeProject.evidence,
          projectContext: `Project: ${activeProject.title}\nQuestion: ${activeProject.question}`
        },
        model: activeModel,
        failoverEnabled: settings.failoverEnabled,
        fallbackProvider: settings.fallbackProvider
      });

      const gaps: ResearchGapAnalysis[] = res.data;
      const updated = {
        ...activeProject,
        gaps: [...gaps, ...activeProject.gaps],
        updatedAt: new Date().toISOString()
      };
      updateProject(updated);

      if (res.fallbackUsed && res.fallbackMessage) {
        setLastFallbackNotification(res.fallbackMessage);
      }
      return gaps;
    } finally {
      setIsAILoading(false);
      setAiTaskName('');
    }
  };

  const addNote = (note: Partial<ResearchNote>) => {
    if (!activeProject) return;
    const newNote: ResearchNote = {
      id: `note-${Date.now()}`,
      projectId: activeProject.id,
      type: note.type || 'General Note',
      title: note.title || 'Untitled Note',
      content: note.content || '',
      tags: note.tags || [],
      sourceId: note.sourceId,
      sourceTitle: note.sourceTitle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = {
      ...activeProject,
      notes: [newNote, ...activeProject.notes],
      updatedAt: new Date().toISOString()
    };
    updateProject(updated);
  };

  const updateNote = (note: ResearchNote) => {
    if (!activeProject) return;
    const updated = {
      ...activeProject,
      notes: activeProject.notes.map((n) => (n.id === note.id ? note : n)),
      updatedAt: new Date().toISOString()
    };
    updateProject(updated);
  };

  const deleteNote = (noteId: string) => {
    if (!activeProject) return;
    const updated = {
      ...activeProject,
      notes: activeProject.notes.filter((n) => n.id !== noteId),
      updatedAt: new Date().toISOString()
    };
    updateProject(updated);
  };

  const generateReport = async (options: {
    selectedSourceIds: string[];
    selectedEvidenceIds: string[];
    citationStyle: CitationStyle;
  }): Promise<ResearchReport> => {
    if (!activeProject) throw new Error('No active project');
    setIsAILoading(true);
    setAiTaskName(`Compiling ${options.citationStyle} Research Report...`);
    setErrorMessage(null);

    const selectedSources = activeProject.sources.filter((s) => options.selectedSourceIds.includes(s.id));
    const selectedEvidence = activeProject.evidence.filter((e) => options.selectedEvidenceIds.includes(e.id));
    const notesContent = activeProject.notes.map((n) => `[${n.type}] ${n.title}: ${n.content}`);

    try {
      const res = await aiClient.runTask({
        provider: activeProvider,
        task: 'report',
        payload: {
          project: activeProject,
          selectedSources,
          selectedEvidence,
          selectedNotesContent: notesContent,
          citationStyle: options.citationStyle
        },
        model: activeModel,
        failoverEnabled: settings.failoverEnabled,
        fallbackProvider: settings.fallbackProvider
      });

      const report: ResearchReport = {
        id: `rep-${Date.now()}`,
        projectId: activeProject.id,
        title: activeProject.title,
        citationStyle: options.citationStyle,
        sections: res.data,
        generatedAt: new Date().toISOString(),
        providerUsed: res.providerUsed,
        modelUsed: res.modelUsed
      };

      const updated = {
        ...activeProject,
        reports: [report, ...activeProject.reports],
        updatedAt: new Date().toISOString()
      };
      updateProject(updated);

      if (res.fallbackUsed && res.fallbackMessage) {
        setLastFallbackNotification(res.fallbackMessage);
      }
      return report;
    } finally {
      setIsAILoading(false);
      setAiTaskName('');
    }
  };

  const sendChatMessage = async (
    message: string,
    scope: 'project' | 'selected' | 'single' = 'project',
    sourceIds: string[] = []
  ) => {
    if (!activeProject) return;
    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}-user`,
      role: 'user',
      content: message,
      scope,
      targetedSourceIds: sourceIds,
      timestamp: new Date().toISOString()
    };

    const newHistory = [...activeProject.chatHistory, userMsg];
    updateProject({ ...activeProject, chatHistory: newHistory });

    setIsAILoading(true);
    setAiTaskName('Synthesizing Grounded Research Response...');
    setErrorMessage(null);

    const activeSources =
      sourceIds.length > 0
        ? activeProject.sources.filter((s) => sourceIds.includes(s.id))
        : activeProject.sources;

    try {
      const res = await aiClient.runTask({
        provider: activeProvider,
        task: 'chat',
        payload: {
          question: message,
          sources: activeSources,
          projectContext: `Project Title: ${activeProject.title}\nPrimary Question: ${activeProject.question}\nField: ${activeProject.field}`,
          history: newHistory.slice(-6).map((m) => ({ role: m.role, content: m.content }))
        },
        model: activeModel,
        failoverEnabled: settings.failoverEnabled,
        fallbackProvider: settings.fallbackProvider
      });

      const aiMsg: ChatMessage = {
        id: `chat-${Date.now()}-ai`,
        role: 'assistant',
        content: res.data.answer || 'Response synthesized.',
        structuredAnswer: res.data,
        scope,
        targetedSourceIds: sourceIds,
        timestamp: new Date().toISOString(),
        providerUsed: res.providerUsed,
        modelUsed: res.modelUsed,
        fallbackUsed: res.fallbackUsed
      };

      updateProject({
        ...activeProject,
        chatHistory: [...newHistory, aiMsg]
      });

      if (res.fallbackUsed && res.fallbackMessage) {
        setLastFallbackNotification(res.fallbackMessage);
      }
    } catch (err: any) {
      setErrorMessage(`Chat error: ${err.message}`);
    } finally {
      setIsAILoading(false);
      setAiTaskName('');
    }
  };

  const performWebSearch = async (query: string): Promise<WebSearchResult[]> => {
    if (!activeProject) return [];
    setIsAILoading(true);
    setAiTaskName(`Querying Academic Web for "${query.slice(0, 25)}..."`);
    try {
      const results = await aiClient.searchWeb(query, activeProject.id);
      const updated = {
        ...activeProject,
        webResults: [...results, ...activeProject.webResults]
      };
      updateProject(updated);
      return results;
    } finally {
      setIsAILoading(false);
      setAiTaskName('');
    }
  };

  const promoteWebResultToSource = (resultId: string) => {
    if (!activeProject) return;
    const item = activeProject.webResults.find((w) => w.id === resultId);
    if (!item) return;

    addSource({
      title: item.title,
      authors: [item.source],
      publicationDate: item.retrievalTimestamp.split('T')[0],
      sourceType: 'Web Document',
      url: item.url,
      abstract: item.excerpt,
      relevance: 'Contextual',
      tags: ['Web Index', 'Crossref/Wikipedia']
    });
  };

  const testProviderConnection = async (provider: AIProviderId) => {
    const model = provider === 'grok' ? settings.grokModel : settings.groqModel;
    const res = await aiClient.testConnection(provider, model);
    await refreshProviderStatuses();
    return res;
  };

  const clearFallbackNotification = () => setLastFallbackNotification(null);
  const clearError = () => setErrorMessage(null);

  return (
    <ResearchContext.Provider
      value={{
        projects,
        activeProject,
        activeView,
        setActiveView,
        selectProject,
        createProject,
        updateProject,
        deleteProject,
        loadDemoProject,
        settings,
        updateSettings,
        providerStatuses,
        refreshProviderStatuses,
        activeProvider,
        setActiveProvider,
        activeModel,
        testProviderConnection,
        isAILoading,
        aiTaskName,
        lastFallbackNotification,
        clearFallbackNotification,
        errorMessage,
        clearError,
        generateResearchPlan,
        addSource,
        updateSource,
        deleteSource,
        analyzeSource,
        extractEvidenceFromSource,
        addEvidenceRecord,
        updateEvidenceRecord,
        deleteEvidenceRecord,
        compareSources,
        generateSynthesis,
        analyzeResearchGaps,
        addNote,
        updateNote,
        deleteNote,
        generateReport,
        sendChatMessage,
        performWebSearch,
        promoteWebResultToSource
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
};

export const useResearch = () => {
  const context = useContext(ResearchContext);
  if (!context) {
    throw new Error('useResearch must be used within a ResearchProvider');
  }
  return context;
};
