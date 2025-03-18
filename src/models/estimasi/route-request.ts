/* eslint-disable @typescript-eslint/naming-convention */

export interface RouteRequest {
  code: string;
  routes: Route[];
  waypoints: Waypoint[];
}

interface Route {
  legs: Leg[];
  weight_name: string;
  weight: number;
  duration: number;
  distance: number;
}

interface Leg {
  steps: Step[];
  summary: string;
  weight: number;
  duration: number;
  distance: number;
}

interface Step {
  geometry: string;
  maneuver: Maneuver;
  mode: string;
  driving_side: string;
  name: string;
  intersections: Intersection[];
  weight: number;
  duration: number;
  distance: number;
}

interface Maneuver {
  bearing_after: number;
  bearing_before: number;
  location: [number, number];
  type: string;
  modifier?: string;
}

interface Intersection {
  out: number;
  in?: number;
  entry: boolean[];
  bearings: number[];
  location: [number, number];
}

interface Waypoint {
  hint: string;
  distance: number;
  name: string;
  location: [number, number];
}
