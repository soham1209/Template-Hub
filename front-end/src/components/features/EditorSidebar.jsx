import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { 
  Mail, 
  LayoutList, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut
} from 'lucide-react';
import { cn } from '../../lib/utils';
import useTemplateStore from '../../store/useTemplateStore';
import { MOCK_USER_CONTEXT } from '../../constants/templates';

export const EditorSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { editorTab, setEditorTab } = useTemplateStore();
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine if we are in the editor view based on URL
  const isEditorView = location.pathname.includes('/editor');

  const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={cn(
        'group flex items-center w-full p-3 rounded-lg transition-all duration-200 mb-2 relative overflow-hidden',
        isActive 
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      )}
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0 transition-transform duration-300", 
        !isExpanded && !isActive && "group-hover:scale-110"
      )} />
      
      <span className={cn(
        "ml-3 text-sm font-medium whitespace-nowrap transition-all duration-300 origin-left",
        isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 w-0 overflow-hidden"
      )}>
        {label}
      </span>

      {!isExpanded && isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-r-full" />
      )}
    </button>
  );

  return (
    <aside 
      className={cn(
        "bg-slate-950 flex flex-col border-r border-slate-900 transition-all duration-300 ease-in-out z-40 h-full relative",
        isExpanded ? "w-64 px-4" : "w-[70px] px-2"
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-9 bg-indigo-600 text-white p-1 rounded-full shadow-lg border-2 border-slate-50 hover:bg-indigo-700 transition-colors z-50"
      >
        {isExpanded ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>

      <div className={cn("flex items-center h-20 mb-2 transition-all duration-300", isExpanded ? "justify-start px-2" : "justify-center")}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
           <span className="font-bold text-white text-xs">MF</span>
        </div>
        <div className={cn("ml-3 overflow-hidden transition-all duration-300", isExpanded ? "w-auto opacity-100" : "w-0 opacity-0")}>
           <h1 className="font-bold text-white tracking-tight">MailForge</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1">
        
        {/* Dashboard Link - Goes to Root */}
        <NavItem 
          icon={Mail} 
          label="Dashboard" 
          isActive={location.pathname === '/'} 
          onClick={() => navigate('/')} 
        />

        <div className="w-full h-[1px] bg-slate-800/50 my-2"></div>

        {/* Structure Link - Only active in Editor */}
        <NavItem 
          icon={LayoutList} 
          label="Structure" 
          isActive={isEditorView && editorTab === 'structure'} 
          onClick={() => {
            if (isEditorView) setEditorTab('structure');
          }} 
        />

        {/* Properties Link - Only active in Editor */}
        <NavItem 
          icon={Settings} 
          label="Properties" 
          isActive={isEditorView && editorTab === 'settings'} 
          onClick={() => {
            if (isEditorView) setEditorTab('settings');
          }} 
        />
      </div>

      <div className={cn(
        "mt-auto mb-6 bg-slate-900/50 rounded-xl border border-slate-800 transition-all duration-300 flex items-center overflow-hidden",
        isExpanded ? "p-3 mx-0" : "p-0 mx-0 border-none bg-transparent justify-center"
      )}>
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-300 font-bold flex-shrink-0">
          {MOCK_USER_CONTEXT.name[0]}
        </div>
        
        <div className={cn("ml-3 overflow-hidden transition-all duration-300", isExpanded ? "w-auto opacity-100" : "w-0 opacity-0")}>
           <p className="text-xs font-medium text-slate-200 truncate">{MOCK_USER_CONTEXT.name}</p>
        </div>

        {isExpanded && (
          <button className="ml-auto text-slate-500 hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};