import { getStationsByGeoLocation } from '../utils/stations-utils';

describe('stations-utils', () => {
  describe('getStationsByGeoLocation', () => {
    it('should return stations by geo location within the radius', async () => {
      const stations = await getStationsByGeoLocation(6.097, 50.771, 1000);
      expect(stations).toHaveLength(1);
      expect(stations[0].name).toBe('Aachen Hbf');
    });

    it.each([
      [6.097, 50.771, 5000, 5],
      [6.086, 50.759, 5000, 4],
      [6.096, 50.763, 5000, 5],
      [6.102, 50.772, 5000, 5],
      [6.088, 50.769, 5000, 4],
    ])(
      'for geo location (%s %s) within the radius %s should find %s stations',
      async (longitude, latitude, radius, count) => {
        const stations = await getStationsByGeoLocation(longitude, latitude, radius);
        expect(stations).toHaveLength(count);
      },
    );
  });
});
