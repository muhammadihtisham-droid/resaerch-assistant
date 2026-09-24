import React, { useState } from 'react';
import { useResearch } from '../../context/ResearchContext.tsx';
import { EvidenceRecord, EvidenceType, ConfidenceLevel } from '../../types/research.ts';
import {
  FileCheck2,
  Plus,
  Trash2,
  Edit3,
  Quote,
  Sparkles,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  BookOpen
} from 'lucide-react';

const EVIDENCE_TYPES: EvidenceType[] = [
  'Empirical',
  'Statistical',
  'Theoretical',
  'Methodological',
  'Qualitative'
];

const CONFIDENCE_LEVELS: ConfidenceLevel[] = ['High', 'Medium', 'Low'];

export const EvidenceView: React.FC = () => {
  const {
    activeProject,
    addEvidenceRecord,
    updateEvidenceRecord,
    deleteEvidenceRecord
  } = useResearch();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<EvidenceRecord | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [confidenceFilter, setConfidenceFilter] = useState<string>('All');

  // Form states
  const [claim, setClaim] = useState('');
  const [sourceEvidence, setSourceEvidence] = useState('');
  const [location, setLocation] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [evidenceType, setEvidenceType] = useState<EvidenceType>('Empirical');
  const [confidence, setConfidence] = useState<ConfidenceLevel>('High');
  const [aiInterpretation, setAiInterpretation] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [userNotes, setUserNotes] = useState('');

  if (!activeProject) {
    return <div className="text-center py-16 text-slate-400">No active project selected.</div>;
  }

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claim.trim() || !sourceEvidence.trim()) return;

    const sourceObj = activeProject.sources.find((s) => s.id === sourceId);

    if (editingRecord) {
      updateEvidenceRecord({
        ...editingRecord,
        claim: claim.trim(),
        sourceEvidence: sourceEvidence.trim(),
        location: location.trim() || 'Unspecified Location',
        sourceId: sourceId || editingRecord.sourceId,
        sourceTitle: sourceObj ? sourceObj.title : editingRecord.sourceTitle,
        evidenceType,
        confidence,
        aiInterpretation,
        aiSuggestion,
        userNotes
      });
      setEditingRecord(null);
    } else {
      addEvidenceRecord({
        claim: claim.trim(),
        sourceEvidence: sourceEvidence.trim(),
        location: location.trim() || 'Unspecified Location',
        sourceId: sourceId || activeProject.sources[0]?.id || '',
        sourceTitle: sourceObj ? sourceObj.title : activeProject.sources[0]?.title || 'Manual Entry',
        evidenceType,
        confidence,
        aiInterpretation,
        aiSuggestion,
        userNotes
      });
    }

    setIsAddModalOpen(false);
    resetForm();
  };

  const startEdit = (rec: EvidenceRecord) => {
    setEditingRecord(rec);
    setClaim(rec.claim);
    setSourceEvidence(rec.sourceEvidence);
    setLocation(rec.location);
    setSourceId(rec.sourceId);
    setEvidenceType(rec.evidenceType);
    setConfidence(rec.confidence);
    setAiInterpretation(rec.aiInterpretation);
    setAiSuggestion(rec.aiSuggestion);
    setUserNotes(rec.userNotes);
    setIsAddModalOpen(true);
  };

  const resetForm = () => {
    setClaim('');
    setSourceEvidence('');
    setLocation('');
    setSourceId(activeProject.sources[0]?.id || '');
    setEvidenceType('Empirical');
    setConfidence('High');
    setAiInterpretation('');
    setAiSuggestion('');
    setUserNotes('');
    setEditingRecord(null);
  };

  const filteredEvidence = activeProject.evidence.filter((rec) => {
    const matchesSearch =
      rec.claim.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rec.sourceEvidence.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rec.sourceTitle.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesType = typeFilter === 'All' || rec.evidenceType === typeFilter;
    const matchesConf = confidenceFilter === 'All' || rec.confidence === confidenceFilter;

    return matchesSearch && matchesType && matchesConf;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
            Phase 03 · Verifiable Facts & Hypotheses
          </div>
          <h1 className="text-xl font-semibold text-white mt-0.5">
            Structured Evidence Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Empirical claims partitioned strictly between Source Evidence, AI Interpretation, and AI Suggestions.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium px-4 py-2 rounded-md transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Evidence Record</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search claims, excerpts, or sources..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-md px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="All">All Types</option>
            {EVIDENCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Confidence:</span>
          <select
            value={confidenceFilter}
            onChange={(e) => setConfidenceFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-md px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="All">All Confidences</option>
            {CONFIDENCE_LEVELS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Evidence Cards List */}
      <div className="space-y-4">
        {filteredEvidence.length === 0 ? (
          <div className="border border-slate-800 rounded-lg bg-slate-900/60 p-8 text-center text-slate-400 text-xs">
            No evidence records found. You can extract evidence automatically from any source in the Sources tab or click "Add Evidence Record" above.
          </div>
        ) : (
          filteredEvidence.map((rec) => (
            <div
              key={rec.id}
              className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3.5 shadow-sm"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-cyan-400 font-medium">
                    {rec.evidenceType} Evidence
                  </span>
                  <span className="text-slate-600">·</span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      rec.confidence === 'High'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : rec.confidence === 'Medium'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                        : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                    }`}
                  >
                    Confidence: {rec.confidence}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400 truncate max-w-xs">
                    Source: <strong className="text-slate-200">{rec.sourceTitle}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-500">
                    Loc: {rec.location}
                  </span>
                  <button
                    onClick={() => startEdit(rec)}
                    className="text-slate-400 hover:text-white p-1"
                    title="Edit Record"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteEvidenceRecord(rec.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Delete Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Empirical Claim */}
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider mb-1">
                  Empirical or Theoretical Claim
                </div>
                <h3 className="text-sm font-semibold text-white leading-snug">
                  {rec.claim}
                </h3>
              </div>

              {/* Strict Tripartite Bifurcation (Source Evidence vs AI Interpretation vs AI Suggestion) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {/* 1. SOURCE EVIDENCE (Exact Quotation/Facts) */}
                <div className="bg-slate-950 border border-emerald-900/40 rounded-md p-3">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 mb-1.5 flex items-center gap-1.5">
                    <Quote className="w-3 h-3 text-emerald-400" />
                    <span>VERIFIED SOURCE EVIDENCE</span>
                  </div>
                  <blockquote className="text-xs text-slate-200 font-serif italic leading-relaxed">
                    "{rec.sourceEvidence}"
                  </blockquote>
                </div>

                {/* 2. AI INTERPRETATION */}
                <div className="bg-cyan-950/20 border border-cyan-900/40 rounded-md p-3">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>AI INTERPRETATION</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {rec.aiInterpretation || 'No interpretation recorded.'}
                  </p>
                </div>

                {/* 3. AI SUGGESTION */}
                <div className="bg-purple-950/20 border border-purple-900/40 rounded-md p-3">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-purple-400 mb-1.5 flex items-center gap-1.5">
                    <Lightbulb className="w-3 h-3 text-purple-400" />
                    <span>AI SUGGESTED NEXT STEP</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {rec.aiSuggestion || 'No suggestion recorded.'}
                  </p>
                </div>
              </div>

              {/* User Notes */}
              {rec.userNotes && (
                <div className="pt-2 text-xs text-slate-400 flex items-start gap-2">
                  <span className="font-mono text-cyan-400 text-[10px] uppercase">
                    Researcher Notes:
                  </span>
                  <span>{rec.userNotes}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Record Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-xl w-full p-6 shadow-2xl relative my-8">
            <h2 className="text-lg font-semibold text-white mb-1">
              {editingRecord ? 'Edit Evidence Record' : 'Add Structured Evidence Record'}
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Ground your evidence with explicit source quotes, location identifiers, and confidence tags.
            </p>

            <form onSubmit={handleSaveRecord} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Empirical Claim <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={claim}
                  onChange={(e) => setClaim(e.target.value)}
                  placeholder="e.g. Spectral envelope kurtosis anticipates degradation earlier than RMS."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-emerald-400 mb-1 flex items-center gap-1.5">
                  <Quote className="w-3 h-3" />
                  <span>Verbatim Source Evidence / Excerpt *</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={sourceEvidence}
                  onChange={(e) => setSourceEvidence(e.target.value)}
                  placeholder="Paste direct quote or exact experimental data points..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-serif italic"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Source Document
                  </label>
                  <select
                    value={sourceId}
                    onChange={(e) => setSourceId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 truncate"
                  >
                    {activeProject.sources.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Source Location (Section / Page / Table)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Section 4.2, Table 3, p. 142"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Evidence Type
                  </label>
                  <select
                    value={evidenceType}
                    onChange={(e) => setEvidenceType(e.target.value as EvidenceType)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {EVIDENCE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Confidence Level
                  </label>
                  <select
                    value={confidence}
                    onChange={(e) => setConfidence(e.target.value as ConfidenceLevel)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {CONFIDENCE_LEVELS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-cyan-400 mb-1">
                  AI Interpretation
                </label>
                <textarea
                  rows={2}
                  value={aiInterpretation}
                  onChange={(e) => setAiInterpretation(e.target.value)}
                  placeholder="Objective academic interpretation of what this finding implies..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-purple-400 mb-1">
                  AI Suggested Next Step / Action
                </label>
                <textarea
                  rows={2}
                  value={aiSuggestion}
                  onChange={(e) => setAiSuggestion(e.target.value)}
                  placeholder="Recommended empirical validation or parameter study..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Researcher Notes
                </label>
                <input
                  type="text"
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="Your personal hypothesis or experiment note..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!claim.trim() || !sourceEvidence.trim()}
                  className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-medium px-4 py-2 rounded-md transition-colors"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
