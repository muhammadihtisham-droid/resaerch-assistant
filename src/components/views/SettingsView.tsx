import React, { useState } from 'react';
import { useResearch } from '../../context/ResearchContext.tsx';
import { AIProviderId, CitationStyle } from '../../types/research.ts';
import {
  Settings2,
  Cpu,
  Zap,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Key,
  Server,
  Layers,
  Lock
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    providerStatuses,
    refreshProviderStatuses,
    testProviderConnection,
    activeProvider,
    setActiveProvider
  } = useResearch();

  const [testingId, setTestingId] = useState<AIProviderId | null>(null);
  const [testResult, setTestResult] = useState<{
    id: AIProviderId;
    success: boolean;
    message: string;
    latencyMs: number;
  } | null>(null);

  const grokStatus = providerStatuses.find((p) => p.id === 'grok');
  const groqStatus = providerStatuses.find((p) => p.id === 'groq');

  const handleTest = async (id: AIProviderId) => {
    setTestingId(id);
    setTestResult(null);
    try {
      const res = await testProviderConnection(id);
      setTestResult({
        id,
        success: res.success,
        message: res.message,
        latencyMs: res.latencyMs
      });
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
            System Administration · Engine Protocols
          </div>
          <h1 className="text-xl font-semibold text-white mt-0.5">
            AI Provider & Security Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure Grok (xAI) and Groq Cloud endpoints, failover policies, and citation standards.
          </p>
        </div>

        <button
          onClick={refreshProviderStatuses}
          className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3 py-2 rounded-md transition-colors border border-slate-700 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Refresh Server Status</span>
        </button>
      </div>

      {/* Security Banner (Strict requirement: Never expose keys to client) */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-start gap-3">
        <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <strong className="text-white font-medium block">
            Zero-Client Credential Architecture
          </strong>
          <p className="text-slate-400 leading-relaxed">
            API keys (<code className="text-cyan-300 font-mono">XAI_API_KEY</code> and <code className="text-cyan-300 font-mono">GROQ_API_KEY</code>) are securely managed on the backend server environment and never delivered to the client browser, React components, or GitHub bundles.
          </p>
        </div>
      </div>

      {/* Provider Selector Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>Primary Active AI Provider</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Grok Card */}
          <div
            onClick={() => {
              setActiveProvider('grok');
              updateSettings({ primaryProvider: 'grok' });
            }}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              activeProvider === 'grok'
                ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-950'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white text-xs">Grok / xAI API</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  grokStatus?.configured ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <div>Base URL: <span className="font-mono text-[11px] text-slate-300">https://api.x.ai/v1</span></div>
              <div>Model: <span className="font-mono text-[11px] text-cyan-300">{settings.grokModel}</span></div>
              <div className="pt-1 text-[11px]">
                Status: <strong className={grokStatus?.configured ? 'text-emerald-400' : 'text-amber-400'}>
                  {grokStatus?.configured ? 'Configured in Environment' : 'Key Not Configured (Simulated)'}
                </strong>
              </div>
            </div>
          </div>

          {/* Groq Card */}
          <div
            onClick={() => {
              setActiveProvider('groq');
              updateSettings({ primaryProvider: 'groq' });
            }}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              activeProvider === 'groq'
                ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-950'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white text-xs">Groq Cloud (LPU)</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  groqStatus?.configured ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <div>Base URL: <span className="font-mono text-[11px] text-slate-300">https://api.groq.com/openai/v1</span></div>
              <div>Model: <span className="font-mono text-[11px] text-cyan-300">{settings.groqModel}</span></div>
              <div className="pt-1 text-[11px]">
                Status: <strong className={groqStatus?.configured ? 'text-emerald-400' : 'text-amber-400'}>
                  {groqStatus?.configured ? 'Configured in Environment' : 'Key Not Configured (Simulated)'}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Tests */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleTest('grok')}
            disabled={testingId === 'grok'}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 border border-slate-700"
          >
            {testingId === 'grok' ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span>Test Grok Connectivity</span>
          </button>

          <button
            onClick={() => handleTest('groq')}
            disabled={testingId === 'groq'}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 border border-slate-700"
          >
            {testingId === 'groq' ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span>Test Groq Connectivity</span>
          </button>
        </div>

        {testResult && (
          <div
            className={`p-3 rounded text-xs flex items-center justify-between border ${
              testResult.success
                ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-200'
                : 'bg-amber-950/60 border-amber-800/80 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span>
                <strong>{testResult.id.toUpperCase()}:</strong> {testResult.message}
              </span>
            </div>
            {testResult.latencyMs > 0 && (
              <span className="font-mono text-[11px] opacity-80">
                {testResult.latencyMs}ms
              </span>
            )}
          </div>
        )}
      </div>

      {/* Model Override Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" />
          <span>Configurable Model Identifiers</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Grok Model Identifier (XAI_MODEL)
            </label>
            <input
              type="text"
              value={settings.grokModel}
              onChange={(e) => updateSettings({ grokModel: e.target.value })}
              placeholder="grok-4.6"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">Default: grok-4.6</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Groq Model Identifier (GROQ_MODEL)
            </label>
            <input
              type="text"
              value={settings.groqModel}
              onChange={(e) => updateSettings({ groqModel: e.target.value })}
              placeholder="llama-3.3-70b-versatile"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">Default: llama-3.3-70b-versatile</span>
          </div>
        </div>
      </div>

      {/* Failover Policy Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Automatic Provider Failover</span>
          </h2>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.failoverEnabled}
              onChange={(e) => updateSettings({ failoverEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
          </label>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          If your primary provider encounters a network timeout, rate limit, or service interruption, ResearchFlow AI will automatically route your request to the fallback provider without losing in-flight research state, and present a status banner: <em>"Primary AI provider unavailable. Response generated using fallback provider."</em>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Fallback Provider
            </label>
            <select
              value={settings.fallbackProvider}
              onChange={(e) => updateSettings({ fallbackProvider: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="groq">Groq Cloud (Fallback)</option>
              <option value="grok">Grok / xAI (Fallback)</option>
              <option value="none">Disabled (No Fallback)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Default Citation Standard
            </label>
            <select
              value={settings.citationStyle}
              onChange={(e) => updateSettings({ citationStyle: e.target.value as CitationStyle })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="IEEE">IEEE (Recommended for Engineering)</option>
              <option value="APA">APA 7th Edition</option>
              <option value="MLA">MLA 9th Edition</option>
            </select>
          </div>
        </div>
      </div>

      {/* 13 Scholarly Anti-Hallucination Directives */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Active Scholarly Anti-Hallucination Directives</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
          <div className="p-2 bg-slate-950/60 rounded border border-slate-800/80">
            1. Never fabricate sources or authors.
          </div>
          <div className="p-2 bg-slate-950/60 rounded border border-slate-800/80">
            2. Never fabricate citations or DOIs.
          </div>
          <div className="p-2 bg-slate-950/60 rounded border border-slate-800/80">
            3. Never fabricate experimental results.
          </div>
          <div className="p-2 bg-slate-950/60 rounded border border-slate-800/80">
            4. Never claim web search without real API execution.
          </div>
          <div className="p-2 bg-slate-950/60 rounded border border-slate-800/80">
            5. Never pretend to read unsupplied documents.
          </div>
          <div className="p-2 bg-slate-950/60 rounded border border-slate-800/80">
            6. Explicitly state uncertainty and boundaries.
          </div>
          <div className="p-2 bg-slate-950/60 rounded border border-slate-800/80">
            7. Distinguish source evidence from AI interpretation.
          </div>
          <div className="p-2 bg-slate-950/60 rounded border border-slate-800/80">
            8. Preserve explicit scientific disagreements.
          </div>
        </div>
      </div>
    </div>
  );
};
