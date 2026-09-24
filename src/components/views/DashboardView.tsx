import React from 'react';
import { useResearch } from '../../context/ResearchContext.tsx';
import {
  Compass,
  BookOpen,
  MessageSquare,
  FileCheck2,
  Columns3,
  GitMerge,
  SearchCode,
  FileText,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Layers,
  Cpu
} from 'lucide-react';

interface DashboardViewProps {
  onOpenNewProject: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenNewProject }) => {
  const {
    activeProject,
    setActiveView,
    loadDemoProject,
    activeProvider,
    activeModel,
    providerStatuses
  } = useResearch();

  const currentProviderStatus = providerStatuses.find((p) => p.id === activeProvider);

  const heroImage = '/src/assets/images/hero_research_workspace_1790223199471.jpg';
  const spectrogramImage = '/src/assets/images/demo_machinery_spectrogram_1790223213218.jpg';

  const sourceCount = activeProject?.sources.length || 0;
  const analyzedSourcesCount = activeProject?.sources.filter((s) => s.status === 'Analyzed').length || 0;
  const evidenceCount = activeProject?.evidence.length || 0;
  const notesCount = activeProject?.notes.length || 0;
  const gapsCount = activeProject?.gaps.length || 0;
  const reportsCount = activeProject?.reports.length || 0;

  const workflowSteps = [
    {
      id: 'planner',
      title: '01. Research Plan',
      desc: 'Formulate objectives, subquestions, variables & keywords',
      status: activeProject?.plan ? 'Synthesized' : 'Pending',
      ready: Boolean(activeProject?.plan)
    },
    {
      id: 'sources',
      title: '02. Sources & Analysis',
      desc: 'Ingest papers, extract methodologies & empirical data',
      status: `${analyzedSourcesCount}/${sourceCount} Analyzed`,
      ready: sourceCount > 0
    },
    {
      id: 'evidence',
      title: '03. Evidence Engine',
      desc: 'Discrete claims, verbatim quotes & AI interpretations',
      status: `${evidenceCount} Records`,
      ready: evidenceCount > 0
    },
    {
      id: 'comparisons',
      title: '04. Source Comparison',
      desc: 'Matrix comparison of algorithms, datasets & agreements',
      status: `${activeProject?.comparisons.length || 0} Matrices`,
      ready: (activeProject?.comparisons.length || 0) > 0
    },
    {
      id: 'syntheses',
      title: '05. Synthesis',
      desc: 'Literature-level synthesis & conflicting evidence',
      status: `${activeProject?.syntheses.length || 0} Synthesized`,
      ready: (activeProject?.syntheses.length || 0) > 0
    },
    {
      id: 'gaps',
      title: '06. Potential Gaps',
      desc: 'Identify unvalidated regimes & data bottlenecks',
      status: `${gapsCount} Gaps`,
      ready: gapsCount > 0
    },
    {
      id: 'reports',
      title: '07. Academic Report',
      desc: 'Generate IEEE / APA formatted technical report',
      status: `${reportsCount} Generated`,
      ready: reportsCount > 0
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Hero Section */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900/90 shadow-xl">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src={heroImage}
            alt="ResearchFlow AI Scientific Telemetry Workspace"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="text-xs font-mono tracking-wider uppercase text-cyan-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Scholarly Research Intelligence Platform
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span>Active Engine:</span>
              <span className="text-cyan-300 font-medium">{activeProvider.toUpperCase()}</span>
              <span>·</span>
              <span className="text-slate-300">{activeModel}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-2 text-balance">
            What are you researching?
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed mb-6">
            Execute a systematic academic and technical research pipeline. From empirical question formulation, source analysis, and evidence extraction to cross-literature synthesis and IEEE publication reports.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenNewProject}
              className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium px-4 py-2.5 rounded-md transition-colors shadow-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Start New Research Project
            </button>
            <button
              onClick={loadDemoProject}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-4 py-2.5 rounded-md border border-slate-700 transition-colors flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              Explore Reference Benchmark Project
            </button>
          </div>
        </div>
      </div>

      {/* Active Project Highlight Banner */}
      {activeProject && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-mono text-cyan-400 uppercase text-[10px]">CURRENT WORKSPACE</span>
                <span>·</span>
                <span>{activeProject.field}</span>
                <span>·</span>
                <span>{activeProject.level}</span>
              </div>
              <h2 className="text-lg font-semibold text-white">{activeProject.title}</h2>
              <p className="text-xs text-slate-400 line-clamp-1 italic">
                "{activeProject.question}"
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveView('chat')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-md border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                Ask Sources
              </button>
              <button
                onClick={() => setActiveView('planner')}
                className="bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 hover:bg-cyan-900 text-xs px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                View Plan
              </button>
            </div>
          </div>

          {/* Metric Numbers (Tabular figures) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 pt-4 border-t border-slate-800/80">
            <div className="p-2.5 bg-slate-950/50 rounded border border-slate-800/60">
              <div className="text-[11px] text-slate-400">Total Sources</div>
              <div className="text-xl font-mono font-semibold text-white tabular-nums mt-0.5">
                {sourceCount}
              </div>
              <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                {analyzedSourcesCount} analyzed
              </div>
            </div>

            <div className="p-2.5 bg-slate-950/50 rounded border border-slate-800/60">
              <div className="text-[11px] text-slate-400">Extracted Evidence</div>
              <div className="text-xl font-mono font-semibold text-white tabular-nums mt-0.5">
                {evidenceCount}
              </div>
              <div className="text-[10px] text-cyan-400 font-mono mt-0.5">Claims & Excerpts</div>
            </div>

            <div className="p-2.5 bg-slate-950/50 rounded border border-slate-800/60">
              <div className="text-[11px] text-slate-400">Potential Gaps</div>
              <div className="text-xl font-mono font-semibold text-white tabular-nums mt-0.5">
                {gapsCount}
              </div>
              <div className="text-[10px] text-amber-400 font-mono mt-0.5">Empirical Limits</div>
            </div>

            <div className="p-2.5 bg-slate-950/50 rounded border border-slate-800/60">
              <div className="text-[11px] text-slate-400">Research Notes</div>
              <div className="text-xl font-mono font-semibold text-white tabular-nums mt-0.5">
                {notesCount}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">Hypotheses & Ideas</div>
            </div>

            <div className="p-2.5 bg-slate-950/50 rounded border border-slate-800/60">
              <div className="text-[11px] text-slate-400">Reports Built</div>
              <div className="text-xl font-mono font-semibold text-white tabular-nums mt-0.5">
                {reportsCount}
              </div>
              <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Publication Ready</div>
            </div>
          </div>
        </div>
      )}

      {/* Structured Pipeline Workflow Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white tracking-tight">
            Research Pipeline Progress
          </h3>
          <span className="text-xs text-slate-400">Click any stage to inspect or execute</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {workflowSteps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveView(step.id as any)}
              className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-700/60 transition-all text-left group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span className="font-mono text-[11px] text-cyan-400">{step.title}</span>
                  <span
                    className={`font-mono text-[10px] ${
                      step.ready ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {step.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">{step.desc}</p>
              </div>

              <div className="flex items-center justify-end text-[11px] text-slate-500 group-hover:text-cyan-400 transition-colors">
                <span className="mr-1">Open Stage</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Empirical Benchmark Showcase Card */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-2.5">
            <div className="text-[11px] font-mono uppercase text-amber-400 tracking-wider">
              Verified Benchmark Investigation
            </div>
            <h3 className="text-base font-semibold text-white">
              Predictive Maintenance of Rotating Machinery
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Examines accelerated run-to-failure bearing tests under 8.5 kN constant vs transient torque loads. Benchmarking temporal convolutional networks (dilated TCN-Attention) against classical spectral envelope kurtosis. Features authentic empirical evidence, cross-source comparison, and load generalization gap analysis.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setActiveView('sources')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
              >
                Inspect 3 Benchmark Sources <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveView('comparisons')}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
              >
                View Comparison Matrix <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="relative rounded-lg overflow-hidden border border-slate-800 aspect-4/3 bg-slate-950">
            <img
              src={spectrogramImage}
              alt="Induction motor bearing vibration spectrogram"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-1 right-1 bg-slate-950/80 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-300">
              0 - 25.6 kHz Spectrum
            </div>
          </div>
        </div>
      </div>

      {/* Scholarly Integrity & Anti-Hallucination Governance */}
      <div className="border border-slate-800/80 bg-slate-950/60 rounded-lg p-4 text-xs text-slate-400">
        <div className="flex items-center gap-2 text-slate-200 font-semibold mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Anti-Hallucination & Scholarly Transparency Policy</span>
        </div>
        <p className="leading-relaxed">
          ResearchFlow AI enforces 13 non-negotiable scholarly directives: no fabricated sources, DOIs, or author affiliations; clear separation between verified source evidence and AI hypotheses; explicit declarations of uncertainty and conflicting evidence; and zero mock telemetry.
        </p>
      </div>
    </div>
  );
};
