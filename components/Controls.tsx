import React from 'react';
import { Play, Pause, ZoomIn, ZoomOut, RotateCcw, Info } from 'lucide-react';
import { SimulationState } from '../types';

interface ControlsProps {
  state: SimulationState;
  onTogglePlay: () => void;
  onReset: () => void;
  onZoom: (delta: number) => void;
  onSpeedChange: (speed: number) => void;
  onToggleLabels: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  state,
  onTogglePlay,
  onReset,
  onZoom,
  onSpeedChange,
  onToggleLabels
}) => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl p-4 flex items-center gap-6 shadow-2xl z-20">
      
      {/* Playback Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onTogglePlay}
          className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          title={state.isPlaying ? "Pause" : "Play"}
        >
          {state.isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
        </button>
        
        <button
          onClick={onReset}
          className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Reset Positions"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="w-px h-8 bg-slate-700" />

      {/* Speed Slider */}
      <div className="flex flex-col gap-1 min-w-[120px]">
        <div className="flex justify-between text-xs text-slate-400 font-medium uppercase tracking-wider">
          <span>Speed</span>
          <span className="text-indigo-400">{state.speedMultiplier}x</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="100"
          step="0.1"
          value={state.speedMultiplier}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>

      <div className="w-px h-8 bg-slate-700" />

      {/* Zoom Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onZoom(-0.1)}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        <span className="text-xs text-slate-400 w-8 text-center">{Math.round(state.zoom * 100)}%</span>
        <button
          onClick={() => onZoom(0.1)}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
      </div>

       <div className="w-px h-8 bg-slate-700" />

       {/* Toggles */}
       <button
          onClick={onToggleLabels}
          className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-semibold ${state.showLabels ? 'bg-indigo-900/50 text-indigo-300' : 'hover:bg-slate-800 text-slate-400'}`}
        >
          <Info size={16} />
          <span>Labels</span>
       </button>
    </div>
  );
};

export default Controls;
