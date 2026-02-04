// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Dashboard, Editor } from './components/features';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen w-full bg-slate-50 text-slate-950 font-sans overflow-hidden">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/editor/:templateId" element={<Editor />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;