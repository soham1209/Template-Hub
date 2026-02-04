// src/components/features/EditorHeader.jsx
import React, { useState } from 'react';
import { Settings, CheckCircle, Save, Send, X, Loader2, Mail } from 'lucide-react';
import { Button, Input } from '../ui';
import { cn } from '../../lib/utils';
import useTemplateStore from '../../store/useTemplateStore';
import { api } from '../../lib/api';

/**
 * EditorHeader Component
 * Top bar of the editor with template name, save controls, and Send Test Modal
 */
export const EditorHeader = () => {
  const {
    getActiveTemplate,
    updateTemplateInfo,
    isSaved,
    saveTemplate,
    showMockData,
    toggleMockData,
  } = useTemplateStore();

  const activeTemplate = getActiveTemplate();
  
  // -- NEW STATE FOR MODAL --
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [sendingStatus, setSendingStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'

  const handleSave = () => {
    setTimeout(() => {
      saveTemplate();
    }, 600);
  };

  // Open the custom modal instead of prompt
  const openSendModal = () => {
    setSendingStatus('idle');
    setTestEmail('');
    setIsModalOpen(true);
  };

  // Logic to send email via API
  const handleSendTest = async (e) => {
    e.preventDefault(); // Prevent form reload
    if (!testEmail) return;

    setSendingStatus('sending');
    try {
      await api.sendEmail(activeTemplate.id, testEmail);
      setSendingStatus('success');
      
      // Close modal automatically after 2 seconds on success
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      setSendingStatus('error');
    }
  };

  return (
    <>
      {/* 1. MAIN HEADER BAR */}
      <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10 relative">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Editing</span>
          <Input
            value={activeTemplate?.name || ''}
            onChange={(e) => updateTemplateInfo('name', e.target.value)}
            className="font-semibold text-slate-900 border-none bg-transparent shadow-none px-0 h-auto focus-visible:ring-0 text-lg w-auto min-w-[200px]"
          />
        </div>

        <div className="flex items-center gap-4">
          {/* Saved Status Indicator */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                isSaved ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
              )}
            />
            <span className="text-xs font-medium text-slate-500">
              {isSaved ? 'Saved' : 'Unsaved changes'}
            </span>
          </div>

          <div className="h-6 w-[1px] bg-slate-200"></div>

          {/* Toggle Mock Data */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMockData}
            className={cn('gap-2', showMockData ? 'bg-slate-100 border-slate-300' : '')}
          >
            <Settings className="w-3 h-3" />
            {showMockData ? 'Hide Data' : 'Show Data'}
          </Button>

          {/* Save Button */}
          <Button onClick={handleSave} size="sm" className="gap-2 min-w-[100px]">
            {isSaved ? <CheckCircle className="w-3 h-3" /> : <Save className="w-3 h-3" />}
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </Button>

          {/* Send Test Button (Triggers Modal) */}
          <Button onClick={openSendModal} size="sm" variant="secondary" className="gap-2 mr-2 border border-slate-200">
            <Send className="w-3 h-3" />
            <span>Send Test</span>
          </Button>
        </div>
      </div>

      {/* 2. CUSTOM SEND MODAL (Overlay) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-500" />
                Send Test Email
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {sendingStatus === 'success' ? (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-medium text-slate-900">Email Sent!</h4>
                  <p className="text-sm text-slate-500 mt-1">Check your inbox (and spam folder).</p>
                </div>
              ) : (
                <form onSubmit={handleSendTest} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Recipient Address</label>
                    <Input 
                      placeholder="name@example.com" 
                      type="email"
                      required
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      className="w-full"
                      autoFocus
                    />
                    <p className="text-[10px] text-slate-500">
                      The email will be sent using the current template design.
                    </p>
                  </div>

                  {sendingStatus === 'error' && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
                      Failed to send email. Please check server logs.
                    </div>
                  )}

                  <div className="pt-2 flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setIsModalOpen(false)}
                      disabled={sendingStatus === 'sending'}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 gap-2 bg-indigo-600 hover:bg-indigo-700"
                      disabled={sendingStatus === 'sending' || !testEmail}
                    >
                      {sendingStatus === 'sending' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Send Now
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};