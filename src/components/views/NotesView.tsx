import React, { useState } from 'react';
import { useResearch } from '../../context/ResearchContext.tsx';
import { ResearchNote, NoteType } from '../../types/research.ts';
import {
  StickyNote,
  Plus,
  Trash2,
  Edit3,
  Tag,
  BookOpen,
  Search,
  Filter,
  CheckCircle2
} from 'lucide-react';

const NOTE_TYPES: NoteType[] = [
  'General Note',
  'Source Note',
  'Finding',
  'Research Question',
  'Idea',
  'Hypothesis'
];

export const NotesView: React.FC = () => {
  const { activeProject, addNote, updateNote, deleteNote } = useResearch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<ResearchNote | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<NoteType>('General Note');
  const [sourceId, setSourceId] = useState<string>('');
  const [tagsInput, setTagsInput] = useState('');

  if (!activeProject) {
    return <div className="text-center py-16 text-slate-400">No active project selected.</div>;
  }

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const sourceObj = activeProject.sources.find((s) => s.id === sourceId);

    if (editingNote) {
      updateNote({
        ...editingNote,
        title: title.trim(),
        content: content.trim(),
        type,
        sourceId: sourceId || undefined,
        sourceTitle: sourceObj ? sourceObj.title : undefined,
        tags,
        updatedAt: new Date().toISOString()
      });
      setEditingNote(null);
    } else {
      addNote({
        title: title.trim(),
        content: content.trim(),
        type,
        sourceId: sourceId || undefined,
        sourceTitle: sourceObj ? sourceObj.title : undefined,
        tags
      });
    }

    setIsModalOpen(false);
    resetForm();
  };

  const startEdit = (note: ResearchNote) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setType(note.type);
    setSourceId(note.sourceId || '');
    setTagsInput((note.tags || []).join(', '));
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setType('General Note');
    setSourceId('');
    setTagsInput('');
    setEditingNote(null);
  };

  const filteredNotes = activeProject.notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      n.content.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (n.tags || []).some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()));

    const matchesType = typeFilter === 'All' || n.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
            Phase 07 · Notebook & Hypotheses
          </div>
          <h1 className="text-xl font-semibold text-white mt-0.5">
            Research Notebook
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Capture hypotheses, empirical findings, and literature notes linked to specific papers.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium px-4 py-2 rounded-md transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Research Note</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search notes, tags, or hypotheses..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Category:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-md px-2 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="All">All Categories</option>
            {NOTE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotes.length === 0 ? (
          <div className="md:col-span-2 border border-slate-800 rounded-lg bg-slate-900/60 p-8 text-center text-slate-400 text-xs">
            No research notes recorded. Click "New Research Note" to log your thoughts or link observations to sources.
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between space-y-3 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                      note.type === 'Hypothesis'
                        ? 'bg-purple-950 text-purple-300 border border-purple-800/60'
                        : note.type === 'Finding'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : note.type === 'Research Question'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {note.type}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => startEdit(note)}
                      className="text-slate-400 hover:text-white p-1"
                      title="Edit Note"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-white mb-1.5">
                  {note.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                  {note.content}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-[11px]">
                {note.sourceTitle && (
                  <div className="text-slate-400 truncate flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">Linked: {note.sourceTitle}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {(note.tags || []).map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <span className="font-mono text-[10px] text-slate-500">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-lg w-full p-6 shadow-2xl relative my-8">
            <h2 className="text-lg font-semibold text-white mb-1">
              {editingNote ? 'Edit Research Note' : 'Add Research Note'}
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Categorize and link your observations, hypotheses, and questions.
            </p>

            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Note Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Discrepancy in reported lead times for bearing fatigue"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as NoteType)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {NOTE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Linked Source (Optional)
                  </label>
                  <select
                    value={sourceId}
                    onChange={(e) => setSourceId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 truncate"
                  >
                    <option value="">None / General Note</option>
                    {activeProject.sources.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Content <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your research observation, working hypothesis, or experimental reflection..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. vibration, acoustic, lead-time, testbed"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim() || !content.trim()}
                  className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-medium px-4 py-2 rounded-md transition-colors"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
