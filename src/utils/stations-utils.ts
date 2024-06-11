import protobuf from 'protobufjs';
import { Lazy } from './lazy';
import { StationList } from '../models/stations.types';
import { measureAsync } from './metrics';
import { isPointWithinRadius } from 'geolib';
import stationsData from '../static/stations_update.protobuf';
import stationsSchema from '../models/stations.proto';

const stations = new Lazy<StationList>(async () => {
  return measureAsync(async () => {
    const schema = await protobuf.parse(stationsSchema);
    const StationList = schema.root.lookupType('StationList');
    return StationList.decode(stationsData).toJSON() as StationList;
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
