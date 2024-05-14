import protobuf from 'protobufjs';
import { Lazy } from './lazy';
import { StationList } from '../models/stations.proto';
import fs from 'fs';
import { measure } from './metrics';
import { isPointWithinRadius } from 'geolib';

const stations = new Lazy<StationList>(() => {
  return measure(() => {
    const schema = protobuf.loadSync('src/models/stations.proto');
    const StationList = schema.lookupType('StationList');
    const buffer = fs.readFileSync('src/static/stations_update.protobuf');
    return StationList.decode(buffer).toJSON() as StationList;
  }, 'Load stations cache duration');
});

/**
 * Retrieves stations within a specified radius of a given geographic location.
 * @param longitude - The longitude of the center point.
 * @param latitude - The latitude of the center point.
 * @param radius - The radius (in meters) in which to search for stations.
 * @returns An array of stations within the specified radius.
 */
export const getStationsByGeoLocation = async (
  longitude: number,
  latitude: number,
  radius: number,
) => {
  const allStations = await stations.getValue();
  return allStations.stations.filter((station) =>
    isPointWithinRadius(
      { latitude, longitude },
      { latitude: station.position.latitude, longitude: station.position.longitude },
      radius,
    ),
  );
};
