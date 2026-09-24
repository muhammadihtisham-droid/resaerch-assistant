import React, { useState } from 'react';
import { useResearch } from '../../context/ResearchContext.tsx';
import { CitationStyle } from '../../types/research.ts';
import { formatCitation, generateBibtex } from '../../utils/citations.ts';
import {
  Quote,
  Copy,
  Check,
  Download,
  BookOpen,
  Code,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const CitationsView: React.FC = () => {
  const { activeProject, settings, updateSettings } = useResearch();

  const [activeStyle, setActiveStyle] = useState<CitationStyle>(settings.citationStyle || 'IEEE');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bibtexCopiedId, setBibtexCopiedId] = useState<string | null>(null);

  if (!activeProject) {
    return <div className="text-center py-16 text-slate-400">No active project selected.</div>;
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyBibtex = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setBibtexCopiedId(id);
    setTimeout(() => setBibtexCopiedId(null), 2000);
  };

  const handleExportAll = () => {
    const allFormatted = activeProject.sources
      .map((s, idx) => formatCitation(s, activeStyle, idx + 1))
      .join('\n\n');

    const blob = new Blob([allFormatted], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeProject.title.slice(0, 25).replace(/\s+/g, '_')}_citations_${activeStyle}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportAllBibtex = () => {
    const allBib = activeProject.sources
      .map((s, idx) => generateBibtex(s, idx + 1))
      .join('\n\n');

    const blob = new Blob([allBib], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeProject.title.slice(0, 25).replace(/\s+/g, '_')}_references.bib`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
            Phase 08 · Scholarly Provenance
          </div>
          <h1 className="text-xl font-semibold text-white mt-0.5">
            Citation & Bibliography Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Standard-compliant citation formatting. Strictly preserves missing fields as "Metadata unavailable" (no fabricated DOIs or journals).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportAll}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3 py-2 rounded-md transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Text List</span>
          </button>
          <button
            onClick={handleExportAllBibtex}
            className="inline-flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium px-3 py-2 rounded-md transition-colors shadow-sm"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Export .bib</span>
          </button>
        </div>
      </div>

      {/* Style Selector Tabs (IEEE Highlighted for Engineering) */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Citation Standard:</span>
          <div className="flex items-center gap-1.5">
            {/* IEEE Tab - Highlighted */}
            <button
              onClick={() => {
                setActiveStyle('IEEE');
                updateSettings({ citationStyle: 'IEEE' });
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeStyle === 'IEEE'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <span>IEEE</span>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1 rounded border border-cyan-800">
                Engineering Standard
              </span>
            </button>

            <button
              onClick={() => {
                setActiveStyle('APA');
                updateSettings({ citationStyle: 'APA' });
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeStyle === 'APA'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              APA 7th
            </button>

            <button
              onClick={() => {
                setActiveStyle('MLA');
                updateSettings({ citationStyle: 'MLA' });
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeStyle === 'MLA'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              MLA 9th
            </button>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          {activeProject.sources.length} Indexed Sources
        </div>
      </div>

      {/* Sources Citation List */}
      <div className="space-y-4">
        {activeProject.sources.length === 0 ? (
          <div className="border border-slate-800 rounded-lg bg-slate-900/60 p-8 text-center text-slate-400 text-xs">
            No sources in current project. Add sources in the Sources tab to generate references.
          </div>
        ) : (
          activeProject.sources.map((source, idx) => {
            const formatted = formatCitation(source, activeStyle, idx + 1);
            const bibtex = generateBibtex(source, idx + 1);
            const isCopied = copiedId === source.id;
            const isBibCopied = bibtexCopiedId === source.id;

            return (
              <div
                key={source.id}
                className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-cyan-400 font-semibold text-[11px]">
                      Ref [{idx + 1}]
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="font-mono text-[11px] text-slate-400">
                      {source.sourceType}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(formatted, source.id)}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded transition-colors flex items-center gap-1.5"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied Citation</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Citation</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleCopyBibtex(bibtex, source.id)}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded transition-colors flex items-center gap-1.5"
                    >
                      {isBibCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied BibTeX</span>
                        </>
                      ) : (
                        <>
                          <Code className="w-3.5 h-3.5 text-cyan-400" />
                          <span>BibTeX</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Formatted Citation Block */}
                <div className="p-3 bg-slate-950 rounded border border-slate-800/80">
                  <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">
                    {activeStyle} Formatted Reference
                  </div>
                  <p className="text-xs text-slate-200 font-sans leading-relaxed select-all">
                    {formatted}
                  </p>
                </div>

                {/* BibTeX Code Snippet */}
                <details className="text-xs text-slate-400">
                  <summary className="cursor-pointer hover:text-slate-200 text-[11px] font-mono">
                    View BibTeX Entry
                  </summary>
                  <pre className="mt-2 p-3 bg-slate-950 rounded border border-slate-800/60 font-mono text-[11px] text-cyan-300 overflow-x-auto">
                    {bibtex}
                  </pre>
                </details>
              </div>
            );
          })
        )}
      </div>

      {/* Metadata Integrity Guarantee */}
      <div className="border border-slate-800/80 bg-slate-950/60 rounded-lg p-4 text-xs text-slate-400 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="text-slate-200 font-medium">
            Anti-Hallucination Bibliographic Policy
          </strong>
          <p className="leading-relaxed">
            If an author, publication year, journal, or DOI was omitted during source collection, ResearchFlow AI explicitly preserves the missing field as "Metadata unavailable". The system strictly prohibits synthetic fabrication of citation identifiers.
          </p>
        </div>
      </div>
    </div>
  );
};
