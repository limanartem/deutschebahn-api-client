// Suppress console.log in tests
const { SUPPRESS_JEST_LOG = 'true' } = process.env;

if (SUPPRESS_JEST_LOG === 'true') {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
}


export {};
