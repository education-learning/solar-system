import { Planet } from './types';

// Earth orbits in 60 seconds (1 minute)
export const EARTH_ORBIT_SECONDS = 60;

export const PLANETS: Planet[] = [
  {
    name: "Mercury",
    color: "#A5A5A5",
    radius: 4,
    distance: 60,
    period: 0.24,
    description: "The smallest planet in the Solar System and the closest to the Sun.",
    textureType: 'solid',
    orbitType: 'circular'
  },
  {
    name: "Venus",
    color: "#E3BB76",
    radius: 7,
    distance: 90,
    period: 0.615,
    description: "Second planet from the Sun. It has a thick, toxic atmosphere.",
    textureType: 'solid',
    orbitType: 'circular'
  },
  {
    name: "Earth",
    color: "#4F4CB0",
    radius: 7.5,
    distance: 130,
    period: 1.0,
    description: "Our home. The only known planet to harbor life.",
    textureType: 'solid',
    orbitType: 'circular'
  },
  {
    name: "Mars",
    color: "#E27B58",
    radius: 5,
    distance: 170,
    period: 1.88,
    description: "The Red Planet. Dusty, cold, desert world with a very thin atmosphere.",
    textureType: 'solid',
    orbitType: 'circular'
  },
  {
    name: "Jupiter",
    color: "#C88B3A",
    radius: 18,
    distance: 240,
    period: 11.86,
    description: "The largest planet. A gas giant with a Great Red Spot.",
    textureType: 'banded',
    orbitType: 'circular'
  },
  {
    name: "Saturn",
    color: "#C5AB6E",
    radius: 16,
    distance: 310,
    period: 29.46,
    description: "Adorned with a dazzling, complex system of icy rings.",
    textureType: 'ringed',
    orbitType: 'circular'
  },
  {
    name: "Uranus",
    color: "#93B8BE",
    radius: 12,
    distance: 370,
    period: 84.01,
    description: "An ice giant. It rotates at a nearly 90-degree angle from the plane of its orbit.",
    textureType: 'solid',
    orbitType: 'circular'
  },
  {
    name: "Neptune",
    color: "#4b70dd",
    radius: 12,
    distance: 430,
    period: 164.8,
    description: "The most distant major planet. Dark, cold, and whipped by supersonic winds.",
    textureType: 'solid',
    orbitType: 'circular'
  },
  {
    name: "Halley's Comet",
    color: "#FFFFFF",
    radius: 3,
    distance: 300, // Semi-major axis
    period: -75.3, // Negative for retrograde orbit
    description: "A famous short-period comet visible from Earth every 75-76 years.",
    textureType: 'solid',
    orbitType: 'elliptical',
    eccentricity: 0.82, // Adjusted for visual simulation (real is ~0.97 but would clip sun/bounds)
    tilt: 160 // Degrees
  }
];

export const SUN_RADIUS = 35;
export const SUN_COLOR = "#FDB813";