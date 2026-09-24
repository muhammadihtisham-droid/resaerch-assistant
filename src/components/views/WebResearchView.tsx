import React, { useState } from 'react';
import { useResearch } from '../../context/ResearchContext.tsx';
import { WebSearchResult } from '../../types/research.ts';
import {
  Globe2,
  Search,
  ExternalLink,
  BookPlus,
  ShieldCheck,
  Clock,
  Sparkles,
  Database,
  ArrowRight
} from 'lucide-react';

export const WebResearchView: React.FC = () => {
  const {
    activeProject,
    performWebSearch,
    promoteWebResultToSource,
    isAILoading
  } = useResearch();

  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  if (!activeProject) {
    return <div className="text-center py-16 text-slate-400">No active project selected.</div>;
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isAILoading) return;
    setHasSearched(true);
    await performWebSearch(query.trim());
  };

  const results = activeProject.webResults;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
            Dedicated Exploration · Academic Index
          </div>
          <h1 className="text-xl font-semibold text-white mt-0.5">
            External Academic Web Discovery
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Grounded scholarly search querying Crossref DOI registries and open technical indices. Stored strictly separate from verified internal sources.
          </p>
        </div>
      </div>

      {/* Mandatory Separation Notice */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 text-xs text-slate-300 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="text-slate-100 font-medium">
            Architectural Separation Guarantee
          </strong>
          <p className="leading-relaxed text-slate-400">
            Web search results are isolated in this discovery sandbox to prevent phantom citations. To include any external finding in your evidence matrix or publication report, click <strong>"Import as Project Source"</strong>.
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isAILoading}
            placeholder="Search academic indices (e.g., '1D-CNN predictive maintenance', 'bearing vibration kurtosis')..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner"
          />
        </div>
        <button
          type="submit"
          disabled={!query.trim() || isAILoading}
          className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
        >
          {isAILoading ? (
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Globe2 className="w-3.5 h-3.5" />
          )}
          <span>Search Index</span>
        </button>
      </form>

      {/* Results List */}
      <div className="space-y-4">
        {results.length === 0 ? (
          <div className="border border-slate-800 rounded-lg bg-slate-900/60 p-8 text-center text-slate-400 text-xs space-y-2">
            <Database className="w-8 h-8 text-slate-500 mx-auto" />
            <p>No external search records indexed yet. Search Crossref and academic repositories above.</p>
          </div>
        ) : (
          results.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3 shadow-sm hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-cyan-400 text-[11px] font-medium">
                    {item.source}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="font-mono text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Retrieved: {new Date(item.retrievalTimestamp).toLocaleString()}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => promoteWebResultToSource(item.id)}
                    className="bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 text-xs px-2.5 py-1 rounded transition-colors flex items-center gap-1"
                  >
                    <BookPlus className="w-3.5 h-3.5" />
                    <span>Import as Project Source</span>
                  </button>

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-cyan-400 p-1 text-xs flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Visit</span>
                    </a>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {item.excerpt}
                </p>
              </div>

              <div className="text-[11px] font-mono text-slate-500 truncate">
                Target URL: {item.url}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
