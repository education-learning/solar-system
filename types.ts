export interface Planet {
  name: string;
  color: string;
  radius: number; // Visual size relative to others (not to scale with distance)
  distance: number; // Distance from sun (scaled for visualization). For elliptical, this is semi-major axis (a)
  period: number; // Orbital period in Earth years
  description: string;
  textureType?: 'solid' | 'banded' | 'ringed';
  orbitType?: 'circular' | 'elliptical';
  eccentricity?: number;
  tilt?: number; // Orbit tilt in degrees
}

export interface SimulationState {
  speedMultiplier: number;
  isPlaying: boolean;
  showLabels: boolean;
  zoom: number;
}