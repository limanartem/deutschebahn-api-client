import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  //collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  detectOpenHandles: true,
  verbose: true,
  passWithNoTests: true,
  roots: ['src/'],
  forceExit: true,
};

export default config;
