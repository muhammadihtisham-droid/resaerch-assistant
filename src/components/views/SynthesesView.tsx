import React, { useState } from 'react';
import { useResearch } from '../../context/ResearchContext.tsx';
import { ResearchSynthesis } from '../../types/research.ts';
import {
  GitMerge,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Compass,
  FileCheck2,
  Scale,
  RefreshCw,
  Quote
} from 'lucide-react';

export const SynthesesView: React.FC = () => {
  const {
    activeProject,
    generateSynthesis,
    isAILoading,
    activeProvider,
    activeModel
  } = useResearch();

  const [activeSynthesisId, setActiveSynthesisId] = useState<string | null>(null);

  if (!activeProject) {
    return <div className="text-center py-16 text-slate-400">No active project selected.</div>;
  }

  const syntheses = activeProject.syntheses;
  const currentSynthesis: ResearchSynthesis | undefined = activeSynthesisId
    ? syntheses.find((s) => s.id === activeSynthesisId)
    : syntheses[0];

  const handleRunSynthesis = async () => {
    const syn = await generateSynthesis();
    setActiveSynthesisId(syn.id);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
            Phase 05 · Corpus Integration
          </div>
          <h1 className="text-xl font-semibold text-white mt-0.5">
            Cross-Literature Research Synthesis
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            "What does the collected literature collectively indicate?" Strictly bounded to verified findings and conflicting evidence.
          </p>
        </div>

        <button
          onClick={handleRunSynthesis}
          disabled={isAILoading || activeProject.sources.length === 0}
          className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-medium px-4 py-2 rounded-md transition-colors shadow-sm self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{currentSynthesis ? 'Synthesize Updated Corpus' : 'Generate Collective Synthesis'}</span>
        </button>
      </div>

      {/* Synthesis selector if multiple */}
      {syntheses.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 text-[11px] shrink-0 font-mono">
            Syntheses:
          </span>
          {syntheses.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActiveSynthesisId(s.id)}
              className={`px-3 py-1 rounded text-xs whitespace-nowrap border transition-colors ${
                currentSynthesis?.id === s.id
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              Synthesis #{idx + 1}
            </button>
          ))}
        </div>
      )}

      {!currentSynthesis ? (
        <div className="border border-slate-800 rounded-lg bg-slate-900/60 p-8 text-center text-slate-400 text-xs space-y-3">
          <GitMerge className="w-8 h-8 text-cyan-500/80 mx-auto" />
          <p className="max-w-md mx-auto">
            No research synthesis has been conducted for this project yet. Click "Generate Collective Synthesis" to combine your {activeProject.sources.length} sources and {activeProject.evidence.length} evidence records.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Title banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
              Collective Finding Statement
            </div>
            <h2 className="text-base font-semibold text-white">
              {currentSynthesis.title}
            </h2>
            <div className="mt-2 text-[11px] text-slate-400 font-mono">
              Synthesized by: {currentSynthesis.providerUsed} · {new Date(currentSynthesis.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* 1. Evidence-Supported Collective Findings */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
            <div className="text-xs font-mono uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Evidence-Supported Findings (Strictly Grounded)</span>
            </div>

            <div className="space-y-2.5">
              {currentSynthesis.evidenceSupportedFindings.map((f, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-950/60 rounded border border-slate-800/80 space-y-1.5"
                >
                  <p className="text-xs text-slate-100 font-medium leading-relaxed">
                    {f.finding}
                  </p>
                  <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-2">
                    <span>Citation: {f.sourceCitations}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Scholarly Interpretation */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-2">
            <div className="text-xs font-mono uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Collective AI Scholarly Interpretation</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {currentSynthesis.interpretation}
            </p>
          </div>

          {/* 3. Conflicting Evidence & Unresolved Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Conflicting Evidence */}
            <div className="bg-slate-900 border border-rose-900/40 rounded-lg p-5 space-y-3">
              <div className="text-xs font-mono uppercase text-rose-400 tracking-wider flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-rose-400" />
                <span>Conflicting Evidence & Disagreements</span>
              </div>

              {currentSynthesis.conflictingEvidence.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  No active empirical contradictions detected across current sources.
                </p>
              ) : (
                currentSynthesis.conflictingEvidence.map((conf, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/80 rounded border border-rose-950/80 space-y-2 text-xs">
                    <div className="font-semibold text-rose-200">{conf.topic}</div>
                    <div className="space-y-1.5 pl-2 border-l border-rose-800/60">
                      <div>
                        <span className="font-mono text-[10px] text-slate-400 block">{conf.sourceA}:</span>
                        <span className="text-slate-300">{conf.stanceA}</span>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-slate-400 block">{conf.sourceB}:</span>
                        <span className="text-slate-300">{conf.stanceB}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Unresolved Questions */}
            <div className="bg-slate-900 border border-amber-900/40 rounded-lg p-5 space-y-3">
              <div className="text-xs font-mono uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Unresolved Scientific Questions</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                {currentSynthesis.unresolvedQuestions.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-mono text-[11px] shrink-0 mt-0.5">?</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Potential Research Directions */}
          {currentSynthesis.potentialResearchDirections.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-2.5">
              <div className="text-xs font-mono uppercase text-purple-400 tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-purple-400" />
                <span>Promising Empirical Research Avenues</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {currentSynthesis.potentialResearchDirections.map((dir, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400 font-mono text-[11px] shrink-0 mt-0.5">→</span>
                    <span>{dir}</span>
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
