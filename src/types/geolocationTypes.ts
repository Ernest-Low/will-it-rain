export interface GeolocationPosition {
  coords: GeolocationCoordinates;
  timestamp: number;
}

export interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

export interface GeolocationPositionError {
  code: number;
  message: string;
}

// The code can have one of the following values:
export enum GeolocationPositionErrorCode {
  PERMISSION_DENIED = 1, // User denied the request for Geolocation.
  POSITION_UNAVAILABLE = 2, // The position could not be determined.
  TIMEOUT = 3, // The request to get user location timed out.
}

