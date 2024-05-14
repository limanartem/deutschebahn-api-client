import { getStation, getStationPlan } from '../services/timetables';
import { Agent, Interceptable, MockAgent, setGlobalDispatcher } from 'undici';
import { mockData } from './mock-data';

const { DB_API_URL } = process.env;

describe('timetables', () => {
  let mockAgent: MockAgent;
  let mockPool: Interceptable;

  beforeEach(() => {
    mockAgent = new MockAgent();
    mockPool = mockAgent.get(DB_API_URL!);

    (global as any).setMockedFetchGlobalDispatcher(mockAgent);
    mockAgent.disableNetConnect();

    jest.resetAllMocks();
  });

  afterEach(async () => {
    await mockAgent.close();
    setGlobalDispatcher(new Agent());
  });

  describe('getStation', () => {
    it('should return single station by pattern', async () => {
      mockPool
        .intercept({ path: '/timetables/v1/station/BLS', method: 'GET' })
        .reply(200, () => mockData.timetables.station)
        .persist();

      const stations = await getStation('BLS');
      expect(stations.stations.station).toHaveLength(1);
      expect(stations.stations.station[0].name).toBe('Berlin Hbf');
      expect(stations.stations.station[0].eva).toBe(8011160);
    });

    it('should return multiple stations by pattern', async () => {
      mockPool
        .intercept({ path: '/timetables/v1/station/BLS', method: 'GET' })
        .reply(200, () => mockData.timetables.stations)
        .persist();

      const stations = await getStation('BLS');
      expect(stations.stations.station).toHaveLength(2);
      expect(stations.stations.station[0].name).toBe('Berlin Hbf 1');
      expect(stations.stations.station[0].eva).toBe(123456789);
      expect(stations.stations.station[1].name).toBe('Berlin Hbf 2');
      expect(stations.stations.station[1].eva).toBe(897564321);
    });


  });
  describe('getStationPlan', () => {
    it('should return station plan by stationEva', async () => {
      const stationPlan = await getStationPlan(8000001);
      expect(stationPlan).toBeDefined();
    });
  });
});
