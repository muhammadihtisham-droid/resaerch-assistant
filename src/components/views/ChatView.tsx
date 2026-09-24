import React, { useState } from 'react';
import { useResearch } from '../../context/ResearchContext.tsx';
import { AIProviderId, ChatScope } from '../../types/research.ts';
import {
  MessageSquare,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Filter,
  Layers,
  HelpCircle,
  Quote
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const {
    activeProject,
    sendChatMessage,
    isAILoading,
    activeProvider,
    setActiveProvider,
    activeModel
  } = useResearch();

  const [inputMessage, setInputMessage] = useState('');
  const [chatScope, setChatScope] = useState<ChatScope>('project');
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);

  if (!activeProject) {
    return <div className="text-center py-16 text-slate-400">No active project selected.</div>;
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isAILoading) return;

    const msg = inputMessage.trim();
    setInputMessage('');
    await sendChatMessage(msg, chatScope, selectedSourceIds);
  };

  const handleQuickPrompt = (promptText: string) => {
    setInputMessage(promptText);
  };

  const quickPrompts = [
    'What methodologies were utilized across these empirical sources?',
    'What were the key quantitative findings regarding diagnostic lead times?',
    'What experimental limitations were explicitly stated by the authors?',
    'Compare vibration envelope kurtosis against acoustic emission sensors.',
    'Is there conflicting evidence regarding edge hardware compute latency?'
  ];

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-8rem)] pb-4">
      {/* Header & Controls */}
      <div className="border-b border-slate-800 pb-3 mb-4 space-y-3 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
              Phase 04 · Source-Grounded Inquiry
            </div>
            <h1 className="text-lg font-semibold text-white">Research Chat Assistant</h1>
          </div>

          {/* Provider Selector Right in Chat Header */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-md px-3 py-1.5 text-xs">
            <span className="text-slate-400">AI Provider:</span>
            <select
              value={activeProvider}
              onChange={(e) => setActiveProvider(e.target.value as AIProviderId)}
              className="bg-transparent text-cyan-300 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="grok" className="bg-slate-900 text-slate-200">
                Grok (xAI)
              </option>
              <option value="groq" className="bg-slate-900 text-slate-200">
                Groq Cloud
              </option>
            </select>
            <span className="text-slate-600">·</span>
            <span className="font-mono text-slate-300 text-[11px]">{activeModel}</span>
          </div>
        </div>

        {/* Scope selector */}
        <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-900/60 p-2 rounded-md border border-slate-800/80">
          <span className="text-slate-400 font-medium">Inquiry Scope:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setChatScope('project');
                setSelectedSourceIds([]);
              }}
              className={`px-2.5 py-1 rounded transition-colors ${
                chatScope === 'project'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Entire Project ({activeProject.sources.length} sources)
            </button>

            <button
              onClick={() => setChatScope('selected')}
              className={`px-2.5 py-1 rounded transition-colors ${
                chatScope === 'selected'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Selected Subset ({selectedSourceIds.length})
            </button>
          </div>

          {chatScope === 'selected' && (
            <div className="flex flex-wrap gap-1.5 ml-2">
              {activeProject.sources.map((s) => {
                const isSelected = selectedSourceIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedSourceIds(selectedSourceIds.filter((id) => id !== s.id));
                      } else {
                        setSelectedSourceIds([...selectedSourceIds, s.id]);
                      }
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded border truncate max-w-[160px] ${
                      isSelected
                        ? 'bg-cyan-900/80 text-cyan-200 border-cyan-600'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {s.title}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Messages stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
        {activeProject.chatHistory.length === 0 ? (
          <div className="py-12 text-center max-w-lg mx-auto space-y-4">
            <MessageSquare className="w-10 h-10 text-cyan-500/80 mx-auto" />
            <h3 className="text-base font-semibold text-white">
              Grounded Research Assistant Ready
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask questions directly grounded in your verified research repository. Every response is partitioned into Answer, Verified Source Evidence, Citation List, AI Interpretation, and Declared Uncertainty.
            </p>

            <div className="text-left pt-2 space-y-1.5">
              <div className="text-[11px] font-mono uppercase text-slate-400 mb-1">
                Suggested Inquiries:
              </div>
              {quickPrompts.slice(0, 3).map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="w-full text-left text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 p-2 rounded transition-colors"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          activeProject.chatHistory.map((msg) => {
            const isUser = msg.role === 'user';
            const answer = msg.structuredAnswer;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs ${
                  isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-md bg-cyan-950 border border-cyan-800/80 flex items-center justify-center shrink-0 text-cyan-400 font-mono text-[11px]">
                    RF
                  </div>
                )}

                <div
                  className={`max-w-3xl rounded-lg p-4 space-y-3 leading-relaxed ${
                    isUser
                      ? 'bg-cyan-900/60 text-cyan-100 border border-cyan-700/60'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 shadow-sm'
                  }`}
                >
                  {isUser ? (
                    <p className="font-sans whitespace-pre-wrap">{msg.content}</p>
                  ) : answer ? (
                    <div className="space-y-3">
                      {/* 1. Answer */}
                      <div>
                        <div className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider mb-1">
                          Direct Answer
                        </div>
                        <p className="text-slate-100 font-medium leading-relaxed font-sans">
                          {answer.answer}
                        </p>
                      </div>

                      {/* 2. Source Evidence */}
                      {answer.evidence && answer.evidence.length > 0 && (
                        <div className="bg-slate-950/60 p-3 rounded border border-slate-800/80">
                          <div className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <Quote className="w-3 h-3 text-emerald-400" />
                            <span>Source Evidence (Direct Excerpt)</span>
                          </div>
                          <ul className="space-y-1.5">
                            {answer.evidence.map((ev, idx) => (
                              <li
                                key={idx}
                                className="italic font-serif text-slate-300 pl-2.5 border-l border-emerald-500/60"
                              >
                                {ev}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* 3. Sources Cited */}
                      {answer.sources && answer.sources.length > 0 && (
                        <div>
                          <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                            Sources Consulted
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {answer.sources.map((src, idx) => (
                              <span
                                key={idx}
                                className="bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px]"
                              >
                                {src}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 4. AI Interpretation */}
                      {answer.interpretation && (
                        <div className="bg-cyan-950/20 p-2.5 rounded border border-cyan-900/40">
                          <div className="font-mono text-[10px] text-cyan-300 uppercase tracking-wider mb-0.5">
                            AI Interpretation
                          </div>
                          <p className="text-slate-300 leading-relaxed">
                            {answer.interpretation}
                          </p>
                        </div>
                      )}

                      {/* 5. Uncertainty Declaration */}
                      {answer.uncertainty && (
                        <div className="bg-amber-950/20 p-2.5 rounded border border-amber-900/40">
                          <div className="font-mono text-[10px] text-amber-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-400" />
                            <span>Uncertainty & Evidence Boundary</span>
                          </div>
                          <p className="text-amber-200/90 leading-relaxed text-[11px]">
                            {answer.uncertainty}
                          </p>
                        </div>
                      )}

                      {/* Model & Provider meta */}
                      <div className="text-[10px] font-mono text-slate-500 pt-1 flex items-center gap-2">
                        <span>Engine: {msg.providerUsed || activeProvider}</span>
                        <span>·</span>
                        <span>Model: {msg.modelUsed || activeModel}</span>
                        {msg.fallbackUsed && (
                          <span className="text-amber-400">(Fallback engaged)</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-md bg-slate-800 flex items-center justify-center shrink-0 text-slate-300 font-mono text-[11px]">
                    YOU
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 shrink-0">
        <div className="relative">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isAILoading}
            placeholder="Ask a grounded empirical research question..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-4 pr-24 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isAILoading}
            className="absolute right-2 top-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
          >
            {isAILoading ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Query</span>
          </button>
        </div>
      </form>
    </div>
  );
};
