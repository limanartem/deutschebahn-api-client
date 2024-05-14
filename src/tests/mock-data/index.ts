import fs from 'fs';

export const mockData = {
  timetables: {
    station: fs.readFileSync('src/tests/mock-data/timetables-station.xml'),
    stations: fs.readFileSync('src/tests/mock-data/timetables-stations.xml'),
  },
};
