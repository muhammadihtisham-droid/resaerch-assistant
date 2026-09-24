import React, { useState } from 'react';
import { useResearch } from '../../context/ResearchContext.tsx';
import { ResearchGapAnalysis, GapCategory } from '../../types/research.ts';
import {
  SearchCode,
  Sparkles,
  AlertTriangle,
  Layers,
  ArrowRight,
  Database,
  Cpu,
  FlaskConical,
  Scale,
  Factory,
  Sliders,
  Filter
} from 'lucide-react';

const GAP_CATEGORIES: { id: GapCategory; label: string; icon: React.ElementType }[] = [
  { id: 'insufficient_datasets', label: 'Insufficient Datasets', icon: Database },
  { id: 'limited_experimental_validation', label: 'Limited Lab Validation', icon: FlaskConical },
  { id: 'lack_of_industrial_validation', label: 'Lack of Industrial Validation', icon: Factory },
  { id: 'limited_operating_conditions', label: 'Limited Operating Conditions', icon: Sliders },
  { id: 'limited_algorithm_comparisons', label: 'Limited Algorithm Comparisons', icon: Cpu },
  { id: 'missing_variables', label: 'Missing Variables / Parameters', icon: Layers },
  { id: 'unresolved_disagreements', label: 'Unresolved Disagreements', icon: Scale },
  { id: 'unexplored_applications', label: 'Unexplored Applications', icon: ArrowRight }
];

export const GapsView: React.FC = () => {
  const {
    activeProject,
    analyzeResearchGaps,
    isAILoading,
    activeProvider
  } = useResearch();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!activeProject) {
    return <div className="text-center py-16 text-slate-400">No active project selected.</div>;
  }

  const gaps = activeProject.gaps;

  const filteredGaps = gaps.filter((g) => {
    if (selectedCategory === 'All') return true;
    return g.category === selectedCategory;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
            Phase 06 · Scholarly Horizon
          </div>
          <h1 className="text-xl font-semibold text-white mt-0.5">
            Potential Research Gaps
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Systematic identification of unvalidated regimes, dataset shortages, and empirical bounds across 8 scholarly dimensions.
          </p>
        </div>

        <button
          onClick={analyzeResearchGaps}
          disabled={isAILoading || activeProject.sources.length === 0}
          className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-medium px-4 py-2 rounded-md transition-colors shadow-sm self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Identify Potential Gaps</span>
        </button>
      </div>

      {/* Mandatory Scholarly Label */}
      <div className="bg-amber-950/40 border border-amber-800/50 rounded-lg p-3 text-xs text-amber-200/90 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-mono uppercase tracking-wider text-[11px] block">
            Academic Guardrail: Potential Research Gaps (Tentative Evaluation)
          </strong>
          <span>
            These findings represent <em>potential</em> research gaps based on the corpus of {activeProject.sources.length} sources currently indexed. Under academic integrity guidelines, they are not asserted as absolute universal absences in the broader global literature.
          </span>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap gap-1.5 pb-1">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-2.5 py-1 rounded text-xs transition-colors ${
            selectedCategory === 'All'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
        >
          All Dimensions ({gaps.length})
        </button>
        {GAP_CATEGORIES.map((cat) => {
          const count = gaps.filter((g) => g.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <span>{cat.label}</span>
              {count > 0 && (
                <span className="font-mono text-[10px] bg-slate-800 px-1 rounded">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Gaps List */}
      <div className="space-y-4">
        {filteredGaps.length === 0 ? (
          <div className="border border-slate-800 rounded-lg bg-slate-900/60 p-8 text-center text-slate-400 text-xs space-y-3">
            <SearchCode className="w-8 h-8 text-amber-500/80 mx-auto" />
            <p className="max-w-md mx-auto">
              No potential research gaps recorded in this category. Click "Identify Potential Gaps" above to run systematic gap analysis with {activeProvider.toUpperCase()}.
            </p>
          </div>
        ) : (
          filteredGaps.map((gap) => (
            <div
              key={gap.id}
              className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-amber-400 uppercase tracking-wider text-[11px]">
                    {gap.categoryLabel}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60">
                    Impact: {gap.impactAssessment}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  {gap.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {gap.description}
                </p>
              </div>

              {/* Supporting Excerpt & Investigation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-950 p-3 rounded border border-slate-800/80">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Supporting Literature Evidence
                  </div>
                  <p className="text-xs text-slate-300 font-serif italic leading-relaxed">
                    "{gap.supportingEvidence}"
                  </p>
                </div>

                <div className="bg-cyan-950/20 p-3 rounded border border-cyan-900/40">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
                    Suggested Empirical Investigation
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {gap.suggestedInvestigation}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
