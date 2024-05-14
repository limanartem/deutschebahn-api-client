# Overview
Library provides client wrapper for APIs provided by Deutschebahn. See https://developers.deutschebahn.com/db-api-marketplace/apis/product

# Supported APIs
* [timetable](https://developers.deutschebahn.com/db-api-marketplace/apis/product/timetables/api/26494#/Timetables_10213/overview)
* [RIS::Stations](https://developers.deutschebahn.com/db-api-marketplace/apis/product/ris-stations/api/ris-stations#/RISStations_1171/overview) (only for stations caching) 

# Tasks
* `build` - builds package and creates dist
* `test` - runs tests
* `stations-cache-update` - updates cached lists of stations. This requires API key which includes access to `RIS::Stations` API. Supports protobuf and json formatter to store data to file system. Pass `FORMAT=protobuf` (default), `FORMAT=json` or `FORMAT=protobuf,json` to change formatting options. E.g.
```
npm run stations-cache-update -- FORMAT=json
npm run stations-cache-update -- FORMAT=protobuf
npm run stations-cache-update -- FORMAT="protobuf,json"
```
  
# .env file
* `DB_API_CLIENT_ID` - client ID for DB account
* `DB_API_KEY` - secret key for DB account
* `DB_API_URL` - db api url

# Dependencies
* cross-fetch
* geolib
* protobufjs
* xml2js