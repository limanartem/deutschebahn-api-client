import type { Config } from '@jest/types';
import fs from 'fs';
import path from 'path';

const rootDir = path.join(__dirname, '/src/.jest/');

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
  setupFiles: fs.readdirSync(rootDir).map((file) => path.join(rootDir, file)),
  testEnvironment: 'node',
  runner: 'groups',
};

export default config;
