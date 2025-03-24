/* eslint-disable @typescript-eslint/naming-convention */
export interface RouteRequest {
  name: string;
  coordinates: Coordinate[];
  instructions: Instruction[];
  summary: Summary;
  waypointIndices: number[];
  inputWaypoints: InputWaypoint[];
  waypoints: Waypoint[];
  properties: Properties;
  routesIndex: number;
}

interface Coordinate {
  lat: number;
  lng: number;
}

interface Instruction {
  type: string;
  distance: number;
  time: number;
  road: string;
  direction: string;
  index: number;
  mode: string;
  modifier: string;
  text: string;
}

interface Summary {
  totalDistance: number;
  totalTime: number;
}

interface InputWaypoint {
  options: WaypointOptions;
  latLng: LatLng;
  _initHooksCalled: boolean;
}

interface Waypoint {
  options: WaypointOptions;
  latLng: LatLng;
  _initHooksCalled: boolean;
}

interface WaypointOptions {
  allowUTurn: boolean;
}

interface LatLng {
  lat: number;
  lng: number;
}

interface Properties {
  isSimplified: boolean;
}
