import React, { useEffect, useRef, useState } from 'react';
import { PLANETS, SUN_COLOR, SUN_RADIUS, EARTH_ORBIT_SECONDS } from '../constants';
import { SimulationState, Planet } from '../types';

interface SolarSystemProps {
  state: SimulationState;
}

const SolarSystem: React.FC<SolarSystemProps> = ({ state }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = (time - previousTimeRef.current) / 1000; // in seconds
      if (state.isPlaying) {
        setElapsedTime((prevTime) => prevTime + deltaTime * state.speedMultiplier);
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [state.isPlaying, state.speedMultiplier]);

  // Mouse Event Handlers for Panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - pan.x,
      y: e.clientY - pan.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    setPan({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Center coordinate of the SVG
  const cx = 0;
  const cy = 0;

  // Solve Kepler's Equation M = E - e*sin(E) for E using Newton's method
  const solveKepler = (M: number, e: number): number => {
    let E = M;
    const tolerance = 1e-6;
    for (let i = 0; i < 10; i++) {
      const delta = E - e * Math.sin(E) - M;
      if (Math.abs(delta) < tolerance) break;
      E = E - delta / (1 - e * Math.cos(E));
    }
    return E;
  };

  // Calculate current positions
  const getPlanetPosition = (planet: Planet) => {
    const periodInSeconds = planet.period * EARTH_ORBIT_SECONDS;
    
    if (planet.orbitType === 'elliptical' && planet.eccentricity !== undefined) {
      // Keplerian Orbit
      const a = planet.distance; // Semi-major axis
      const e = planet.eccentricity;
      const tiltRad = (planet.tilt || 0) * (Math.PI / 180);

      // Mean Motion n (rad/s)
      const n = (2 * Math.PI) / periodInSeconds;
      
      // Mean Anomaly M
      const M = n * elapsedTime;

      // Eccentric Anomaly E
      const E = solveKepler(M, e);

      // True Anomaly nu
      // tan(nu/2) = sqrt((1+e)/(1-e)) * tan(E/2)
      const sqrtTerm = Math.sqrt((1 + e) / (1 - e));
      const tanNu2 = sqrtTerm * Math.tan(E / 2);
      const nu = 2 * Math.atan(tanNu2);

      // Radius r
      const r = a * (1 - e * Math.cos(E));

      // Position in orbital plane (Focus at 0,0)
      // The perihelion is at angle 0. 
      const x_orb = r * Math.cos(nu);
      const y_orb = r * Math.sin(nu);

      // Rotate by tilt
      const x = cx + x_orb * Math.cos(tiltRad) - y_orb * Math.sin(tiltRad);
      const y = cy + x_orb * Math.sin(tiltRad) + y_orb * Math.cos(tiltRad);
      
      return { x, y, angle: nu + tiltRad, distance: r };
    } else {
      // Simple Circular Orbit
      const angularVelocity = (2 * Math.PI) / periodInSeconds;
      const angle = angularVelocity * elapsedTime;
      const x = cx + planet.distance * Math.cos(angle);
      const y = cy + planet.distance * Math.sin(angle);
      return { x, y, angle, distance: planet.distance };
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`flex-1 w-full h-full flex items-center justify-center overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <svg 
        viewBox="-500 -500 1000 1000" 
        className="w-full h-full transition-transform duration-75 ease-linear will-change-transform"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${state.zoom})` }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
           <filter id="sun-glow">
            <feGaussianBlur stdDeviation="10" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="tail-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
             <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
             <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* Orbits */}
        <g className="opacity-20">
          {PLANETS.map((planet) => {
            if (planet.orbitType === 'elliptical' && planet.eccentricity) {
               const a = planet.distance;
               const e = planet.eccentricity;
               const b = a * Math.sqrt(1 - e * e);
               const c = a * e; // Distance from center to focus
               // The Sun (focus) is at (0,0).
               // For nu=0 to be perihelion, the center must be shifted by -c along the major axis.
               // We apply the tilt rotation to the whole ellipse group.
               
               return (
                 <g key={`orbit-${planet.name}`} transform={`rotate(${planet.tilt || 0})`}>
                    <ellipse
                      cx={-c}
                      cy={0}
                      rx={a}
                      ry={b}
                      fill="none"
                      stroke={planet.color}
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                 </g>
               )
            }
            return (
              <circle
                key={`orbit-${planet.name}`}
                cx={cx}
                cy={cy}
                r={planet.distance}
                fill="none"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            )
          })}
        </g>

        {/* Sun */}
        <circle
          cx={cx}
          cy={cy}
          r={SUN_RADIUS}
          fill={SUN_COLOR}
          filter="url(#sun-glow)"
          className="drop-shadow-[0_0_50px_rgba(253,184,19,0.8)]"
        />
        
        {/* Planets */}
        {PLANETS.map((planet) => {
          const { x, y, angle, distance } = getPlanetPosition(planet);
          
          return (
            <g 
              key={`planet-${planet.name}`} 
              style={{ transform: `translate(${x}px, ${y}px)` }}
              className="transition-transform duration-0" 
            >
              {/* Tooltip Wrapper */}
              <g className="group cursor-pointer">
                
                {/* Comet Tail */}
                {planet.orbitType === 'elliptical' && (
                  <g transform={`rotate(${(Math.atan2(y, x) * 180 / Math.PI)})`}>
                    {/* Tail always points away from the sun (0,0) */}
                    {/* Opacity scales based on distance to sun (closer = brighter) */}
                    <path 
                       d="M 0 0 L 80 -10 L 80 10 Z" 
                       fill="url(#tail-gradient)" 
                       transform="translate(2, 0)"
                       style={{ opacity: Math.max(0.1, 1 - (distance / 400)) }}
                    />
                  </g>
                )}

                {/* Visual Representation */}
                {planet.textureType === 'ringed' && (
                  <ellipse 
                    cx={0} 
                    cy={0} 
                    rx={planet.radius * 2.2} 
                    ry={planet.radius * 0.5} 
                    fill="none" 
                    stroke="#A89F91" 
                    strokeWidth="3"
                    className="opacity-80"
                    transform="rotate(-25)"
                  />
                )}
                
                <circle
                  r={planet.radius}
                  fill={planet.color}
                  filter="url(#glow)"
                  className="hover:stroke-white hover:stroke-2 transition-colors"
                />

                {/* Banded pattern for Jupiter */}
                {planet.textureType === 'banded' && (
                   <g clipPath={`circle(${planet.radius}px)`}>
                     <rect x={-planet.radius} y={-planet.radius * 0.3} width={planet.radius*2} height={planet.radius * 0.2} fill="rgba(0,0,0,0.1)" />
                     <rect x={-planet.radius} y={planet.radius * 0.1} width={planet.radius*2} height={planet.radius * 0.2} fill="rgba(0,0,0,0.1)" />
                   </g>
                )}

                {/* Labels */}
                {state.showLabels && (
                  <g>
                    <line x1={0} y1={planet.radius + 2} x2={10} y2={planet.radius + 15} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                    <text
                      x={15}
                      y={planet.radius + 18}
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                      className="select-none pointer-events-none drop-shadow-md"
                      style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.8)'}}
                    >
                      {planet.name}
                    </text>
                     <text
                      x={15}
                      y={planet.radius + 30}
                      fill="#94a3b8"
                      fontSize="10"
                      className="select-none pointer-events-none drop-shadow-md"
                    >
                      {((elapsedTime * state.speedMultiplier) / (planet.period * EARTH_ORBIT_SECONDS)).toFixed(2)} orbits
                    </text>
                  </g>
                )}

              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default SolarSystem;