/** 
 * @group integration
 * 
 * Integration tests for timetables api services 
 */
describe('Timetables Integration Tests', () => {
  const BLS_EVA = 8011160;

  beforeEach(() => {
    jest.resetModules();

    process.env.DB_API_URL = 'https://apis.deutschebahn.com/db-api-marketplace/apis';
    /* Uncomment for local testing
    process.env.DB_API_CLIENT_ID = '<add value>';
    process.env.DB_API_KEY = '<add value>'; */
  });

  describe('getStation', () => {
    it('should return single station by pattern', async () => {
      const { getStation } = await import('../services/timetables');

      const stations = await getStation('BLS');

      expect(stations.stations.station).toHaveLength(1);
      expect(stations.stations.station[0].name).toBe('Berlin Hbf');
      expect(stations.stations.station[0].eva).toBe(BLS_EVA);
    });
  });

  describe('getStationPlan', () => {
    it('should return station plan by EVA number and date-time', async () => {
      const { getStationPlan } = await import('../services/timetables');
      const date = new Date();
      const time = date.getHours() + 1;

      const result = await getStationPlan(BLS_EVA, {
        date,
        time1: time,
      });

      expect(result.timetable?.stops).toBeDefined();
      const stop = result.timetable?.stops?.[0];
      expect(stop).toBeDefined();
      expect(stop?.arrivalEvent).toBeDefined();
      expect(stop?.tripLabel).toBeDefined();
    });
  });
});
