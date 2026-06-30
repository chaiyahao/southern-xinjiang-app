export interface ItineraryImage {
  url: string;
  label: string;
  labelTh: string;
  labelZh: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  title: string;
  subtitle: string;
  startLocation: string;
  endLocation: string;
  distanceKm: number;
  driveTime: string;
  elevationGainM: number;
  maxElevationM: number;
  description: string;
  hotelName: string;
  activities: string[];
  coordinates: [number, number]; // [longitude, latitude] for map marking
  routeCoordinates?: [number, number][]; // Line segments for route path
  images?: ItineraryImage[]; // Scenic highlight images with translated labels
  weather: {
    tempRange: string;
    icon: string; // lucide icon name representation
    forecast: string;
  };
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  rating: number;
  daysStayed: string;
  location: string;
  amenities: string[];
  highlights: string[];
  imagePrompt: string; // Info for rendering or image references
  imageUrl?: string;
  bookingUrl?: string;
  amapUrl?: string;
}

export interface FlightLeg {
  flightNo: string;
  carrier: string;
  date: string;
  departureAirport: string;
  departureTime: string;
  arrivalAirport: string;
  arrivalTime: string;
  duration: string;
  aircraft: string;
}

export interface FlightTicket {
  type: "Outbound" | "Return";
  route: string;
  totalDuration: string;
  baggageLimit: string;
  legs: FlightLeg[];
}

export interface BudgetCategory {
  name: string;
  amountThb: number;
  percentage: number;
  color: string;
  details: string;
}

export interface CustomExpense {
  id: string;
  name: string;
  amountThb: number;
  category: "flights" | "transport" | "hotels" | "tickets" | "other";
  description?: string;
}

export interface LiveTelemetry {
  speedKmh: number;
  currentAltitudeM: number;
  etaMinutes: number;
  heading: string;
  activeAlerts: string[];
  weatherTemp: number;
  weatherCondition: string;
  lat?: number;
  lng?: number;
  currentLocation?: string;
}

export type ActiveTab =
  | "overview"
  | "itinerary"
  | "map"
  | "hotels"
  | "budget"
  | "flights"
  | "live"
  | "support"
  | "schedule";

export type Language = "en" | "th" | "zh";
