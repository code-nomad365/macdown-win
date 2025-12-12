import React from 'react';

interface ZoomControlProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  theme: 'light' | 'dark';
}

const ZoomControl: React.FC<ZoomControlProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  theme,
}) => {
  const buttonClass = `px-2 py-1 rounded text-sm font-medium transition-colors ${
    theme === 'dark'
      ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
  }`;

  const disabledClass = `px-2 py-1 rounded text-sm font-medium opacity-50 cursor-not-allowed ${
    theme === 'dark'
      ? 'bg-slate-700 text-slate-200'
      : 'bg-slate-100 text-slate-700'
  }`;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 border-b ${
      theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
    }`}>
      <button
        onClick={onZoomOut}
        className={zoom <= 50 ? disabledClass : buttonClass}
        disabled={zoom <= 50}
        title="縮小 (最小 50%)"
      >
        −
      </button>
      <button
        onClick={onZoomReset}
        className={buttonClass}
        title="重設為 100%"
      >
        {zoom}%
      </button>
      <button
        onClick={onZoomIn}
        className={zoom >= 200 ? disabledClass : buttonClass}
        disabled={zoom >= 200}
        title="放大 (最大 200%)"
      >
        +
      </button>
    </div>
  );
};

export default ZoomControl;
