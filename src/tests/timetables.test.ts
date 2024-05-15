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
    it('should return station timetable with multiple stops by station Eva, date and time', async () => {
      const date = new Date();
      const time = 9,
        timeStr = time.toString().padStart(2, '0');
      const eva = 8000001;
      const dateStr = `${date.getFullYear().toString().slice(2)}${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;

      mockPool
        .intercept({
          path: `/api/timetables/v1/plan/${eva}/${dateStr}/${timeStr}`,
          method: 'GET',
        })
        .reply(200, () => mockData.timetables.timetableMultiple)
        .persist();

      const stationPlan = await getStationPlan(eva, { date, time1: time });

      expect(stationPlan.timetable).toBeDefined();
      expect(stationPlan.timetable.station).toBe('Berlin Hbf');
      expect(stationPlan.timetable.s).not.toBeUndefined();
      expect(stationPlan.timetable.s).not.toBeNull();

      const stop = stationPlan.timetable.s?.[0];
      expect(stop).toMatchObject({
        id: '7731476269399949882-2405150937-10',
        tl: {
          f: 'N',
          t: 'p',
          o: '800165',
          c: 'RE',
          n: '3112',
        },
        ar: {
          pt: '2405151021',
          pp: '12',
          l: '2',
          ppth: 'Nauen|Brieselang|Finkenkrug|Falkensee|Seegefeld|Albrechtshof|Berlin-Spandau|Berlin-Charlottenburg|Berlin Zoologischer Garten',
        },
        dp: {
          pt: '2405151023',
          pp: '12',
          l: '2',
          ppth: 'Berlin Friedrichstraße|Berlin Alexanderplatz|Berlin Ostbahnhof|Berlin Ostkreuz|Königs Wusterhausen|Brand Tropical Islands|Lübben(Spreewald)|Lübbenau(Spreewald)|Raddusch|Vetschau|Kolkwitz|Cottbus Hbf',
        },
      });
    });

    it('should return station timetable with single stop by station Eva, date and time', async () => {
      const date = new Date();
      const time = 9,
        timeStr = time.toString().padStart(2, '0');
      const eva = 8000001;
      const dateStr = `${date.getFullYear().toString().slice(2)}${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;

      mockPool
        .intercept({
          path: `/api/timetables/v1/plan/${eva}/${dateStr}/${timeStr}`,
          method: 'GET',
        })
        .reply(200, () => mockData.timetables.timetableSingle)
        .persist();

      const stationPlan = await getStationPlan(eva, { date, time1: time });

      expect(stationPlan.timetable).toBeDefined();
      expect(stationPlan.timetable.station).toBe('Berlin Hbf');
      expect(stationPlan.timetable.s).not.toBeUndefined();
      expect(stationPlan.timetable.s?.length).toBe(1);
      expect(stationPlan.timetable.s).not.toBeNull();

      const stop = stationPlan.timetable.s?.[0];
      expect(stop).toMatchObject({
        id: '7731476269399949882-2405150937-10',
        tl: {
          f: 'N',
          t: 'p',
          o: '800165',
          c: 'RE',
          n: '3112',
        },
        ar: {
          pt: '2405151021',
          pp: '12',
          l: '2',
          ppth: 'Nauen|Brieselang|Finkenkrug|Falkensee|Seegefeld|Albrechtshof|Berlin-Spandau|Berlin-Charlottenburg|Berlin Zoologischer Garten',
        },
        dp: {
          pt: '2405151023',
          pp: '12',
          l: '2',
          ppth: 'Berlin Friedrichstraße|Berlin Alexanderplatz|Berlin Ostbahnhof|Berlin Ostkreuz|Königs Wusterhausen|Brand Tropical Islands|Lübben(Spreewald)|Lübbenau(Spreewald)|Raddusch|Vetschau|Kolkwitz|Cottbus Hbf',
        },
      });
    });
  });
});
