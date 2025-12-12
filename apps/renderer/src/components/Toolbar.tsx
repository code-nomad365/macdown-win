import React from 'react';

interface ToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onCode: () => void;
  onQuote: () => void;
  onList: () => void;
  onOrderedList: () => void;
  onHeading: () => void;
  onLink: () => void;
  onImage: () => void;
  onIndent: () => void;
  onOutdent: () => void;
  theme: 'light' | 'dark';
}

const Toolbar: React.FC<ToolbarProps> = ({
  onBold,
  onItalic,
  onCode,
  onQuote,
  onList,
  onOrderedList,
  onHeading,
  onLink,
  onImage,
  onIndent,
  onOutdent,
  theme,
}) => {
  const buttonClass = `px-3 py-1.5 rounded text-sm font-medium transition-colors ${
    theme === 'dark'
      ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
  }`;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 border-b ${
      theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
    }`}>
      <button onClick={onHeading} className={buttonClass} title="標題">
        <strong>H</strong>
      </button>
      <button onClick={onBold} className={buttonClass} title="粗體 (Ctrl+B)">
        <strong>B</strong>
      </button>
      <button onClick={onItalic} className={buttonClass} title="斜體 (Ctrl+I)">
        <em>I</em>
      </button>
      <button onClick={onCode} className={buttonClass} title="程式碼">
        {'</>'}
      </button>

      <div className={`w-px h-6 ${theme === 'dark' ? 'bg-slate-600' : 'bg-slate-300'}`} />

      <button onClick={onQuote} className={buttonClass} title="引用">
        &quot;&quot;
      </button>
      <button onClick={onList} className={buttonClass} title="無序列表">
        •
      </button>
      <button onClick={onOrderedList} className={buttonClass} title="有序列表">
        1.
      </button>

      <div className={`w-px h-6 ${theme === 'dark' ? 'bg-slate-600' : 'bg-slate-300'}`} />

      <button onClick={onLink} className={buttonClass} title="連結">
        🔗
      </button>
      <button onClick={onImage} className={buttonClass} title="圖片">
        🖼️
      </button>

      <div className={`w-px h-6 ${theme === 'dark' ? 'bg-slate-600' : 'bg-slate-300'}`} />

      <button onClick={onIndent} className={buttonClass} title="增加縮排">
        →
      </button>
      <button onClick={onOutdent} className={buttonClass} title="減少縮排">
        ←
      </button>
    </div>
  );
};

export default Toolbar;
