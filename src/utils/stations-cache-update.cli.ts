/**
 * This module is responsible for updating the stations cache by fetching station data from the Deutsche Bahn API,
 * transforming it into Protobuf or JSON format, and saving it to a file.
 * Can be called using `npm run stations-cache-update`.
 */

import fetch from 'cross-fetch';
import fs from 'fs';
import 'dotenv/config';
import { RootObject } from '../models/stations';
import protobuf from 'protobufjs';
import { measureAsync } from './metrics';
import args from './args';

const { DB_API_CLIENT_ID, DB_API_KEY, DB_API_URL, format } = process.env;
const PROTOBUF_SCHEMA_FILE = 'src/models/stations.proto';
const STATIONS_CACHE_FILE_PATH = 'src/static/stations_update';

const { FORMAT } = args();
console.log('format:', format);

const formats = (FORMAT || 'protobuf').split(',');

if (!DB_API_CLIENT_ID || !DB_API_KEY || !DB_API_URL) {
  throw new Error('Missing environment variables!');
}

console.log(`☄️  Updating stations cache using "${formats}" format(s)...`);

const fetchStations = async () => {
  const url = `${DB_API_URL}/ris-stations/v1/stations?limit=6000`;
  console.log('Fetching stations from:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'db-api-key': DB_API_KEY!,
      'db-client-id': DB_API_CLIENT_ID!,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch stations: ' + (await response.text()));
  }

  const stationsResponse = (await response.json()) as RootObject;

  console.log('Fetched', stationsResponse.stations.length, 'stations');
  if (formats.includes('protobuf')) {
    await measureAsync(() => saveAsProtobufFile(stationsResponse), 'Save as Protobuf duration');
  }
  if (formats.includes('json')) {
    await measureAsync(() => saveAsJsonFile(stationsResponse), 'Save as JSON duration');
  }
};

const saveAsProtobufFile = async (data: RootObject) => {
  const schema = await protobuf.load(PROTOBUF_SCHEMA_FILE);
  const Station = schema.lookupType('Station');
  const StationList = schema.lookupType('StationList');

  const transformed = data.stations
    .filter((station) => station.position != null)
    .map((station) =>
      Station.create({
        stationID: station.stationID,
        name: station.names.DE.name,
        address: station.address,
        position: station.position,
      }),
    );

  const stationList = StationList.create({
    stations: transformed,
  });

  const buffer = StationList.encode(stationList).finish();
  fs.writeFileSync(`${STATIONS_CACHE_FILE_PATH}.protobuf`, buffer);
};

const saveAsJsonFile = async (data: RootObject) => {
  const transformed = data.stations.map((station) => ({
    stationID: station.stationID,
    name: station.names.DE.name,
    address: station.address,
    position: station.position,
  }));

  fs.writeFileSync(`${STATIONS_CACHE_FILE_PATH}.json`, JSON.stringify(transformed));
};

(async () => {
  await fetchStations();
  console.log('🚀 Stations cache updated!');
})();
