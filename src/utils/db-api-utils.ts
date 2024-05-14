export const getAuthHeaders = () => {
  const { DB_API_CLIENT_ID, DB_API_KEY } = process.env;
  if (!DB_API_CLIENT_ID || !DB_API_KEY) {
    throw new Error('Missing environment variables!');
  }

  return {
    'db-api-key': DB_API_KEY!,
    'db-client-id': DB_API_CLIENT_ID!,
  };
};
