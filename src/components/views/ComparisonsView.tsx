import React, { useState } from 'react';
import { useResearch } from '../../context/ResearchContext.tsx';
import { SourceComparison } from '../../types/research.ts';
import {
  Columns3,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  GitCompare,
  ArrowRight,
  SearchCode,
  Layers,
  FlaskConical,
  Scale
} from 'lucide-react';

export const ComparisonsView: React.FC = () => {
  const {
    activeProject,
    compareSources,
    isAILoading,
    activeProvider,
    activeModel
  } = useResearch();

  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>(() => {
    return activeProject ? activeProject.sources.slice(0, 3).map((s) => s.id) : [];
  });
  const [activeComparisonId, setActiveComparisonId] = useState<string | null>(null);

  if (!activeProject) {
    return <div className="text-center py-16 text-slate-400">No active project selected.</div>;
  }

  const handleToggleSource = (id: string) => {
    if (selectedSourceIds.includes(id)) {
      setSelectedSourceIds(selectedSourceIds.filter((sId) => sId !== id));
    } else {
      setSelectedSourceIds([...selectedSourceIds, id]);
    }
  };

  const handleGenerateComparison = async () => {
    if (selectedSourceIds.length < 2) return;
    const comp = await compareSources(selectedSourceIds);
    setActiveComparisonId(comp.id);
  };

  const comparisons = activeProject.comparisons;
  const currentComparison: SourceComparison | undefined = activeComparisonId
    ? comparisons.find((c) => c.id === activeComparisonId)
    : comparisons[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
            Phase 04 · Multi-Source Triangulation
          </div>
          <h1 className="text-xl font-semibold text-white mt-0.5">
            Source Comparison Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Triangulate algorithms, datasets, operational limits, agreements & explicit scientific disagreements.
          </p>
        </div>

        <button
          onClick={handleGenerateComparison}
          disabled={selectedSourceIds.length < 2 || isAILoading}
          className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-medium px-4 py-2 rounded-md transition-colors shadow-sm self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Compare Selected ({selectedSourceIds.length})</span>
        </button>
      </div>

      {/* Source Selection Checkboxes */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-medium text-slate-300">
            Select 2 or more literature sources to benchmark against each other:
          </span>
          <span className="font-mono text-[11px] text-cyan-400">
            {selectedSourceIds.length} Selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {activeProject.sources.map((s) => {
            const isSelected = selectedSourceIds.includes(s.id);
            return (
              <label
                key={s.id}
                className={`p-2.5 rounded-md border text-xs cursor-pointer transition-colors flex items-start gap-2.5 ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-800 text-cyan-100'
                    : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggleSource(s.id)}
                  className="rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-0 mt-0.5 shrink-0"
                />
                <div className="truncate">
                  <div className="font-medium text-white truncate">{s.title}</div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {(s.authors || []).join(', ') || 'No authors'} · {s.publicationDate}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Comparisons History Bar if multiple exist */}
      {comparisons.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 text-[11px] shrink-0 font-mono">
            Matrices:
          </span>
          {comparisons.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => setActiveComparisonId(c.id)}
              className={`px-3 py-1 rounded text-xs whitespace-nowrap border transition-colors ${
                (currentComparison?.id === c.id)
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              Matrix #{idx + 1} ({c.sourceTitles.length} sources)
            </button>
          ))}
        </div>
      )}

      {/* Comparison Matrix Display */}
      {!currentComparison ? (
        <div className="border border-slate-800 rounded-lg bg-slate-900/60 p-8 text-center text-slate-400 text-xs">
          No comparison matrices generated yet. Select at least 2 sources above and click "Compare Selected".
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header notice */}
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex flex-wrap items-center justify-between text-xs text-slate-400">
            <div>
              Comparing <strong className="text-white">{currentComparison.sourceTitles.length} sources</strong>: {currentComparison.sourceTitles.join(' vs. ')}
            </div>
            <div className="font-mono text-[11px] text-slate-500">
              Evaluated by: {currentComparison.providerUsed} · {new Date(currentComparison.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Triangulation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* 1. Research Objectives */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-1.5">
              <div className="font-mono text-[11px] text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Objective Synthesis</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {currentComparison.objectiveComparison}
              </p>
            </div>

            {/* 2. Methodologies */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-1.5">
              <div className="font-mono text-[11px] text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Methodology Comparison</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {currentComparison.methodologyComparison}
              </p>
            </div>

            {/* 3. Datasets & Testbeds */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-1.5">
              <div className="font-mono text-[11px] text-cyan-400 uppercase tracking-wider">
                Datasets & Experimental Setup
              </div>
              <p className="text-slate-300 leading-relaxed">
                {currentComparison.datasetComparison}
              </p>
            </div>

            {/* 4. Variables & Parameters */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-1.5">
              <div className="font-mono text-[11px] text-cyan-400 uppercase tracking-wider">
                Investigated Variables
              </div>
              <p className="text-slate-300 leading-relaxed">
                {currentComparison.variablesComparison}
              </p>
            </div>

            {/* 5. Algorithms & Architectures */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-1.5">
              <div className="font-mono text-[11px] text-cyan-400 uppercase tracking-wider">
                Algorithms & Signal Pipelines
              </div>
              <p className="text-slate-300 leading-relaxed">
                {currentComparison.algorithmsComparison}
              </p>
            </div>

            {/* 6. Operational Conditions */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-1.5">
              <div className="font-mono text-[11px] text-cyan-400 uppercase tracking-wider">
                Operational & Load Conditions
              </div>
              <p className="text-slate-300 leading-relaxed">
                {currentComparison.conditionsComparison}
              </p>
            </div>

            {/* 7. Results Comparison */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-1.5">
              <div className="font-mono text-[11px] text-cyan-400 uppercase tracking-wider">
                Quantitative Results & Findings
              </div>
              <p className="text-slate-300 leading-relaxed">
                {currentComparison.resultsComparison}
              </p>
            </div>

            {/* 8. Reported Limitations */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-1.5">
              <div className="font-mono text-[11px] text-amber-400 uppercase tracking-wider">
                Comparative Limitations
              </div>
              <p className="text-slate-300 leading-relaxed">
                {currentComparison.limitationsComparison}
              </p>
            </div>
          </div>

          {/* Explicit Consensus vs Disagreement Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Consensus */}
            <div className="bg-slate-900 border border-emerald-900/40 rounded-lg p-5">
              <div className="font-mono text-xs text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Areas of Scientific Consensus</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {currentComparison.areasOfAgreement.map((agr, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-mono text-[11px] shrink-0 mt-0.5">•</span>
                    <span>{agr}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Explicit Disagreements */}
            <div className="bg-slate-900 border border-rose-900/40 rounded-lg p-5">
              <div className="font-mono text-xs text-rose-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-rose-400" />
                <span>Explicit Disagreements & Divergent Stances</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {currentComparison.areasOfDifference.map((diff, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-mono text-[11px] shrink-0 mt-0.5">≠</span>
                    <span>{diff}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-500 italic">
                Anti-hallucination compliance: Divergences are preserved without artificially selecting a preferred stance.
              </div>
            </div>
          </div>

          {/* Potential Gaps from Comparison */}
          {currentComparison.potentialResearchGaps.length > 0 && (
            <div className="bg-slate-900 border border-amber-900/40 rounded-lg p-5">
              <div className="font-mono text-xs text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <SearchCode className="w-4 h-4 text-amber-400" />
                <span>Potential Research Gaps Revealed by Comparative Triangulation</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {currentComparison.potentialResearchGaps.map((gap, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-mono text-[11px] shrink-0 mt-0.5">▲</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
