import { parseNumbers } from 'xml2js/lib/processors';
import { StationResponse, Timetable } from '../models/timetables';
import xml2js from 'xml2js';

const { DB_API_URL } = process.env;

export const getStation = async (pattern: string): Promise<StationResponse> => {
  const response = await fetch(
    `${DB_API_URL}/timetables/v1/station/${encodeURIComponent(pattern)}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch stations');
  }
  const xmlData = await response.text();
  const data = await xml2js.parseStringPromise(xmlData, {
    mergeAttrs: true,
    ignoreAttrs: false,
    explicitArray: false,
    valueProcessors: [parseNumbers],
    attrValueProcessors: [parseNumbers],
  });

  if (Array.isArray(data.stations.station)) {
    return data;
  } else {
    // Single station was return so xml2js did not parse it as an array
    return {
      stations: {
        station: [
          {
            ...data.stations.station,
          },
        ],
      },
    };
  }
};

export const getStationPlan = async (stationEva: number): Promise<Timetable> => {
  const response = await fetch(`${DB_API_URL}/api/stations/${stationEva}/plan`);
  if (!response.ok) {
    throw new Error('Failed to fetch station plan');
  }
  return response.json();
};
