interface StationData {
  ds100: string;
  eva: number;
  meta?: string;
  name: string;
  p?: string;
}

export interface StationResponse {
  stations: { station: StationData[] };
}
