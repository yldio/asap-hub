import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests/frontend',
  testMatch: '**/*.e2e-test.{js,jsx,ts,tsx}',
  expect: {
    timeout: 10000,
  },
};
export default config;
