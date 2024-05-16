export interface RootObject {
  offset: number;
  limit: number;
  total: number;
  stations: Station[];
}

interface Station {
  stationID: string;
  names: Names;
  metropolis: Metropolis;
  address: Address;
  stationCategory: string;
  availableTransports: any[];
  availableLocalServices: any[];
  transportAssociations: any[];
  owner: Owner;
  countryCode: string;
  timeZone: string;
  position?: Position;
  validFrom: string;
}

interface Position {
  longitude: number;
  latitude: number;
}

interface Owner {
  name: string;
  organisationalUnit: OrganisationalUnit;
}

interface OrganisationalUnit {
  id: number;
  name: string;
  nameShort: string;
}

interface Address {
  street: string;
  houseNumber?: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
}

interface Metropolis {
}

interface Names {
  DE: DE;
}

interface DE {
  name: string;
}