import type { Config } from '@jest/types';
import * as path from 'path';

const config: Config.InitialOptions = {
  collectCoverage: false,
  detectOpenHandles: true,
  globalTeardown: './jest/global-teardown.ts',
  preset: 'ts-jest',
  rootDir: path.resolve(),
  roots: ['./test/e2e'],
  runner: 'groups',
  setupFilesAfterEnv: [
    './jest/jest-default-timeout.ts',
    './jest/jest-global-setup.ts',
    './jest/jest-retry-setup.ts',
  ],
  testEnvironment: './jest/custom-environment.ts',
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.[t]s$': [
      'ts-jest',
      { diagnostics: false, tsconfig: './tsconfig.json' },
    ],
  },
  verbose: false,
  // watchPlugins: ['./jest/jest-plugs.ts'],
};

export default config;
