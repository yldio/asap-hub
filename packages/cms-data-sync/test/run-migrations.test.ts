/* eslint-disable vars-on-top, @typescript-eslint/no-explicit-any, no-console, jest/valid-expect */
import * as contentfulManagement from 'contentful-management';
import {
  Collection,
  Space,
  WebhookProps,
  WebHooks,
} from 'contentful-management';
import { runMigrations } from '../src/run-migrations';
import { BLUE_COLOR, RED_COLOR } from '../src/utils';

import { migrateTeams } from '../src/teams/teams.data-migration';
import { migrateTeamProposals } from '../src/teams/teams-proposals.data-migration';
import { migrateExternalAuthors } from '../src/external-authors/external-authors.data-migration';
import { migrateEvents } from '../src/events/events.data-migration';
import { migrateCalendars } from '../src/calendars/calendars.data-migration';
import { migrateLabs } from '../src/labs/labs.data-migration';
import { migrateUsers } from '../src/users/users.data-migration';
import { migrateInterestGroups } from '../src/interest-groups/interest-groups.data-migration';
import { migrateWorkingGroups } from '../src/working-groups/working-groups.data-migration';
import { migrateTutorials } from '../src/tutorials/tutorials.data-migration';
import { migrateDiscover } from '../src/discover/discover.data-migration';
import { migrateResearchTags } from '../src/research-tags/research-tags.data-migration';
import { migrateResearchOutputs } from '../src/research-outputs/research-outputs.data-migration';

jest.mock('contentful-management');

var mockMigrateTeams: jest.MockedFunction<typeof migrateTeams>;

jest.mock('../src/teams/teams.data-migration', () => {
  mockMigrateTeams = jest.fn().mockReturnValue({});
  return {
    ...jest.requireActual('../src/teams/teams.data-migration'),
    migrateTeams: mockMigrateTeams,
  };
});

var mockMigrateTeamProposals: jest.MockedFunction<typeof migrateTeamProposals>;

jest.mock('../src/teams/teams-proposals.data-migration', () => {
  mockMigrateTeamProposals = jest.fn().mockReturnValue({});
  return {
    ...jest.requireActual('../src/teams/teams-proposals.data-migration'),
    migrateTeamProposals: mockMigrateTeamProposals,
  };
});

var mockMigrateEvents: jest.MockedFunction<typeof migrateEvents>;

jest.mock('../src/events/events.data-migration', () => {
  mockMigrateEvents = jest.fn().mockReturnValue({});
  return {
    ...jest.requireActual('../src/events/events.data-migration'),
    migrateEvents: mockMigrateEvents,
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

var mockMigrateInterestGroups: jest.MockedFunction<
  typeof migrateInterestGroups
>;

jest.mock('../src/interest-groups/interest-groups.data-migration', () => {
  mockMigrateInterestGroups = jest.fn().mockReturnValue({});
  return {
    ...jest.requireActual(
      '../src/interest-groups/interest-groups.data-migration',
    ),
    migrateInterestGroups: mockMigrateInterestGroups,
  };
});

var mockMigrateWorkingGroups: jest.MockedFunction<typeof migrateWorkingGroups>;

jest.mock('../src/working-groups/working-groups.data-migration', () => {
  mockMigrateWorkingGroups = jest.fn().mockReturnValue({});
  return {
    ...jest.requireActual(
      '../src/working-groups/working-groups.data-migration',
    ),
    migrateWorkingGroups: mockMigrateWorkingGroups,
  };
});

var mockMigrateTutorials: jest.MockedFunction<typeof migrateTutorials>;

jest.mock('../src/tutorials/tutorials.data-migration', () => {
  mockMigrateTutorials = jest.fn().mockReturnValue({});
  return {
    ...jest.requireActual('../src/tutorials/tutorials.data-migration'),
    migrateTutorials: mockMigrateTutorials,
  };
});

var mockMigrateDiscover: jest.MockedFunction<typeof migrateDiscover>;

jest.mock('../src/discover/discover.data-migration', () => {
  mockMigrateDiscover = jest.fn().mockReturnValue({});
  return {
    ...jest.requireActual('../src/discover/discover.data-migration'),
    migrateDiscover: mockMigrateDiscover,
  };
});

var mockMigrateResearchTags: jest.MockedFunction<typeof migrateResearchTags>;

jest.mock('../src/research-tags/research-tags.data-migration', () => {
  mockMigrateResearchTags = jest.fn().mockReturnValue({});
  return {
    ...jest.requireActual('../src/research-tags/research-tags.data-migration'),
    migrateResearchTags: mockMigrateResearchTags,
  };
});

var mockMigrateResearchOutputs: jest.MockedFunction<
  typeof migrateResearchOutputs
>;

jest.mock('../src/research-outputs/research-outputs.data-migration', () => {
  mockMigrateResearchOutputs = jest.fn().mockReturnValue({});
  return {
    ...jest.requireActual(
      '../src/research-outputs/research-outputs.data-migration',
    ),
    migrateResearchOutputs: mockMigrateResearchOutputs,
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
  getWebhooks: jest.fn(),
} as any as jest.Mocked<Space>;

const getSpaceFn = jest.fn().mockResolvedValue(spaceMock);
mockContentfulManagement.createClient.mockReturnValue({
  getSpace: getSpaceFn,
} as any as jest.Mocked<contentfulManagement.PlainClientAPI>);

describe('Migrations', () => {
  const consoleLogRef = console.log;
  const currentEnvName = 'crn-env-id';

  beforeEach(() => {
    console.log = jest.fn();
    process.env.CONTENTFUL_ENV_ID = currentEnvName;
    process.env.VERBOSE_DATA_SYNC = 'true';
    jest.clearAllMocks();
  });

  afterAll(() => {
    console.log = consoleLogRef;
  });

  it('runs all migrations if flag with value `all` is passed', async () => {
    spaceMock.getWebhooks.mockResolvedValue({
      items: [],
    } as unknown as Collection<WebHooks, WebhookProps>);

    await runMigrations('--all');

    expect(migrateTeams).toHaveBeenCalled();
    expect(migrateExternalAuthors).toHaveBeenCalled();
    expect(migrateCalendars).toHaveBeenCalled();
    expect(migrateLabs).toHaveBeenCalled();
    expect(migrateUsers).toHaveBeenCalled();
    expect(migrateInterestGroups).toHaveBeenCalled();
    expect(migrateWorkingGroups).toHaveBeenCalled();
    expect(migrateTutorials).toHaveBeenCalled();
    expect(migrateDiscover).toHaveBeenCalled();
    expect(migrateResearchTags).toHaveBeenCalled();
    expect(migrateResearchOutputs).toHaveBeenCalled();
    expect(migrateTeamProposals).toHaveBeenCalled();
  });

  it('runs only a subset of migrations if flags are passed', async () => {
    spaceMock.getWebhooks.mockResolvedValue({
      items: [],
    } as unknown as Collection<WebHooks, WebhookProps>);

    await runMigrations('--teams');

    expect(migrateTeams).toHaveBeenCalled();
    expect(migrateExternalAuthors).not.toHaveBeenCalled();
    expect(migrateCalendars).not.toHaveBeenCalled();
    expect(migrateLabs).not.toHaveBeenCalled();
    expect(migrateUsers).not.toHaveBeenCalled();
    expect(migrateInterestGroups).not.toHaveBeenCalled();
    expect(migrateWorkingGroups).not.toHaveBeenCalled();
    expect(migrateTutorials).not.toHaveBeenCalled();
    expect(migrateDiscover).not.toHaveBeenCalled();
    expect(migrateResearchTags).not.toHaveBeenCalled();
    expect(migrateResearchOutputs).not.toHaveBeenCalled();
    expect(migrateTeamProposals).not.toHaveBeenCalled();
  });

  it('deactivates webhook and activates it again after running the migrations', async () => {
    const mockedTestEnvSetter = jest.fn();
    const testEnvWebhook = {
      update: jest.fn(),
      active: true,
      filters: [
        {
          equals: [
            {
              doc: 'sys.environment.sys.id',
            },
            currentEnvName,
          ],
        },
      ],
    };
    testEnvWebhook.update.mockResolvedValue(testEnvWebhook);
    Object.defineProperty(testEnvWebhook, 'active', {
      set: mockedTestEnvSetter,
    });
    const webhooks = [testEnvWebhook];
    spaceMock.getWebhooks.mockResolvedValue({
      items: webhooks,
    } as unknown as Collection<WebHooks, WebhookProps>);

    await runMigrations();

    expect(mockedTestEnvSetter).toHaveBeenNthCalledWith(1, false);
    expect(console.log).toHaveBeenNthCalledWith(
      1,
      BLUE_COLOR,
      '[DEBUG] Webhooks deactivated',
    );

    expect(migrateTeams).toHaveBeenCalled();
    expect(migrateExternalAuthors).toHaveBeenCalled();
    expect(migrateCalendars).toHaveBeenCalled();
    expect(migrateLabs).toHaveBeenCalled();
    expect(migrateUsers).toHaveBeenCalled();
    expect(migrateInterestGroups).toHaveBeenCalled();
    expect(migrateWorkingGroups).toHaveBeenCalled();
    expect(migrateTutorials).toHaveBeenCalled();
    expect(migrateDiscover).toHaveBeenCalled();
    expect(migrateResearchTags).toHaveBeenCalled();
    expect(migrateResearchOutputs).toHaveBeenCalled();
    expect(migrateTeamProposals).toHaveBeenCalled();

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      BLUE_COLOR,
      '[DEBUG] Webhooks activated',
    );
    expect(mockedTestEnvSetter).toHaveBeenNthCalledWith(2, true);
    expect(testEnvWebhook.update).toHaveBeenCalledTimes(2);
  });

  it('deactivates only the webhooks associated with the current environment', async () => {
    const mockedTestEnvSetter = jest.fn();
    const testEnvWebhook = {
      update: jest.fn(),
      active: true,
      filters: [
        {
          equals: [
            {
              doc: 'sys.environment.sys.id',
            },
            currentEnvName,
          ],
        },
      ],
    };
    testEnvWebhook.update.mockResolvedValue(testEnvWebhook);
    Object.defineProperty(testEnvWebhook, 'active', {
      set: mockedTestEnvSetter,
    });
    const devEnvWebhook = {
      update: jest.fn(),
      active: true,
      filters: [
        {
          equals: [
            {
              doc: 'sys.environment.sys.id',
            },
            'Development',
          ],
        },
      ],
    };
    const webhooks = [testEnvWebhook, devEnvWebhook];
    spaceMock.getWebhooks.mockResolvedValue({
      items: webhooks,
    } as unknown as Collection<WebHooks, WebhookProps>);

    await runMigrations();

    expect(mockedTestEnvSetter).toHaveBeenNthCalledWith(1, false);

    expect(migrateTeams).toHaveBeenCalled();
    expect(migrateExternalAuthors).toHaveBeenCalled();
    expect(migrateCalendars).toHaveBeenCalled();
    expect(migrateLabs).toHaveBeenCalled();
    expect(migrateUsers).toHaveBeenCalled();
    expect(migrateInterestGroups).toHaveBeenCalled();
    expect(migrateWorkingGroups).toHaveBeenCalled();
    expect(migrateTutorials).toHaveBeenCalled();
    expect(migrateDiscover).toHaveBeenCalled();
    expect(migrateResearchTags).toHaveBeenCalled();
    expect(migrateResearchOutputs).toHaveBeenCalled();
    expect(migrateTeamProposals).toHaveBeenCalled();

    expect(mockedTestEnvSetter).toHaveBeenNthCalledWith(2, true);
    expect(testEnvWebhook.update).toHaveBeenCalledTimes(2);
    expect(devEnvWebhook.update).not.toHaveBeenCalled();
  });

  it('deactivates all webhooks even if one of them fails to update', async () => {
    const mockedTestEnvSetter = jest.fn();
    const testEnvWebhook = {
      name: 'some-test-webhook',
      update: jest.fn(),
      active: true,
      filters: [
        {
          equals: [
            {
              doc: 'sys.environment.sys.id',
            },
            currentEnvName,
          ],
        },
      ],
    };
    Object.defineProperty(testEnvWebhook, 'active', {
      set: mockedTestEnvSetter,
    });
    const mockedTestEnvSetter2 = jest.fn();
    const testEnvWebhook2 = {
      name: 'other-test-webhook',
      update: jest.fn(),
      active: true,
      filters: [
        {
          equals: [
            {
              doc: 'sys.environment.sys.id',
            },
            currentEnvName,
          ],
        },
      ],
    };
    testEnvWebhook.update.mockResolvedValueOnce(testEnvWebhook);
    // throw on the second update call when trying to activate the webhook
    testEnvWebhook.update.mockRejectedValueOnce(new Error());
    testEnvWebhook2.update.mockResolvedValue(testEnvWebhook2);

    Object.defineProperty(testEnvWebhook2, 'active', {
      set: mockedTestEnvSetter2,
    });
    const webhooks = [testEnvWebhook, testEnvWebhook2];
    spaceMock.getWebhooks.mockResolvedValue({
      items: webhooks,
    } as unknown as Collection<WebHooks, WebhookProps>);

    await runMigrations();

    expect(mockedTestEnvSetter).toHaveBeenNthCalledWith(1, false);
    expect(mockedTestEnvSetter2).toHaveBeenNthCalledWith(1, false);

    expect(migrateTeams).toHaveBeenCalled();
    expect(migrateExternalAuthors).toHaveBeenCalled();
    expect(migrateCalendars).toHaveBeenCalled();
    expect(migrateLabs).toHaveBeenCalled();
    expect(migrateUsers).toHaveBeenCalled();
    expect(migrateInterestGroups).toHaveBeenCalled();
    expect(migrateWorkingGroups).toHaveBeenCalled();
    expect(migrateTutorials).toHaveBeenCalled();
    expect(migrateDiscover).toHaveBeenCalled();
    expect(migrateResearchTags).toHaveBeenCalled();
    expect(migrateResearchOutputs).toHaveBeenCalled();
    expect(migrateTeamProposals).toHaveBeenCalled();

    expect(mockedTestEnvSetter).toHaveBeenNthCalledWith(2, true);
    expect(testEnvWebhook.update).toHaveBeenCalledTimes(2);
    expect(testEnvWebhook2.update).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenNthCalledWith(
      2,
      RED_COLOR,
      '[ERROR] Error reactivating webhook some-test-webhook',
    );
  });

  it('activates webhook back even if some migration failed', async () => {
    const mockedTestEnvSetter = jest.fn();
    const testEnvWebhook = {
      update: jest.fn(),
      active: true,
      filters: [
        {
          equals: [
            {
              doc: 'sys.environment.sys.id',
            },
            currentEnvName,
          ],
        },
      ],
    };
    testEnvWebhook.update.mockResolvedValue(testEnvWebhook);
    Object.defineProperty(testEnvWebhook, 'active', {
      set: mockedTestEnvSetter,
    });
    const webhooks = [testEnvWebhook];
    spaceMock.getWebhooks.mockResolvedValue({
      items: webhooks,
    } as unknown as Collection<WebHooks, WebhookProps>);

    mockMigrateExternalAuthors.mockRejectedValueOnce(new Error('whoops'));

    await expect(runMigrations()).rejects.toThrowError('whoops');

    expect(mockedTestEnvSetter).toHaveBeenNthCalledWith(1, false);
    expect(console.log).toHaveBeenNthCalledWith(
      1,
      BLUE_COLOR,
      '[DEBUG] Webhooks deactivated',
    );
    expect(console.log).toHaveBeenNthCalledWith(
      2,
      RED_COLOR,
      '[ERROR] Error migrating data',
    );
    expect(mockedTestEnvSetter).toHaveBeenNthCalledWith(2, true);
    expect(console.log).toHaveBeenNthCalledWith(
      3,
      BLUE_COLOR,
      '[DEBUG] Webhooks activated',
    );
    expect(testEnvWebhook.update).toHaveBeenCalledTimes(2);
  });

  it('rejects if disabling webhook fails with any other error', async () => {
    spaceMock.getWebhooks.mockRejectedValue(
      new Error(JSON.stringify({ status: 500 })),
    );

    await expect(runMigrations()).rejects.toThrow();

    expect(migrateTeams).not.toHaveBeenCalled();
    expect(migrateExternalAuthors).not.toHaveBeenCalled();
    expect(migrateCalendars).not.toHaveBeenCalled();
    expect(migrateLabs).not.toHaveBeenCalled();
    expect(migrateUsers).not.toHaveBeenCalled();
    expect(migrateInterestGroups).not.toHaveBeenCalled();
    expect(migrateWorkingGroups).not.toHaveBeenCalled();
    expect(migrateTutorials).not.toHaveBeenCalled();
    expect(migrateDiscover).not.toHaveBeenCalled();
    expect(migrateResearchTags).not.toHaveBeenCalled();
    expect(migrateResearchOutputs).not.toHaveBeenCalled();
    expect(migrateTeamProposals).not.toHaveBeenCalled();
  });

  it('rejects if disabling webhook fails with a non-Error', async () => {
    spaceMock.getWebhooks.mockRejectedValue('not an Error');

    await expect(runMigrations()).rejects.toThrow();

    expect(migrateTeams).not.toHaveBeenCalled();
    expect(migrateExternalAuthors).not.toHaveBeenCalled();
    expect(migrateCalendars).not.toHaveBeenCalled();
    expect(migrateLabs).not.toHaveBeenCalled();
    expect(migrateUsers).not.toHaveBeenCalled();
    expect(migrateInterestGroups).not.toHaveBeenCalled();
    expect(migrateWorkingGroups).not.toHaveBeenCalled();
    expect(migrateTutorials).not.toHaveBeenCalled();
    expect(migrateDiscover).not.toHaveBeenCalled();
    expect(migrateResearchTags).not.toHaveBeenCalled();
    expect(migrateResearchOutputs).not.toHaveBeenCalled();
    expect(migrateTeamProposals).not.toHaveBeenCalled();
  });
});
