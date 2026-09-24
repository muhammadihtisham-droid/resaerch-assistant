import React, { useState } from 'react';
import { useResearch } from '../../context/ResearchContext.tsx';
import { Source, SourceType, SourceRelevance, SourceStatus } from '../../types/research.ts';
import {
  BookOpen,
  Plus,
  Sparkles,
  ExternalLink,
  Trash2,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  Tag,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  Search,
  Filter
} from 'lucide-react';

const SOURCE_TYPES: SourceType[] = [
  'Journal Article',
  'Conference Paper',
  'Book / Book Chapter',
  'Technical Report',
  'Preprint',
  'Web Document',
  'Dataset'
];

const RELEVANCE_LEVELS: SourceRelevance[] = ['Core', 'Supporting', 'Contextual'];

export const SourcesView: React.FC = () => {
  const {
    activeProject,
    addSource,
    deleteSource,
    analyzeSource,
    extractEvidenceFromSource,
    isAILoading,
    activeProvider
  } = useResearch();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [relevanceFilter, setRelevanceFilter] = useState<string>('All');

  // Form states
  const [title, setTitle] = useState('');
  const [authorsInput, setAuthorsInput] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [sourceType, setSourceType] = useState<SourceType>('Journal Article');
  const [url, setUrl] = useState('');
  const [doi, setDoi] = useState('');
  const [abstract, setAbstract] = useState('');
  const [fullText, setFullText] = useState('');
  const [relevance, setRelevance] = useState<SourceRelevance>('Core');
  const [tagsInput, setTagsInput] = useState('');

  if (!activeProject) {
    return <div className="text-center py-16 text-slate-400">No active project selected.</div>;
  }

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const authors = authorsInput
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    await addSource({
      title: title.trim(),
      authors,
      publicationDate: publicationDate || new Date().toISOString().split('T')[0],
      sourceType,
      url: url.trim(),
      doi: doi.trim() || undefined,
      abstract: abstract.trim(),
      fullText: fullText.trim(),
      relevance,
      tags
    });

    setIsAddModalOpen(false);
    // Reset
    setTitle('');
    setAuthorsInput('');
    setPublicationDate('');
    setUrl('');
    setDoi('');
    setAbstract('');
    setFullText('');
    setTagsInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTitle(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFullText(content || '');
      setAbstract(content ? content.slice(0, 500) + '...' : '');
    };
    reader.readAsText(file);
  };

  const filteredSources = activeProject.sources.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (s.authors || []).some((a) => a.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (s.tags || []).some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchesRelevance = relevanceFilter === 'All' || s.relevance === relevanceFilter;

    return matchesSearch && matchesStatus && matchesRelevance;
  });

  const selectedSource = activeProject.sources.find((s) => s.id === selectedSourceId);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
            Phase 02 · Source Collection & Analysis
          </div>
          <h1 className="text-xl font-semibold text-white mt-0.5">
            Literature Repository & Deep Analyzer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Ingest papers, extract methodologies, variables & empirical claims with {activeProvider.toUpperCase()}.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium px-4 py-2 rounded-md transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Research Source</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Filter by title, author, or keyword..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-md px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Added">Added</option>
            <option value="Processing">Processing</option>
            <option value="Analyzed">Analyzed</option>
            <option value="Needs Review">Needs Review</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Relevance:</span>
          <select
            value={relevanceFilter}
            onChange={(e) => setRelevanceFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-md px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="All">All Relevance</option>
            <option value="Core">Core</option>
            <option value="Supporting">Supporting</option>
            <option value="Contextual">Contextual</option>
          </select>
        </div>
      </div>

      {/* Main Sources Grid & Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Source Cards List */}
        <div className={`${selectedSource ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-3`}>
          {filteredSources.length === 0 ? (
            <div className="border border-slate-800 rounded-lg bg-slate-900/60 p-8 text-center text-slate-400 text-xs">
              No sources found matching your filters. Click "Add Research Source" above to add your first paper or document.
            </div>
          ) : (
            filteredSources.map((source) => {
              const isSelected = source.id === selectedSourceId;
              const hasAnalysis = Boolean(source.analysis);

              return (
                <div
                  key={source.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-950/40'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                  onClick={() => setSelectedSourceId(source.id)}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="font-mono text-cyan-400">{source.sourceType}</span>
                      <span>·</span>
                      <span className="font-mono">{source.publicationDate}</span>
                      <span>·</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                          source.relevance === 'Core'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {source.relevance}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 ${
                          source.status === 'Analyzed'
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                            : source.status === 'Processing'
                            ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/60'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {source.status === 'Analyzed' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        {source.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-white mb-1 leading-snug">
                    {source.title}
                  </h3>

                  <p className="text-xs text-slate-400 mb-2">
                    {(source.authors || []).join(', ') || 'Metadata unavailable'}
                  </p>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                    {source.summary || source.abstract || 'No abstract or summary provided.'}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                    <div className="flex flex-wrap gap-1">
                      {(source.tags || []).slice(0, 3).map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {!hasAnalysis ? (
                        <button
                          onClick={() => analyzeSource(source.id)}
                          disabled={isAILoading}
                          className="text-[11px] bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 px-2 py-1 rounded transition-colors flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Deep Analyze</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => extractEvidenceFromSource(source.id)}
                          disabled={isAILoading}
                          className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded transition-colors flex items-center gap-1"
                        >
                          <FileCheck2 className="w-3 h-3 text-cyan-400" />
                          <span>Extract Evidence</span>
                        </button>
                      )}

                      <button
                        onClick={() => deleteSource(source.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Delete Source"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Source Deep Inspection Panel */}
        {selectedSource && (
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto sticky top-20 scrollbar-thin">
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                  Detailed Source Analysis
                </span>
                <h2 className="text-base font-semibold text-white mt-0.5">
                  {selectedSource.title}
                </h2>
                <div className="text-xs text-slate-400 mt-1">
                  {(selectedSource.authors || []).join(', ') || 'Metadata unavailable'} · {selectedSource.publicationDate}
                </div>
              </div>

              <button
                onClick={() => setSelectedSourceId(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded"
              >
                Close
              </button>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => analyzeSource(selectedSource.id)}
                disabled={isAILoading}
                className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-3 py-1.5 rounded transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{selectedSource.analysis ? 'Re-Analyze Source' : 'Run Deep Analysis'}</span>
              </button>

              <button
                onClick={() => extractEvidenceFromSource(selectedSource.id)}
                disabled={isAILoading}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Extract Evidence Records</span>
              </button>

              {selectedSource.url && (
                <a
                  href={selectedSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-cyan-400 text-xs px-2 py-1.5 flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Visit Link</span>
                </a>
              )}
            </div>

            {/* Analysis details */}
            {selectedSource.analysis ? (
              <div className="space-y-4 text-xs">
                {/* Summary */}
                <div className="p-3 bg-slate-950/60 rounded border border-slate-800/80">
                  <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
                    Factual Summary
                  </div>
                  <p className="text-slate-200 leading-relaxed">
                    {selectedSource.analysis.summary}
                  </p>
                </div>

                {/* Research Objective */}
                <div className="p-3 bg-slate-950/60 rounded border border-slate-800/80">
                  <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
                    Explicit Research Objective
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedSource.analysis.researchObjective}
                  </p>
                </div>

                {/* Methodology & Dataset */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-950/60 rounded border border-slate-800/80">
                    <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
                      Methodology
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {selectedSource.analysis.methodology}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded border border-slate-800/80">
                    <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
                      Dataset & Rig Parameters
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {selectedSource.analysis.datasetExperimentalInfo}
                    </p>
                  </div>
                </div>

                {/* Variables */}
                <div className="p-3 bg-slate-950/60 rounded border border-slate-800/80">
                  <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
                    Investigated Variables & Controls
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedSource.analysis.variables.map((v, i) => (
                      <span
                        key={i}
                        className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px]"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Findings */}
                <div className="p-3 bg-slate-950/60 rounded border border-slate-800/80">
                  <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider mb-1">
                    Key Findings (Verifiable)
                  </div>
                  <ul className="space-y-1.5 text-slate-300">
                    {selectedSource.analysis.keyFindings.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-mono text-[11px] shrink-0 mt-0.5">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limitations & Future Work */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-950/60 rounded border border-slate-800/80">
                    <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider mb-1">
                      Reported Limitations
                    </div>
                    <ul className="space-y-1 text-slate-300">
                      {selectedSource.analysis.limitations.map((l, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-400 shrink-0 font-mono text-[10px]">▲</span>
                          <span>{l}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded border border-slate-800/80">
                    <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
                      Author Future Directions
                    </div>
                    <ul className="space-y-1 text-slate-300">
                      {selectedSource.analysis.futureWork.map((fw, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-cyan-400 shrink-0 font-mono text-[10px]">→</span>
                          <span>{fw}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Important Evidence Excerpts */}
                <div className="p-3 bg-slate-950/60 rounded border border-slate-800/80">
                  <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
                    Important Source Quotations / Excerpts
                  </div>
                  <div className="space-y-2 text-slate-300">
                    {selectedSource.analysis.importantEvidence.map((ev, i) => (
                      <blockquote
                        key={i}
                        className="pl-3 border-l-2 border-cyan-500/60 italic text-slate-300 font-serif"
                      >
                        {ev}
                      </blockquote>
                    ))}
                  </div>
                </div>

                {/* Relevance to Question */}
                <div className="p-3 bg-cyan-950/30 rounded border border-cyan-900/50">
                  <div className="text-[11px] font-mono text-cyan-300 uppercase tracking-wider mb-1">
                    Relevance to Project Question
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedSource.analysis.researchRelevance}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center border border-slate-800/80 rounded bg-slate-950/40 space-y-2">
                <FileText className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400">
                  This source has not undergone structured deep analysis yet.
                </p>
                <button
                  onClick={() => analyzeSource(selectedSource.id)}
                  disabled={isAILoading}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-3 py-1.5 rounded transition-colors inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Analyze with {activeProvider.toUpperCase()}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Source Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-2xl w-full p-6 shadow-2xl relative my-8">
            <h2 className="text-lg font-semibold text-white mb-1">Add Academic Source</h2>
            <p className="text-xs text-slate-400 mb-4">
              Enter publication metadata, abstract, or upload/paste full text content for analysis.
            </p>

            <form onSubmit={handleAddSource} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Source Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Acoustic emission vs vibration analysis in bearing diagnostics"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Authors (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={authorsInput}
                    onChange={(e) => setAuthorsInput(e.target.value)}
                    placeholder="e.g. J. Zhang, H. Miller, K. Tanaka"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Publication Date / Year
                  </label>
                  <input
                    type="text"
                    value={publicationDate}
                    onChange={(e) => setPublicationDate(e.target.value)}
                    placeholder="e.g. 2024 or 2024-03-15"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Source Type
                  </label>
                  <select
                    value={sourceType}
                    onChange={(e) => setSourceType(e.target.value as SourceType)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {SOURCE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Relevance Level
                  </label>
                  <select
                    value={relevance}
                    onChange={(e) => setRelevance(e.target.value as SourceRelevance)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {RELEVANCE_LEVELS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    DOI (Optional)
                  </label>
                  <input
                    type="text"
                    value={doi}
                    onChange={(e) => setDoi(e.target.value)}
                    placeholder="10.1109/..."
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Abstract / Executive Summary
                </label>
                <textarea
                  rows={3}
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  placeholder="Paste paper abstract..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-300">
                    Full Text or Paper Excerpts
                  </label>
                  <label className="text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>Upload Text/PDF Text File</span>
                    <input
                      type="file"
                      accept=".txt,.md,.json,.csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <textarea
                  rows={4}
                  value={fullText}
                  onChange={(e) => setFullText(e.target.value)}
                  placeholder="Paste full text, methodology, results sections, or tables..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Keywords / Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. vibration, acoustic emission, fatigue, bearing"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-medium px-4 py-2 rounded-md transition-colors"
                >
                  Add Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
