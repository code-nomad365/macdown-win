import React, { useState } from 'react';

const App: React.FC = () => {
  const [content, setContent] = useState<string>('# Hello MacDown\n\nStart typing...');

  return (
    <div className="flex h-screen w-full flex-col bg-white text-slate-900">
      <header className="flex h-12 shrink-0 items-center border-b border-slate-200 px-4">
        <h1 className="text-lg font-bold text-slate-800">MacDown</h1>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 border-r border-slate-200">
          <textarea
            className="h-full w-full resize-none p-4 font-mono text-sm outline-none text-slate-800 placeholder:text-slate-400"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck={false}
            placeholder="Write your markdown here..."
          />
        </div>
        <div className="flex-1 overflow-auto bg-slate-50 p-8">
          <div className="whitespace-pre-wrap font-sans text-base leading-relaxed text-slate-800">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
