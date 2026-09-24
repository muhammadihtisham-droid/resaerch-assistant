import React, { useState } from 'react';
import { useResearch } from '../context/ResearchContext.tsx';
import { AcademicField, ResearchLevel } from '../types/research.ts';
import { X, Sparkles, BookOpen, Layers } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACADEMIC_FIELDS: AcademicField[] = [
  'Engineering',
  'Computer Science',
  'Physics',
  'Mathematics',
  'Biology',
  'Business',
  'Social Sciences',
  'Other'
];

const RESEARCH_LEVELS: ResearchLevel[] = [
  'School',
  'Undergraduate',
  'Graduate',
  'Researcher'
];

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const { createProject, activeProvider } = useResearch();

  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [question, setQuestion] = useState('');
  const [objectives, setObjectives] = useState('');
  const [field, setField] = useState<AcademicField>('Engineering');
  const [keywordsInput, setKeywordsInput] = useState('');
  const [level, setLevel] = useState<ResearchLevel>('Researcher');
  const [autoPlan, setAutoPlan] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !question.trim()) return;

    setIsSubmitting(true);
    try {
      const keywords = keywordsInput
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);

      await createProject(
        {
          title: title.trim(),
          topic: topic.trim() || title.trim(),
          question: question.trim(),
          objectives: objectives.trim(),
          field,
          keywords,
          level
        },
        autoPlan
      );

      onClose();
      // Reset
      setTitle('');
      setTopic('');
      setQuestion('');
      setObjectives('');
      setKeywordsInput('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-2xl w-full p-6 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1">
            New Research Workspace
          </div>
          <h2 className="text-xl font-semibold text-white">Create Research Project</h2>
          <p className="text-xs text-slate-400 mt-1">
            Initialize an empirical, structured research workflow governed by anti-hallucination protocols.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Project Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Multi-Modal Deep Learning for Predictive Maintenance"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Academic Field
              </label>
              <select
                value={field}
                onChange={(e) => setField(e.target.value as AcademicField)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {ACADEMIC_FIELDS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Research Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as ResearchLevel)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {RESEARCH_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Research Topic / Subdiscipline
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. High-frequency vibration analysis & acoustic emissions in induction motors"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Primary Research Question <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What core empirical or theoretical question does this investigation aim to answer?"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Research Objectives (Numbered or Bulleted)
            </label>
            <textarea
              rows={2}
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              placeholder="1. Benchmark temporal deep learning architectures vs classical feature engineering.&#10;2. Quantify degradation under out-of-distribution mechanical load."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Keywords (Comma separated)
            </label>
            <input
              type="text"
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
              placeholder="e.g. Predictive Maintenance, Vibration Analysis, 1D-CNN, Kurtosis, Edge Latency"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={autoPlan}
                onChange={(e) => setAutoPlan(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-cyan-600 focus:ring-0"
              />
              <span>
                Immediately generate AI Research Plan with{' '}
                <strong className="text-cyan-400">{activeProvider.toUpperCase()}</strong>
              </span>
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !question.trim()}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-medium px-4 py-2 rounded-md transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Initializing...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-3.5 h-3.5" />
                    Create Workspace
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
