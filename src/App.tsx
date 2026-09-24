/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ResearchProvider, useResearch } from './context/ResearchContext.tsx';
import { Header } from './components/Header.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { CreateProjectModal } from './components/CreateProjectModal.tsx';
import { DashboardView } from './components/views/DashboardView.tsx';
import { PlannerView } from './components/views/PlannerView.tsx';
import { SourcesView } from './components/views/SourcesView.tsx';
import { ChatView } from './components/views/ChatView.tsx';
import { EvidenceView } from './components/views/EvidenceView.tsx';
import { ComparisonsView } from './components/views/ComparisonsView.tsx';
import { SynthesesView } from './components/views/SynthesesView.tsx';
import { GapsView } from './components/views/GapsView.tsx';
import { NotesView } from './components/views/NotesView.tsx';
import { CitationsView } from './components/views/CitationsView.tsx';
import { ReportsView } from './components/views/ReportsView.tsx';
import { WebResearchView } from './components/views/WebResearchView.tsx';
import { SettingsView } from './components/views/SettingsView.tsx';
import { Sparkles, Cpu } from 'lucide-react';

const WorkspaceContent: React.FC = () => {
  const { activeView, isAILoading, aiTaskName, activeProvider, activeModel } = useResearch();
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView onOpenNewProject={() => setIsNewProjectModalOpen(true)} />;
      case 'planner':
        return <PlannerView />;
      case 'sources':
        return <SourcesView />;
      case 'chat':
        return <ChatView />;
      case 'evidence':
        return <EvidenceView />;
      case 'comparisons':
        return <ComparisonsView />;
      case 'syntheses':
        return <SynthesesView />;
      case 'gaps':
        return <GapsView />;
      case 'notes':
        return <NotesView />;
      case 'citations':
        return <CitationsView />;
      case 'reports':
        return <ReportsView />;
      case 'web-research':
        return <WebResearchView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onOpenNewProject={() => setIsNewProjectModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenNewProject={() => setIsNewProjectModalOpen(true)}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      <div className="flex-1 flex">
        {/* Left Navigation Sidebar */}
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          onOpenNewProject={() => setIsNewProjectModalOpen(true)}
        />

        {/* Central Workspace Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          {renderActiveView()}
        </main>
      </div>

      {/* Persistent Global Loading Indicator Modal */}
      {isAILoading && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/80 rounded-lg p-3.5 shadow-2xl flex items-center gap-3 backdrop-blur-md animate-pulse">
          <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500 flex items-center justify-center shrink-0">
            <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Cpu className="w-3 h-3" />
              <span>{activeProvider.toUpperCase()} ({activeModel}) Executing</span>
            </div>
            <div className="text-xs text-white font-medium">
              {aiTaskName || 'Processing research computation...'}
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      <CreateProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ResearchProvider>
      <WorkspaceContent />
    </ResearchProvider>
  );
}
