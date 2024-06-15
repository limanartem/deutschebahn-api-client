interface Address {
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
}

interface Position {
  longitude: number;
  latitude: number;
}

export interface Station {
  stationID: string;
  name: string;
  address: Address;
  position: Position;
}

export interface StationList {
  stations: Station[];
}
