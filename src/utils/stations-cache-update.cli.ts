/**
 * This module is responsible for updating the stations cache by fetching station data from the Deutsche Bahn API,
 * transforming it into Protobuf or JSON format, and saving it to a file.
 * Can be called using `npm run stations-cache-update`.
 */

import fs from 'fs';
import 'dotenv/config';
import { RootObject } from '../models/ris-stations';
import protobuf from 'protobufjs';
import { measureAsync } from './metrics';
import args from './args';
import getStations from '../services/ris-stations';

const PROTOBUF_SCHEMA_FILE = 'src/models/stations.proto';
const STATIONS_CACHE_FILE_PATH = 'src/static/stations_update';

const { FORMAT } = args();

const formats = (FORMAT || 'protobuf').split(',');

console.log(`☄️  Updating stations cache using "${formats}" format(s)...`);

const fetchStations = async () => {
  const stationsResponse = await getStations();

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
  const path = `${STATIONS_CACHE_FILE_PATH}.protobuf`;
  fs.writeFileSync(path, buffer);
  console.log('Dumped', transformed.length, 'stations to ', path, ' file');
};

const saveAsJsonFile = async (data: RootObject) => {
  const transformed = data.stations
    .filter((station) => station.position != null)
    .map((station) => ({
      stationID: station.stationID,
      name: station.names.DE.name,
      address: station.address,
      position: station.position,
    }));

  const path = `${STATIONS_CACHE_FILE_PATH}.json`;
  fs.writeFileSync(path, JSON.stringify(transformed));
  console.log('Dumped', transformed.length, 'stations to ', path, ' file');
};

(async () => {
  await fetchStations();
  console.log('🚀 Stations cache updated!');
})();
