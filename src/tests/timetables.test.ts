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
    const date = new Date();
    const time = 9,
      timeStr = time.toString().padStart(2, '0');
    const eva = 8000001;
    const dateStr = `${date.getFullYear().toString().slice(2)}${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;

    it('should return station timetable with multiple stops by station Eva, date and time', async () => {
      mockPool
        .intercept({
          path: `/api/timetables/v1/plan/${eva}/${dateStr}/${timeStr}`,
          method: 'GET',
        })
        .reply(200, () => mockData.timetables.timetableMultiple)
        .persist();

      const stationPlan = await getStationPlan(eva, { date, time1: time });

      expect(stationPlan.timetable).toBeDefined();
      expect(stationPlan.timetable?.stationName).toBe('Berlin Hbf');
      expect(stationPlan.timetable?.stops).not.toBeUndefined();
      expect(stationPlan.timetable?.stops).not.toBeNull();

      const stop = stationPlan.timetable?.stops?.[0];
      expect(stop).toMatchObject({
        id: '7731476269399949882-2405150937-10',
        tripLabel: {
          flags: 'N',
          type: 'p',
          owner: '800165',
          category: 'RE',
          number: '3112',
        },
        arrivalEvent: {
          plannedTime: '2405151021',
          plannedPlatform: '12',
          line: '2',
          plannedPath:
            'Nauen|Brieselang|Finkenkrug|Falkensee|Seegefeld|Albrechtshof|Berlin-Spandau|Berlin-Charlottenburg|Berlin Zoologischer Garten',
        },
        departureEvent: {
          plannedTime: '2405151023',
          plannedPlatform: '12',
          line: '2',
          plannedPath:
            'Berlin Friedrichstraße|Berlin Alexanderplatz|Berlin Ostbahnhof|Berlin Ostkreuz|Königs Wusterhausen|Brand Tropical Islands|Lübben(Spreewald)|Lübbenau(Spreewald)|Raddusch|Vetschau|Kolkwitz|Cottbus Hbf',
        },
      });
    });

    it('should return station timetable with single stop by station Eva, date and time', async () => {
      mockPool
        .intercept({
          path: `/api/timetables/v1/plan/${eva}/${dateStr}/${timeStr}`,
          method: 'GET',
        })
        .reply(200, () => mockData.timetables.timetableSingle)
        .persist();

      const stationPlan = await getStationPlan(eva, { date, time1: time });

      expect(stationPlan.timetable).toBeDefined();
      expect(stationPlan.timetable).toBeDefined();
      expect(stationPlan.timetable?.stationName).toBe('Berlin Hbf');
      expect(stationPlan.timetable?.stops).not.toBeUndefined();
      expect(stationPlan.timetable?.stops).not.toBeNull();

      const stop = stationPlan.timetable?.stops?.[0];
      expect(stop).toMatchObject({
        id: '7731476269399949882-2405150937-10',
        tripLabel: {
          flags: 'N',
          type: 'p',
          owner: '800165',
          category: 'RE',
          number: '3112',
        },
        arrivalEvent: {
          plannedTime: '2405151021',
          plannedPlatform: '12',
          line: '2',
          plannedPath:
            'Nauen|Brieselang|Finkenkrug|Falkensee|Seegefeld|Albrechtshof|Berlin-Spandau|Berlin-Charlottenburg|Berlin Zoologischer Garten',
        },
        departureEvent: {
          plannedTime: '2405151023',
          plannedPlatform: '12',
          line: '2',
          plannedPath:
            'Berlin Friedrichstraße|Berlin Alexanderplatz|Berlin Ostbahnhof|Berlin Ostkreuz|Königs Wusterhausen|Brand Tropical Islands|Lübben(Spreewald)|Lübbenau(Spreewald)|Raddusch|Vetschau|Kolkwitz|Cottbus Hbf',
        },
      });
    });
  });
});
