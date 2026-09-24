import React, { useState } from 'react';
import { useResearch } from '../../context/ResearchContext.tsx';
import { CitationStyle, ResearchReport } from '../../types/research.ts';
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  Printer,
  ChevronDown,
  Layers,
  BookOpen,
  FileCheck2,
  StickyNote,
  Quote,
  ShieldCheck
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    activeProject,
    generateReport,
    isAILoading,
    activeProvider,
    activeModel,
    settings
  } = useResearch();

  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>(() => {
    return activeProject ? activeProject.sources.map((s) => s.id) : [];
  });
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>(() => {
    return activeProject ? activeProject.evidence.map((e) => e.id) : [];
  });
  const [citationStyle, setCitationStyle] = useState<CitationStyle>(settings.citationStyle || 'IEEE');
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  if (!activeProject) {
    return <div className="text-center py-16 text-slate-400">No active project selected.</div>;
  }

  const reports = activeProject.reports;
  const currentReport: ResearchReport | undefined = activeReportId
    ? reports.find((r) => r.id === activeReportId)
    : reports[0];

  const handleGenerate = async () => {
    const rep = await generateReport({
      selectedSourceIds,
      selectedEvidenceIds,
      citationStyle
    });
    setActiveReportId(rep.id);
  };

  const handleCopyMarkdown = () => {
    if (!currentReport) return;
    const md = buildMarkdown(currentReport);
    navigator.clipboard.writeText(md);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!currentReport) return;
    const md = buildMarkdown(currentReport);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentReport.title.slice(0, 30).replace(/\s+/g, '_')}_Report.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const buildMarkdown = (rep: ResearchReport): string => {
    const s = rep.sections;
    return `# ${s.title}

## Abstract
${s.abstract}

## 1. Introduction
${s.introduction}

## 2. Background
${s.background}

## 3. Literature Review
${s.literatureReview}

## 4. Methodology
${s.methodology}

## 5. Findings
${s.findings}

## 6. Discussion
${s.discussion}

## 7. Potential Research Gaps
${s.potentialResearchGaps}

## 8. Future Work
${s.futureWork}

## 9. Conclusion
${s.conclusion}

## References (${rep.citationStyle})
${s.references.map((r, i) => `${r}`).join('\n\n')}
`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
            Phase 09 · Publication & Synthesis
          </div>
          <h1 className="text-xl font-semibold text-white mt-0.5">
            Research Report Builder
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate full academic papers with structured sections, empirical findings, and compliant citation formatting.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isAILoading || selectedSourceIds.length === 0}
          className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-medium px-4 py-2 rounded-md transition-colors shadow-sm self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{currentReport ? 'Regenerate Report' : 'Compile Research Report'}</span>
        </button>
      </div>

      {/* Configuration & Selection Drawer */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Citation Style:</span>
            <select
              value={citationStyle}
              onChange={(e) => setCitationStyle(e.target.value as CitationStyle)}
              className="bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-none"
            >
              <option value="IEEE">IEEE (Engineering standard, [1], [2])</option>
              <option value="APA">APA 7th Edition</option>
              <option value="MLA">MLA 9th Edition</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <span>Active Engine:</span>
            <strong className="text-cyan-400 font-semibold">{activeProvider.toUpperCase()}</strong>
            <span>({activeModel})</span>
          </div>
        </div>

        {/* Source & Evidence Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Sources Included */}
          <div>
            <div className="flex items-center justify-between mb-1.5 text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Included Literature Sources ({selectedSourceIds.length})</span>
              </span>
              <button
                onClick={() =>
                  setSelectedSourceIds(
                    selectedSourceIds.length === activeProject.sources.length
                      ? []
                      : activeProject.sources.map((s) => s.id)
                  )
                }
                className="text-[11px] text-cyan-400 hover:underline"
              >
                {selectedSourceIds.length === activeProject.sources.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-1 bg-slate-950 p-2 rounded border border-slate-800 scrollbar-thin">
              {activeProject.sources.map((s) => {
                const isChecked = selectedSourceIds.includes(s.id);
                return (
                  <label key={s.id} className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        setSelectedSourceIds(
                          isChecked
                            ? selectedSourceIds.filter((id) => id !== s.id)
                            : [...selectedSourceIds, s.id]
                        );
                      }}
                      className="rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-0"
                    />
                    <span className="truncate">{s.title}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Evidence Included */}
          <div>
            <div className="flex items-center justify-between mb-1.5 text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Included Evidence Records ({selectedEvidenceIds.length})</span>
              </span>
              <button
                onClick={() =>
                  setSelectedEvidenceIds(
                    selectedEvidenceIds.length === activeProject.evidence.length
                      ? []
                      : activeProject.evidence.map((e) => e.id)
                  )
                }
                className="text-[11px] text-cyan-400 hover:underline"
              >
                {selectedEvidenceIds.length === activeProject.evidence.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-1 bg-slate-950 p-2 rounded border border-slate-800 scrollbar-thin">
              {activeProject.evidence.map((ev) => {
                const isChecked = selectedEvidenceIds.includes(ev.id);
                return (
                  <label key={ev.id} className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        setSelectedEvidenceIds(
                          isChecked
                            ? selectedEvidenceIds.filter((id) => id !== ev.id)
                            : [...selectedEvidenceIds, ev.id]
                        );
                      }}
                      className="rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-0"
                    />
                    <span className="truncate">{ev.claim}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Reports history if multiple */}
      {reports.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 text-[11px] shrink-0 font-mono">
            Generated Reports:
          </span>
          {reports.map((r, idx) => (
            <button
              key={r.id}
              onClick={() => setActiveReportId(r.id)}
              className={`px-3 py-1 rounded text-xs whitespace-nowrap border transition-colors ${
                currentReport?.id === r.id
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              Report #{idx + 1} ({r.citationStyle})
            </button>
          ))}
        </div>
      )}

      {/* Report View Panel */}
      {!currentReport ? (
        <div className="border border-slate-800 rounded-lg bg-slate-900/60 p-8 text-center text-slate-400 text-xs space-y-3">
          <FileText className="w-10 h-10 text-cyan-500/80 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Report Generated Yet</h3>
          <p className="max-w-md mx-auto leading-relaxed">
            Click "Compile Research Report" to generate an empirical, publication-ready research paper integrating your sources, evidence, and research notes.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-xl print:bg-white print:text-black print:border-none print:shadow-none">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 print:hidden">
            <div className="text-xs text-slate-400 font-mono">
              Generated with {currentReport.providerUsed} ({currentReport.modelUsed}) · {new Date(currentReport.generatedAt).toLocaleString()}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyMarkdown}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 border border-slate-700"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Markdown</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadMarkdown}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 border border-slate-700"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Download .md</span>
              </button>

              <button
                onClick={handlePrint}
                className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>

          {/* Academic Report Body */}
          <article className="space-y-6 font-sans text-xs sm:text-sm text-slate-200 print:text-black">
            {/* Title & Metadata */}
            <div className="border-b border-slate-800 print:border-gray-300 pb-5 text-center space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white print:text-black tracking-tight">
                {currentReport.sections.title}
              </h1>
              <div className="text-xs text-slate-400 print:text-gray-600 font-mono">
                Research Workspace: {activeProject.title} · Discipline: {activeProject.field} · Citation Standard: {currentReport.citationStyle}
              </div>
            </div>

            {/* Abstract */}
            <section className="bg-slate-950/60 print:bg-gray-50 border border-slate-800 print:border-gray-200 p-4 rounded-lg space-y-1.5">
              <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-400 print:text-blue-700 font-semibold">
                Abstract
              </h2>
              <p className="leading-relaxed font-serif text-slate-300 print:text-gray-800">
                {currentReport.sections.abstract}
              </p>
            </section>

            {/* Introduction */}
            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white print:text-black border-b border-slate-800/80 pb-1 font-mono uppercase tracking-wide">
                1. Introduction
              </h2>
              <p className="leading-relaxed text-slate-300 print:text-gray-800 whitespace-pre-wrap">
                {currentReport.sections.introduction}
              </p>
            </section>

            {/* Background */}
            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white print:text-black border-b border-slate-800/80 pb-1 font-mono uppercase tracking-wide">
                2. Theoretical & Technical Background
              </h2>
              <p className="leading-relaxed text-slate-300 print:text-gray-800 whitespace-pre-wrap">
                {currentReport.sections.background}
              </p>
            </section>

            {/* Literature Review */}
            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white print:text-black border-b border-slate-800/80 pb-1 font-mono uppercase tracking-wide">
                3. Literature Review
              </h2>
              <p className="leading-relaxed text-slate-300 print:text-gray-800 whitespace-pre-wrap">
                {currentReport.sections.literatureReview}
              </p>
            </section>

            {/* Methodology */}
            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white print:text-black border-b border-slate-800/80 pb-1 font-mono uppercase tracking-wide">
                4. Comparative Methodology & Benchmark Protocols
              </h2>
              <p className="leading-relaxed text-slate-300 print:text-gray-800 whitespace-pre-wrap">
                {currentReport.sections.methodology}
              </p>
            </section>

            {/* Findings */}
            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white print:text-black border-b border-slate-800/80 pb-1 font-mono uppercase tracking-wide">
                5. Empirical Findings
              </h2>
              <p className="leading-relaxed text-slate-300 print:text-gray-800 whitespace-pre-wrap">
                {currentReport.sections.findings}
              </p>
            </section>

            {/* Discussion */}
            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white print:text-black border-b border-slate-800/80 pb-1 font-mono uppercase tracking-wide">
                6. Discussion & Practical Implications
              </h2>
              <p className="leading-relaxed text-slate-300 print:text-gray-800 whitespace-pre-wrap">
                {currentReport.sections.discussion}
              </p>
            </section>

            {/* Potential Research Gaps */}
            <section className="space-y-2">
              <h2 className="text-sm font-bold text-amber-400 print:text-amber-700 border-b border-slate-800/80 pb-1 font-mono uppercase tracking-wide">
                7. Potential Research Gaps
              </h2>
              <p className="leading-relaxed text-slate-300 print:text-gray-800 whitespace-pre-wrap">
                {currentReport.sections.potentialResearchGaps}
              </p>
            </section>

            {/* Future Work */}
            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white print:text-black border-b border-slate-800/80 pb-1 font-mono uppercase tracking-wide">
                8. Future Work
              </h2>
              <p className="leading-relaxed text-slate-300 print:text-gray-800 whitespace-pre-wrap">
                {currentReport.sections.futureWork}
              </p>
            </section>

            {/* Conclusion */}
            <section className="space-y-2">
              <h2 className="text-sm font-bold text-white print:text-black border-b border-slate-800/80 pb-1 font-mono uppercase tracking-wide">
                9. Conclusion
              </h2>
              <p className="leading-relaxed text-slate-300 print:text-gray-800 whitespace-pre-wrap">
                {currentReport.sections.conclusion}
              </p>
            </section>

            {/* References */}
            <section className="space-y-2 pt-4 border-t border-slate-800 print:border-gray-300">
              <h2 className="text-sm font-bold text-white print:text-black font-mono uppercase tracking-wide">
                References ({currentReport.citationStyle})
              </h2>
              <ol className="space-y-2 text-xs text-slate-300 print:text-gray-800 font-sans">
                {currentReport.sections.references.map((ref, i) => (
                  <li key={i} className="pl-2 border-l border-slate-800 print:border-gray-300">
                    {ref}
                  </li>
                ))}
              </ol>
            </section>
          </article>
        </div>
      )}
    </div>
  );
};
