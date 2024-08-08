export interface AreaMetadata {
  name: string;
  label_location: LabelLocation;
}

export interface LabelLocation {
  latitude: number;
  longitude: number;
}

interface Forecast {
  area: string;
  forecast: string;
}

interface ValidPeriod {
  start: string;
  end: string;
  text: string;
}

interface Item {
  updated_timestamp: string;
  timestamp: string;
  valid_period: ValidPeriod;
  forecasts: Forecast[];
}

export interface WeatherData {
  area_metadata: AreaMetadata[];
  items: Item[];
  paginationToken?: string;
}

export interface ApiResponse {
  code: number;
  errorMsg: string | null;
  data: WeatherData;
}

export interface Option {
  name: string;
}

export interface AutoCompleteProps {
  options: Option[];
}
