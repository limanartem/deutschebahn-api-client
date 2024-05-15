import { parseNumbers } from 'xml2js/lib/processors';
import { StationResponse, PlanResponse } from '../models/timetables';
import xml2js from 'xml2js';

const { DB_API_URL } = process.env;

/**
 * Retrieves station information based on the provided pattern.
 * @param pattern - The pattern to search for stations.
 * @returns A Promise that resolves to a StationResponse object.
 * @throws An error if the request to fetch stations fails.
 */
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
    // Single station was returned so xml2js did not parse it as an array
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

type DateTime = {
  date: Date;
  time1: number;
};

/**
 * Retrieves the station plan for a given station and date-time.
 *
 * @param stationEva - The EVA number of the station.
 * @param dateTime - The date and time for which to retrieve the station plan.
 * @returns A Promise that resolves to the station plan response.
 * @throws An error if the station plan retrieval fails.
 */
export const getStationPlan = async (
  stationEva: number,
  { date, time1 }: DateTime,
): Promise<PlanResponse> => {
  const timeStr = time1.toString().padStart(2, '0');
  const dateStr = `${date.getFullYear().toString().slice(2)}${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;

  const response = await fetch(
    `${DB_API_URL}/api/timetables/v1/plan/${stationEva}/${dateStr}/${timeStr}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch station plan');
  }
  const xmlData = await response.text();
  const data = await xml2js.parseStringPromise(xmlData, {
    mergeAttrs: true,
    ignoreAttrs: false,
    explicitArray: false,
  });

  if (Array.isArray(data.timetable?.s)) {
    return data;
  } else {
    // Single timestop was returned so xml2js did not parse it as an array
    return {
      timetable: {
        station: data.timetable.station,
        s: [
          {
            ...data.timetable.s,
          },
        ],
      },
    };
  }
};
