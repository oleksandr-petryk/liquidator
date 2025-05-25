import type { Config } from '@jest/types';
import * as path from 'path';

const config: Config.InitialOptions = {
  collectCoverage: true,
  collectCoverageFrom: ['./src/shared/utils/**/*', '!**/*.test.ts'],
  coverageDirectory: './test/unit/coverage',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  detectOpenHandles: true,
  globalTeardown: './jest/global-teardown.ts',
  preset: 'ts-jest',
  rootDir: path.resolve(),
  roots: ['./test/unit'],
  runner: 'groups',
  setupFilesAfterEnv: [
    './jest/jestDefaultTimeout.ts',
    './jest/jestGlobalSetup.ts',
    './jest/jest-retry-setup.ts',
  ],
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.[t]s$': [
      'ts-jest',
      { diagnostics: false, tsconfig: './tsconfig.json' },
    ],
  },
  verbose: false,
};

export default config;
