import React from 'react';
import { useResearch } from '../context/ResearchContext.tsx';
import {
  AlertTriangle,
  Settings,
  Plus,
  Zap,
  CheckCircle2,
  XCircle,
  Menu,
  ShieldCheck,
  Server
} from 'lucide-react';

interface HeaderProps {
  onOpenNewProject: () => void;
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewProject, onToggleMobileSidebar }) => {
  const {
    activeProject,
    activeProvider,
    setActiveProvider,
    activeModel,
    providerStatuses,
    setActiveView,
    lastFallbackNotification,
    clearFallbackNotification,
    errorMessage,
    clearError
  } = useResearch();

  const currentProviderStatus = providerStatuses.find((p) => p.id === activeProvider);
  const isConfigured = currentProviderStatus?.configured;

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
      {/* Top Bar: Exactly 3 Zones adhering to Frontend Design Constitution */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden text-slate-400 hover:text-white p-1"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <a
            href="#dashboard"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('dashboard');
            }}
            className="text-base font-semibold tracking-tight text-white flex items-center gap-2 hover:text-cyan-400 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            ResearchFlow AI
          </a>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-400">
          <button
            onClick={() => setActiveView('dashboard')}
            className="hover:text-slate-100 transition-colors whitespace-nowrap"
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('sources')}
            className="hover:text-slate-100 transition-colors whitespace-nowrap"
          >
            Sources
          </button>
          <button
            onClick={() => setActiveView('chat')}
            className="hover:text-slate-100 transition-colors whitespace-nowrap"
          >
            Research Chat
          </button>
          <button
            onClick={() => setActiveView('evidence')}
            className="hover:text-slate-100 transition-colors whitespace-nowrap"
          >
            Evidence Engine
          </button>
          <button
            onClick={() => setActiveView('comparisons')}
            className="hover:text-slate-100 transition-colors whitespace-nowrap"
          >
            Comparisons
          </button>
          <button
            onClick={() => setActiveView('reports')}
            className="hover:text-slate-100 transition-colors whitespace-nowrap"
          >
            Reports
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions & provider status */}
        <div className="flex items-center gap-3">
          {/* Active Provider Pill / Indicator */}
          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-md px-2.5 py-1 text-xs">
            <span className="text-slate-400 hidden sm:inline">AI Provider:</span>
            <select
              value={activeProvider}
              onChange={(e) => setActiveProvider(e.target.value as 'grok' | 'groq')}
              className="bg-transparent text-cyan-300 font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="grok" className="bg-slate-900 text-slate-200">
                Grok (xAI)
              </option>
              <option value="groq" className="bg-slate-900 text-slate-200">
                Groq Cloud
              </option>
            </select>
            <span className="text-slate-600 hidden sm:inline">·</span>
            <span className="font-mono text-[11px] text-slate-300 hidden md:inline">
              {activeModel}
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isConfigured ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
              title={isConfigured ? 'API Key Configured' : 'Running in Simulated Mode'}
            />
          </div>

          <button
            onClick={onOpenNewProject}
            className="inline-flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shadow-sm shadow-cyan-950"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Research</span>
            <span className="sm:hidden">New</span>
          </button>

          <button
            onClick={() => setActiveView('settings')}
            className="text-slate-400 hover:text-white p-1.5 rounded-md hover:bg-slate-800 transition-colors"
            title="Settings & AI Providers"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Fallback Notice Banner */}
      {lastFallbackNotification && (
        <div className="bg-amber-950/70 border-t border-amber-800/60 px-4 py-1.5 text-xs text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{lastFallbackNotification}</span>
            <button
              onClick={clearFallbackNotification}
              className="ml-auto text-amber-400 hover:text-amber-100 text-[11px] underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Error Message Banner */}
      {errorMessage && (
        <div className="bg-rose-950/70 border-t border-rose-800/60 px-4 py-1.5 text-xs text-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">{errorMessage}</span>
            <button
              onClick={clearError}
              className="ml-auto text-rose-400 hover:text-rose-100 text-[11px] underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
