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
}) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-base-300 bg-base-200">
      <div className="btn-group">
        <button onClick={onHeading} className="btn btn-sm btn-ghost" title="標題">
          <strong>H</strong>
        </button>
        <button onClick={onBold} className="btn btn-sm btn-ghost" title="粗體 (Ctrl+B)">
          <strong>B</strong>
        </button>
        <button onClick={onItalic} className="btn btn-sm btn-ghost" title="斜體 (Ctrl+I)">
          <em>I</em>
        </button>
        <button onClick={onCode} className="btn btn-sm btn-ghost" title="程式碼">
          {'</>'}
        </button>
      </div>

      <div className="divider divider-horizontal m-0" />

      <div className="btn-group">
        <button onClick={onQuote} className="btn btn-sm btn-ghost" title="引用">
          &quot;&quot;
        </button>
        <button onClick={onList} className="btn btn-sm btn-ghost" title="無序列表">
          •
        </button>
        <button onClick={onOrderedList} className="btn btn-sm btn-ghost" title="有序列表">
          1.
        </button>
      </div>

      <div className="divider divider-horizontal m-0" />

      <div className="btn-group">
        <button onClick={onLink} className="btn btn-sm btn-ghost" title="連結">
          🔗
        </button>
        <button onClick={onImage} className="btn btn-sm btn-ghost" title="圖片">
          🖼️
        </button>
      </div>

      <div className="divider divider-horizontal m-0" />

      <div className="btn-group">
        <button onClick={onIndent} className="btn btn-sm btn-ghost" title="增加縮排">
          →
        </button>
        <button onClick={onOutdent} className="btn btn-sm btn-ghost" title="減少縮排">
          ←
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
