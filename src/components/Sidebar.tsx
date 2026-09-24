import React from 'react';
import { useResearch, WorkspaceView } from '../context/ResearchContext.tsx';
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  MessageSquare,
  FileCheck2,
  Columns3,
  GitMerge,
  SearchCode,
  StickyNote,
  Quote,
  FileText,
  Globe2,
  Settings2,
  ChevronDown,
  Layers,
  FolderOpen
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenNewProject: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile, onOpenNewProject }) => {
  const {
    projects,
    activeProject,
    selectProject,
    activeView,
    setActiveView,
    activeProvider,
    providerStatuses
  } = useResearch();

  const navItems: { id: WorkspaceView; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'planner', label: 'Research Plan', icon: Compass },
    { id: 'sources', label: 'Sources & Literature', icon: BookOpen, badge: activeProject?.sources.length },
    { id: 'chat', label: 'Research Chat', icon: MessageSquare, badge: activeProject?.chatHistory.length },
    { id: 'evidence', label: 'Evidence Engine', icon: FileCheck2, badge: activeProject?.evidence.length },
    { id: 'comparisons', label: 'Source Comparison', icon: Columns3, badge: activeProject?.comparisons.length },
    { id: 'syntheses', label: 'Research Synthesis', icon: GitMerge, badge: activeProject?.syntheses.length },
    { id: 'gaps', label: 'Potential Gaps', icon: SearchCode, badge: activeProject?.gaps.length },
    { id: 'notes', label: 'Research Notes', icon: StickyNote, badge: activeProject?.notes.length },
    { id: 'citations', label: 'Citations (IEEE/APA)', icon: Quote },
    { id: 'reports', label: 'Research Reports', icon: FileText, badge: activeProject?.reports.length },
    { id: 'web-research', label: 'Web Research', icon: Globe2, badge: activeProject?.webResults.length },
    { id: 'settings', label: 'Settings & Status', icon: Settings2 }
  ];

  const currentProvider = providerStatuses.find((p) => p.id === activeProvider);

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:sticky top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Project Selector Section */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 px-1 font-mono">
            <span className="uppercase tracking-wider text-[10px]">Active Project</span>
            <button
              onClick={onOpenNewProject}
              className="text-cyan-400 hover:text-cyan-300 text-[11px] font-sans"
            >
              + New
            </button>
          </div>

          <div className="relative">
            <select
              value={activeProject?.id || ''}
              onChange={(e) => {
                selectProject(e.target.value);
                if (window.innerWidth < 768) onCloseMobile();
              }}
              className="w-full appearance-none bg-slate-800/90 text-slate-100 text-xs rounded-md border border-slate-700/80 px-2.5 py-1.5 pr-7 focus:outline-none focus:border-cyan-500 font-medium truncate"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {activeProject && (
            <div className="mt-2 px-1 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="truncate">{activeProject.field}</span>
              <span className="text-slate-600">·</span>
              <span className="font-mono text-slate-400">{activeProject.level}</span>
            </div>
          )}
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Research Workflow
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  if (window.innerWidth < 768) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-cyan-800/60 text-cyan-200' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer / Provider Status */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-xs">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-400">Engine Protocol</span>
            <span className="font-mono text-cyan-400">{activeProvider.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                currentProvider?.configured ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]' : 'bg-amber-500'
              }`}
            />
            <span className="truncate">
              {currentProvider?.configured ? 'Online & Authenticated' : 'Simulated / Key Missing'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
