import express, { Express } from 'express';
import { appFactory } from '../../../src/app';
import { decodeTokenFactory } from '@asap-hub/server-common';
import { UserFixture } from '../fixtures';

jest.mock('../../../src/config', () => ({
  ...jest.requireActual('../../../src/config'),
  isContentfulEnabledV2:
    process.env.INTEGRATION_TEST_CMS === 'contentful' ? 'true' : undefined,
  logLevel: process.env.TEST_LOG_LEVEL || 'error',
}));

jest.mock('@asap-hub/server-common', () => ({
  ...jest.requireActual('@asap-hub/server-common'),
  decodeTokenFactory: jest.fn(),
}));

export const AppHelper = (getUser: () => UserFixture): Express => {
  const mockDecodeTokenFactory = jest.mocked(decodeTokenFactory);
  mockDecodeTokenFactory.mockImplementation(
    () => (sub) => Promise.resolve({ sub }),
  );
  const app = express();
  app.use((req, _res, next) => {
    req.headers.authorization = `bearer ${getUser()?.connections?.[0]?.code}`;
    next();
  });
  app.use(appFactory());
  return app;
};
