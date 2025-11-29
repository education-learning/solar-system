import React, { useState, useCallback } from 'react';
import SolarSystem from './components/SolarSystem';
import Controls from './components/Controls';
import StarBackground from './components/StarBackground';
import { SimulationState } from './types';
import { EARTH_ORBIT_SECONDS } from './constants';

const App: React.FC = () => {
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isPlaying: true,
    speedMultiplier: 1, // 1 = Real simulation time (Earth = 60s)
    showLabels: true,
    zoom: 1,
  });

  const handleTogglePlay = useCallback(() => {
    setSimulationState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const handleReset = useCallback(() => {
    // This causes a remount of SolarSystem to reset internal time state
    // In a real app we might pass a reset trigger, but key change is easiest here
    window.location.reload(); 
  }, []);

  const handleZoom = useCallback((delta: number) => {
    setSimulationState(prev => ({ 
      ...prev, 
      zoom: Math.max(0.2, Math.min(3, prev.zoom + delta)) 
    }));
  }, []);

  const handleSpeedChange = useCallback((speed: number) => {
    setSimulationState(prev => ({ ...prev, speedMultiplier: speed }));
  }, []);

  const handleToggleLabels = useCallback(() => {
    setSimulationState(prev => ({ ...prev, showLabels: !prev.showLabels }));
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 overflow-hidden">
      <StarBackground />
      
      {/* Header Info */}
      <div className="absolute top-0 left-0 w-full p-6 z-10 pointer-events-none">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-indigo-100 drop-shadow-lg">
          Solar System Simulation
        </h1>
        <p className="text-slate-400 mt-2 text-sm max-w-md">
          A heliocentric model where Earth orbits the Sun every <span className="text-white font-semibold">{EARTH_ORBIT_SECONDS} seconds</span>. 
          All other orbital periods are scaled relative to Earth's timeline.
        </p>
      </div>

      <SolarSystem state={simulationState} />
      
      <Controls 
        state={simulationState}
        onTogglePlay={handleTogglePlay}
        onReset={handleReset}
        onZoom={handleZoom}
        onSpeedChange={handleSpeedChange}
        onToggleLabels={handleToggleLabels}
      />
    </div>
  );
};

export default App;