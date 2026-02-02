import React from 'react';
import { Dashboard, Editor } from './components/features';
import useTemplateStore from './store/useTemplateStore';
import './App.css';

/**
 * Main App Component
 * Routes between Dashboard and Editor views
 */
function App() {
  const { view } = useTemplateStore();

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-950 font-sans overflow-hidden">
      {view === 'dashboard' && <Dashboard />}
      {view === 'editor' && <Editor />}
    </div>
  );
}

export default App;
