import { getStation, getStationPlan } from '../services/timetables';
import { mockData } from './mock-data';
import fetch from 'cross-fetch';

jest.mock('cross-fetch', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const { DB_API_URL } = process.env;

const mockResponse = ({ text, json }: { text?: string | Buffer; json?: string | Buffer }) => {
  (fetch as jest.Mock).mockImplementation(
    () =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(text),
        json: () => Promise.resolve(json),
      }) as any,
  );
};

describe('timetables', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getStation', () => {
    it('should return single station by pattern', async () => {
      mockResponse({ text: mockData.timetables.station });

      const stations = await getStation('BLS');

      expect(fetch).toHaveBeenCalledWith(`${DB_API_URL}/timetables/v1/station/BLS`, {
        method: 'GET',
        headers: expect.objectContaining({
          'db-api-key': expect.any(String),
          'db-client-id': expect.any(String),
        }),
      });
      expect(stations.stations.station).toHaveLength(1);
      expect(stations.stations.station[0].name).toBe('Berlin Hbf');
      expect(stations.stations.station[0].eva).toBe(8011160);
    });

    it('should return multiple stations by pattern', async () => {
      mockResponse({ text: mockData.timetables.stations });

      const stations = await getStation('BLS');

      expect(fetch).toHaveBeenCalledWith(`${DB_API_URL}/timetables/v1/station/BLS`, {
        method: 'GET',
        headers: expect.objectContaining({
          'db-api-key': expect.any(String),
          'db-client-id': expect.any(String),
        }),
      });
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
      mockResponse({ text: mockData.timetables.timetableMultiple });

      const stationPlan = await getStationPlan(eva, { date, time1: time });

      expect(fetch).toHaveBeenCalledWith(
        `${DB_API_URL}/timetables/v1/plan/${eva}/${dateStr}/${timeStr}`,
        {
          method: 'GET',
          headers: expect.objectContaining({
            'db-api-key': expect.any(String),
            'db-client-id': expect.any(String),
          }),
        },
      );

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
      mockResponse({ text: mockData.timetables.timetableSingle });

      const stationPlan = await getStationPlan(eva, { date, time1: time });

      expect(fetch).toHaveBeenCalledWith(
        `${DB_API_URL}/timetables/v1/plan/${eva}/${dateStr}/${timeStr}`,
        {
          method: 'GET',
          headers: expect.objectContaining({
            'db-api-key': expect.any(String),
            'db-client-id': expect.any(String),
          }),
        },
      );
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
