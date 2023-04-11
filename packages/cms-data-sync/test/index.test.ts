import * as contentfulManagement from 'contentful-management';
import { Space, WebHooks } from 'contentful-management';
import { runMigrations } from '../src/index';
import { BLUE_COLOR, RED_COLOR } from '../src/utils';

import { migrateTeams } from '../src/teams/teams.data-migration';
import { migrateExternalAuthors } from '../src/external-authors/external-authors.data-migration';
import { migrateCalendars } from '../src/calendars/calendars.data-migration';

jest.mock('contentful-management');

var mockMigrateTeams: jest.MockedFunction<typeof migrateTeams>;

jest.mock('../src/teams/teams.data-migration', () => {
  mockMigrateTeams = jest.fn().mockReturnValue({});
  return {
    ...jest.requireActual('../src/teams/teams.data-migration'),
    migrateTeams: mockMigrateTeams,
  };
});

var mockMigrateExternalAuthors: jest.MockedFunction<
  typeof migrateExternalAuthors
>;

jest.mock('../src/external-authors/external-authors.data-migration', () => {
  mockMigrateExternalAuthors = jest.fn().mockReturnValue({});
  return {
    ...jest.requireActual(
      '../src/external-authors/external-authors.data-migration',
    ),
    migrateExternalAuthors: mockMigrateExternalAuthors,
  };
});

var mockMigrateCalendars: jest.MockedFunction<typeof migrateCalendars>;

jest.mock('../src/calendars/calendars.data-migration', () => {
  mockMigrateCalendars = jest.fn().mockReturnValue({});
  return {
    ...jest.requireActual('../src/calendars/calendars.data-migration'),
    migrateCalendars: mockMigrateCalendars,
  };
});

const mockContentfulManagement = contentfulManagement as jest.Mocked<
  typeof contentfulManagement
>;

const webhookMock = {
  update: jest.fn(),
  active: true,
} as any as jest.Mocked<WebHooks>;

const spaceMock = {
  getWebhook: jest.fn().mockResolvedValue(webhookMock),
} as any as jest.Mocked<Space>;

const getSpaceFn = jest.fn().mockResolvedValue(spaceMock);
mockContentfulManagement.createClient.mockReturnValue({
  getSpace: getSpaceFn,
} as any as jest.Mocked<contentfulManagement.PlainClientAPI>);

describe('Migrations', () => {
  const consoleLogRef = console.log;

  beforeEach(() => {
    console.log = jest.fn();
    process.env.CONTENTFUL_ENV_ID = 'crn-env-id';
    process.env.VERBOSE_DATA_SYNC = 'true';
    jest.clearAllMocks();
  });

  afterAll(() => {
    console.log = consoleLogRef;
  });

  it('deactivates webhook and activates it again after running the migrations', async () => {
    await runMigrations();

    expect(spaceMock.getWebhook).toHaveBeenCalledWith('crn-env-id-webhook');
    expect(webhookMock.update).toHaveBeenCalled();
    expect(console.log).toHaveBeenNthCalledWith(
      1,
      BLUE_COLOR,
      '[DEBUG] Webhook deactivated',
    );

    expect(migrateTeams).toHaveBeenCalled();
    expect(migrateExternalAuthors).toHaveBeenCalled();
    expect(migrateCalendars).toHaveBeenCalled();

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      BLUE_COLOR,
      '[DEBUG] Webhook activated',
    );
    expect(webhookMock.active).toEqual(true);
  });

  it('activates webhook back even if some migration failed', async () => {
    mockMigrateExternalAuthors.mockRejectedValueOnce(new Error('ops'));

    await expect(runMigrations()).rejects.toThrowError('ops');

    expect(spaceMock.getWebhook).toHaveBeenCalledWith('crn-env-id-webhook');
    expect(webhookMock.update).toHaveBeenCalled();
    expect(console.log).toHaveBeenNthCalledWith(
      1,
      BLUE_COLOR,
      '[DEBUG] Webhook deactivated',
    );

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      RED_COLOR,
      '[ERROR] Error migrating data',
    );

    expect(console.log).toHaveBeenNthCalledWith(
      3,
      BLUE_COLOR,
      '[DEBUG] Webhook activated',
    );
  });
});
