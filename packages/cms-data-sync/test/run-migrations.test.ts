import * as contentfulManagement from 'contentful-management';
import { Space, WebHooks } from 'contentful-management';
import { runMigrations } from '../src/run-migrations';
import { BLUE_COLOR, RED_COLOR } from '../src/utils';

import { migrateTeams } from '../src/teams/teams.data-migration';
import { migrateExternalAuthors } from '../src/external-authors/external-authors.data-migration';
import { migrateCalendars } from '../src/calendars/calendars.data-migration';
import { migrateLabs } from '../src/labs/labs.data-migration';
import { migrateUsers } from '../src/users/users.data-migration';

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

var mockMigrateLabs: jest.MockedFunction<typeof migrateLabs>;

jest.mock('../src/labs/labs.data-migration', () => {
  mockMigrateLabs = jest.fn().mockReturnValue({});
  return {
    ...jest.requireActual('../src/labs/labs.data-migration'),
    migrateLabs: mockMigrateLabs,
  };
});

var mockMigrateUsers: jest.MockedFunction<typeof migrateUsers>;

jest.mock('../src/users/users.data-migration', () => {
  mockMigrateUsers = jest.fn().mockReturnValue({});
  return {
    ...jest.requireActual('../src/users/users.data-migration'),
    migrateUsers: mockMigrateUsers,
  };
});

const mockContentfulManagement = contentfulManagement as jest.Mocked<
  typeof contentfulManagement
>;

const webhookMock = {
  update: jest.fn(),
  active: true,
} as any as jest.Mocked<WebHooks>;

const mockedSetter = jest.fn();

Object.defineProperty(webhookMock, 'active', {
  set: mockedSetter,
});

webhookMock.update.mockResolvedValue(webhookMock);

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
    expect(mockedSetter).toHaveBeenNthCalledWith(1, false);

    expect(migrateTeams).toHaveBeenCalled();
    expect(migrateExternalAuthors).toHaveBeenCalled();
    expect(migrateCalendars).toHaveBeenCalled();
    expect(migrateLabs).toHaveBeenCalled();
    expect(migrateUsers).toHaveBeenCalled();

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      BLUE_COLOR,
      '[DEBUG] Webhook activated',
    );
    expect(mockedSetter).toHaveBeenNthCalledWith(2, true);
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
    expect(mockedSetter).toHaveBeenNthCalledWith(1, false);

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
    expect(mockedSetter).toHaveBeenNthCalledWith(2, true);
  });

  it('continues if webhook does not exist', async () => {
    spaceMock.getWebhook.mockRejectedValue(
      new Error(JSON.stringify({ status: 404 })),
    );

    await runMigrations();

    expect(webhookMock.update).not.toHaveBeenCalled();
    expect(migrateTeams).toHaveBeenCalled();
    expect(migrateExternalAuthors).toHaveBeenCalled();
    expect(migrateCalendars).toHaveBeenCalled();
    expect(migrateLabs).toHaveBeenCalled();
    expect(migrateUsers).toHaveBeenCalled();
  });

  it('rejects if disabling webhook fails with any other error', async () => {
    spaceMock.getWebhook.mockRejectedValue(
      new Error(JSON.stringify({ status: 500 })),
    );

    expect(async () => runMigrations()).rejects.toThrow();

    expect(migrateTeams).not.toHaveBeenCalled();
    expect(migrateExternalAuthors).not.toHaveBeenCalled();
    expect(migrateCalendars).not.toHaveBeenCalled();
    expect(migrateLabs).not.toHaveBeenCalled();
    expect(migrateUsers).not.toHaveBeenCalled();
  });

  it('rejects if disabling webhook fails with a non-Error', async () => {
    spaceMock.getWebhook.mockRejectedValue('not an Error');

    expect(async () => runMigrations()).rejects.toThrow();

    expect(migrateTeams).not.toHaveBeenCalled();
    expect(migrateExternalAuthors).not.toHaveBeenCalled();
    expect(migrateCalendars).not.toHaveBeenCalled();
    expect(migrateLabs).not.toHaveBeenCalled();
    expect(migrateUsers).not.toHaveBeenCalled();
  });
});
