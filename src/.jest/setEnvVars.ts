if (process.env.JEST_GROUP_INTEGRATION == null) {
  process.env.DB_API_URL = 'http://127.0.0.1:5002';
  process.env.DB_API_CLIENT_ID = 'test';
  process.env.DB_API_KEY = 'test';
}
