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
  operatedBy?: string;
  operatedByTh?: string;
  operatedByZh?: string;
  bookingRef?: string;
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

export interface SplitExpense {
  id: string;
  name: string;
  amountCny: number;
  amountThb: number;
  category: "food" | "transport" | "hotels" | "tickets" | "shopping" | "other";
  paidBy: string; // Traveler ID
  splitAmong: string[]; // Traveler IDs who share this expense
  settledParticipants?: string[]; // Traveler IDs who have paid/settled their share
  imageUrl?: string;
  createdAt: string;
  recordedBy: string; // Name of traveler who logged it
  isDeleted?: boolean;
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
  humidity?: number;
  todayTemp?: number;
  todayCondition?: string;
  todayHumidity?: number;
}

export type VerificationStatus = "pending" | "verified" | "official" | "rejected" | "stale";

export type ContentPublicationStatus = "draft" | "published" | "archived";

export type SourceTrustLevel = "official" | "partner" | "editorial" | "community";

export type TravelContentType =
  | "alert"
  | "attraction"
  | "restaurant"
  | "hotel"
  | "route"
  | "checkpoint"
  | "document"
  | "phrase"
  | "city_guide";

export interface ContentSource {
  id: string;
  sourceKey: string;
  sourceName: string;
  sourceType: string;
  baseUrl: string;
  defaultLanguage: Language;
  regionCode?: string;
  trustLevel: SourceTrustLevel;
  isActive: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SourceFetchRun {
  id: string;
  sourceId: string;
  fetchStatus: string;
  responseStatus?: number;
  fetchedAt: string;
  finishedAt?: string;
  rawPayloadUrl?: string;
  errorMessage?: string;
  checksum?: string;
}

export interface TravelContentLocalization {
  locale: Language;
  title: string;
  summary?: string;
  detail?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface TravelContentMedia {
  id: string;
  contentId: string;
  mediaType: "image" | "document" | "map";
  storagePath: string;
  altText?: string;
  caption?: string;
  sourceUrl?: string;
  isVerified: boolean;
  sortOrder: number;
}

export interface TravelContentRecord {
  id: string;
  contentKey: string;
  contentType: TravelContentType;
  regionCode?: string;
  slug: string;
  status: ContentPublicationStatus;
  verificationStatus: VerificationStatus;
  freshnessHours: number;
  sourceId?: string;
  sourceUrl?: string;
  sourcePublishedAt?: string;
  sourceLastCheckedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  confidenceScore?: number;
  expiresAt?: string;
  canonicalTitle: string;
  summary?: string;
  detail?: string;
  metadata: Record<string, unknown>;
  localizations?: Partial<Record<Language, TravelContentLocalization>>;
  media?: TravelContentMedia[];
  source?: ContentSource;
}

export interface ContentVerificationLog {
  id: string;
  contentId: string;
  verificationStatus: VerificationStatus;
  reviewer?: string;
  notes?: string;
  checkedAt: string;
  snapshotUrl?: string;
  sourceChecksum?: string;
}

export interface ContentUpdateInput {
  status?: ContentPublicationStatus;
  verificationStatus?: VerificationStatus;
  freshnessHours?: number;
  verifiedBy?: string;
  summary?: string;
  detail?: string;
  sourceUrl?: string;
  sourceLastCheckedAt?: string;
  expiresAt?: string | null;
}

export interface VerificationLogCreateInput {
  verificationStatus: VerificationStatus;
  reviewer?: string;
  notes?: string;
  checkedAt?: string;
  snapshotUrl?: string;
  sourceChecksum?: string;
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
  | "schedule"
  | "phrasebook"
  | "travelers"
  | "timeline"
  | "attractions"
  | "restaurants"
  | "expense-split";

export type Language = "en" | "th" | "zh";
