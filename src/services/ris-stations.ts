import { getAuthHeaders } from '../utils/db-api-utils';
import { RootObject } from '../models/ris-stations';
import fetch from 'cross-fetch';

const { DB_API_URL } = process.env;

const getStations = async () => {
  if (!DB_API_URL) {
    throw new Error('Missing environment variable DB_API_URL!');
  }

  const url = `${DB_API_URL}/ris-stations/v1/stations?limit=6000`;
  console.log('Fetching stations from:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch stations: ' + (await response.text()));
  }

  return (await response.json()) as RootObject;
};

export default getStations;
