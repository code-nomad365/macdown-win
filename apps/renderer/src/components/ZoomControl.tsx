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
}) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-base-300 bg-base-200">
      <span className="text-sm font-medium mr-2">預覽縮放：</span>
      <div className="btn-group">
        <button
          onClick={onZoomOut}
          className="btn btn-sm btn-ghost"
          disabled={zoom <= 50}
          title="縮小 (最小 50%)"
        >
          −
        </button>
        <button
          onClick={onZoomReset}
          className="btn btn-sm btn-ghost"
          title="重設為 80%"
        >
          <span className="badge badge-sm">{zoom}%</span>
        </button>
        <button
          onClick={onZoomIn}
          className="btn btn-sm btn-ghost"
          disabled={zoom >= 200}
          title="放大 (最大 200%)"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ZoomControl;
