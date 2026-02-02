import React, { useRef, useEffect, useMemo } from 'react';
import { Card } from '../ui';
import { generateHTML } from '../../lib/email-generator';

/**
 * EmailPreview Component
 * Displays live preview of email template in an iframe
 */
export const EmailPreview = ({ sections, data, showMockData }) => {
  const iframeRef = useRef(null);
  const fullHtml = useMemo(
    () => generateHTML(sections, showMockData ? data : {}),
    [sections, data, showMockData]
  );

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(fullHtml);
    doc.close();
  }, [fullHtml]);

  return (
    <Card className="w-full h-full overflow-hidden flex flex-col border-none shadow-none ring-1 ring-slate-200">
      <div className="h-10 bg-slate-50 flex items-center px-4 space-x-2 border-b border-slate-200">
        <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
        <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
        <div className="ml-4 text-xs text-slate-400 font-medium">preview.html</div>
      </div>
      <iframe ref={iframeRef} title="Email Preview" className="flex-1 w-full border-none bg-white" />
    </Card>
  );
};
