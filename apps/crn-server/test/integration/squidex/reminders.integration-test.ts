import {
  DraftResearchOutputCreateDataObject,
  FetchRemindersOptions,
  PublishedResearchOutputCreateDataObject,
  ResearchOutputDraftReminder,
  ResearchOutputInReviewReminder,
  ResearchOutputPublishedReminder,
  TeamRole,
  UserCreateDataObject,
} from '@asap-hub/model';
import {
  InputUser,
  InputWorkingGroup,
  RestResearchOutput,
  RestTeam,
  RestUser,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import { Chance } from 'chance';
import { appName, baseUrl } from '../../../src/config';
import { ReminderSquidexDataProvider } from '../../../src/data-providers/reminder.data-provider';
import { ResearchOutputSquidexDataProvider } from '../../../src/data-providers/research-output.data-provider';
import { TeamSquidexDataProvider } from '../../../src/data-providers/team.data-provider';
import { UserSquidexDataProvider } from '../../../src/data-providers/user.data-provider';
import { getAuthToken } from '../../../src/utils/auth';
import { getResearchOutputCreateDataObject } from '../../fixtures/research-output.fixtures';
import { getTeamCreateDataObject } from '../../fixtures/teams.fixtures';
import { getUserCreateDataObject } from '../../fixtures/users.fixtures';
import { createRandomOrcid } from '../../helpers/users';
import { teardownHelper } from '../../helpers/teardown';
import { retryable } from '../../helpers/retryable';

jest.setTimeout(120000);

describe('Reminders', () => {
  const chance = new Chance();
  const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
    appName,
    baseUrl,
  });
  const researchOutputRestClient = new SquidexRest<RestResearchOutput>(
    getAuthToken,
    'research-outputs',
    { appName, baseUrl },
  );

  const workingGroupRestClient = new SquidexRest<InputWorkingGroup>(
    getAuthToken,
    'working-groups',
    { appName, baseUrl },
  );
  const teamRestClient = new SquidexRest<RestTeam>(getAuthToken, 'teams', {
    appName,
    baseUrl,
  });
  const userRestClient = new SquidexRest<RestUser, InputUser>(
    getAuthToken,
    'users',
    {
      appName,
      baseUrl,
    },
  );
  const userDataProvider = new UserSquidexDataProvider(
    squidexGraphqlClient,
    userRestClient,
  );
  const reminderDataProvider = new ReminderSquidexDataProvider(
    squidexGraphqlClient,
  );
  const teamDataProvider = new TeamSquidexDataProvider(
    squidexGraphqlClient,
    teamRestClient,
  );

  const researchOutputDataProvider = new ResearchOutputSquidexDataProvider(
    squidexGraphqlClient,
    researchOutputRestClient,
  );

  const teardown = teardownHelper([
    userRestClient,
    teamRestClient,
    researchOutputRestClient,
    workingGroupRestClient,
  ]);

  afterEach(async () => {
    await teardown();
  });

  describe('Research Output Published Reminder', () => {
    let creatorId: string;
    let teamId: string;
    let fetchRemindersOptions: FetchRemindersOptions;

    beforeEach(async () => {
      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      teamId = await teamDataProvider.create(teamCreateDataObject);

      const userCreateDataObject2 = getUserInput(teamId);
      creatorId = await userDataProvider.create(userCreateDataObject2);

      const userCreateDataObject = getUserInput(teamId);
      const userId1 = await userDataProvider.create(userCreateDataObject);

      const timezone = 'Europe/London';
      fetchRemindersOptions = { userId: userId1, timezone };
    });

    test('Should see the reminder when the research output was created recently and the user is associated with the team that owns it', async () => {
      const researchOutputInput = getResearchOutputInput(teamId, creatorId);

      const researchOutputId = await researchOutputDataProvider.create(
        researchOutputInput,
      );

      const expectedReminder: ResearchOutputPublishedReminder = {
        id: `research-output-published-${researchOutputId}`,
        entity: 'Research Output',
        type: 'Published',
        data: {
          researchOutputId,
          documentType: researchOutputInput.documentType,
          title: researchOutputInput.title,
          addedDate: researchOutputInput.addedDate,
          createdBy: researchOutputInput.createdBy,
          associationType: 'team',
          associationName: 'Team',
        },
      };
      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 1,
          items: [expectedReminder],
        });
      });
    });

    test('Should not see the reminder when the research output was created recently and the status is changed to Draft in squidex', async () => {
      const researchOutputInput = getResearchOutputInput(teamId, creatorId);

      const researchOutputId = await researchOutputDataProvider.create(
        researchOutputInput,
      );

      await researchOutputRestClient.publish(researchOutputId, 'Draft');

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });

    test('Should not see the reminder when the research output was created recently but the user is NOT associated with the team that owns it', async () => {
      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      const anotherTeamId = await teamDataProvider.create(teamCreateDataObject);

      const researchOutputInput = getResearchOutputInput(teamId, creatorId);
      researchOutputInput.teamIds = [anotherTeamId];

      await researchOutputDataProvider.create(researchOutputInput);

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });

    test('Should not see the reminder when the research output was created over 24 hours ago and the user is associated with the team that owns it', async () => {
      const researchOutputInput = getResearchOutputInput(teamId, creatorId);
      const timeOver24hago = new Date(
        new Date().getTime() - (24 * 60 * 60 * 1000 + 1000),
      );
      researchOutputInput.addedDate = timeOver24hago.toISOString();

      await researchOutputDataProvider.create(researchOutputInput);

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });

    test('Should sort the research-output-published reminders by added-date in descending order (newest first)', async () => {
      const time3HoursAgo = new Date(new Date().getTime() - 3 * 60 * 60 * 1000);
      const researchOutputInput1 = getResearchOutputInput(teamId, creatorId);
      researchOutputInput1.addedDate = time3HoursAgo.toISOString();

      const time1HourAgo = new Date(new Date().getTime() - 1 * 60 * 60 * 1000);
      const researchOutputInput2 = getResearchOutputInput(teamId, creatorId);
      researchOutputInput2.addedDate = time1HourAgo.toISOString();

      const time2HoursAgo = new Date(new Date().getTime() - 2 * 60 * 60 * 1000);
      const researchOutputInput3 = getResearchOutputInput(teamId, creatorId);
      researchOutputInput3.addedDate = time2HoursAgo.toISOString();

      const researchOutputId1 = await researchOutputDataProvider.create(
        researchOutputInput1,
      );
      const researchOutputId2 = await researchOutputDataProvider.create(
        researchOutputInput2,
      );
      const researchOutputId3 = await researchOutputDataProvider.create(
        researchOutputInput3,
      );

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        const reminderIds = reminders.items.map(
          (item) =>
            (item as ResearchOutputPublishedReminder).data.researchOutputId,
        );

        expect(reminderIds).toEqual([
          researchOutputId2,
          researchOutputId3,
          researchOutputId1,
        ]);
      });
    });
  });

  describe('Research Output Draft Reminder', () => {
    let creatorId: string;
    let notCreatorId: string;
    let creatorUsername: string;
    let teamId: string;
    let fetchRemindersOptions: FetchRemindersOptions;

    beforeEach(async () => {
      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      teamId = await teamDataProvider.create(teamCreateDataObject);

      const userCreateDataObject2 = getUserInput(teamId);

      creatorId = await userDataProvider.create(userCreateDataObject2);
      let creator = await userDataProvider.fetchById(creatorId);
      creatorUsername = creator?.firstName + ' ' + creator?.lastName;

      const userCreateDataObject = getUserInput(teamId);
      const userId1 = await userDataProvider.create(userCreateDataObject);
      notCreatorId = userId1;

      const timezone = 'Europe/London';
      fetchRemindersOptions = { userId: userId1, timezone };
    });

    test('Should see the reminder when the research output was created recently and the user is associated with the team that owns it', async () => {
      const researchOutputInput = {
        ...getResearchOutputInputDraft(teamId, creatorId),
        addedDate: undefined,
      };
      const researchOutputId = await researchOutputDataProvider.create(
        researchOutputInput,
        { publish: false },
      );

      await retryable(async () => {
        const researchOutput = await researchOutputDataProvider.fetchById(
          researchOutputId,
        );

        const expectedReminder: ResearchOutputDraftReminder = {
          id: `research-output-draft-${researchOutputId}`,
          entity: 'Research Output',
          type: 'Draft',
          data: {
            researchOutputId,
            associationName: getTeamCreateDataObject().displayName,
            associationType: 'team',
            createdBy: creatorUsername,
            title: researchOutputInput.title,
            addedDate: researchOutput?.created.slice(0, -5) + 'Z' || '',
          },
        };
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 1,
          items: [expectedReminder],
        });
      });
    });

    test('Should see the reminder when the research output was created recently and the user is associated with the working group that owns it', async () => {
      const wgData = createWorkingGroup(creatorId);

      const workingGroup = await workingGroupRestClient.create(
        wgData as any,
        true,
      );
      const workingGroupId = workingGroup.id;

      const researchOutputInput = {
        ...getResearchOutputInputDraft(teamId, creatorId, workingGroupId),
        addedDate: undefined,
      };

      const researchOutputId = await researchOutputDataProvider.create(
        researchOutputInput,
        { publish: false },
      );

      await retryable(async () => {
        const researchOutput = await researchOutputDataProvider.fetchById(
          researchOutputId,
        );

        const expectedReminder: ResearchOutputDraftReminder = {
          id: `research-output-draft-${researchOutputId}`,
          entity: 'Research Output',
          type: 'Draft',
          data: {
            researchOutputId,
            associationName: workingGroup.data.title.iv,
            associationType: 'working group',
            createdBy: creatorUsername,
            title: researchOutputInput.title,
            addedDate: researchOutput?.created.slice(0, -5) + 'Z' || '',
          },
        };
        const reminders = await reminderDataProvider.fetch({
          ...fetchRemindersOptions,
          userId: creatorId,
        });
        expect(reminders).toEqual({
          total: 1,
          items: [expectedReminder],
        });
      });
    });

    test('Should not see the reminder when the research output was created recently and the user is not associated with the working group that owns it', async () => {
      const wgData = createWorkingGroup(creatorId);

      const workingGroup = await workingGroupRestClient.create(
        wgData as any,
        true,
      );
      const workingGroupId = workingGroup.id;

      const researchOutputInput = getResearchOutputInputDraft(
        teamId,
        creatorId,
        workingGroupId,
      );

      await researchOutputDataProvider.create(researchOutputInput, {
        publish: false,
      });

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch({
          ...fetchRemindersOptions,
          userId: notCreatorId,
        });
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });

    test('Should not see the reminder when the research output was created recently but the user is NOT associated with the team that owns it', async () => {
      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      const anotherTeamId = await teamDataProvider.create(teamCreateDataObject);

      const researchOutputInput = getResearchOutputInputDraft(
        teamId,
        creatorId,
      );
      researchOutputInput.teamIds = [anotherTeamId];

      await researchOutputDataProvider.create(researchOutputInput, {
        publish: false,
      });

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });

    test('Should see the reminder when the research output was created recently but the user is NOT associated with the team that owns it but is ASAP staff', async () => {
      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      const anotherTeamId = await teamDataProvider.create(teamCreateDataObject);

      const researchOutputInput = {
        ...getResearchOutputInputDraft(teamId, creatorId),
        addedDate: undefined,
      };
      researchOutputInput.teamIds = [anotherTeamId];

      await userDataProvider.update(creatorId, {
        role: 'Staff',
      });

      const researchOutputId = await researchOutputDataProvider.create(
        researchOutputInput,
        { publish: false },
      );

      await retryable(async () => {
        const researchOutput = await researchOutputDataProvider.fetchById(
          researchOutputId,
        );

        const expectedReminder: ResearchOutputDraftReminder = {
          id: `research-output-draft-${researchOutputId}`,
          entity: 'Research Output',
          type: 'Draft',
          data: {
            researchOutputId,
            associationName: getTeamCreateDataObject().displayName,
            associationType: 'team',
            createdBy: creatorUsername,
            title: researchOutputInput.title,
            addedDate: researchOutput?.created.slice(0, -5) + 'Z' || '',
          },
        };
        const reminders = await reminderDataProvider.fetch({
          ...fetchRemindersOptions,
          userId: creatorId,
        });
        expect(reminders).toEqual({
          total: 1,
          items: [expectedReminder],
        });
      });
    });

    test('Should not see the reminder when the research output was created over 24 hours ago and the user is associated with the team that owns it', async () => {
      jest.useFakeTimers();

      const researchOutputInput = getResearchOutputInputDraft(
        teamId,
        creatorId,
      );
      await researchOutputDataProvider.create(researchOutputInput, {
        publish: false,
      });

      const timeAfter24h = new Date(
        new Date().getTime() + (24 * 60 * 60 * 1000 + 1000),
      );
      jest.setSystemTime(timeAfter24h);
      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
      jest.useRealTimers();
    });
  });

  describe('Research Output In Review Reminder', () => {
    let creatorId: string;
    let projectManager: string;
    let creatorUsername: string;
    let teamId: string;
    let fetchRemindersOptions: FetchRemindersOptions;

    beforeEach(async () => {
      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      teamId = await teamDataProvider.create(teamCreateDataObject);

      const userCreateDataObject2 = getUserInput(teamId);

      creatorId = await userDataProvider.create(userCreateDataObject2);
      let creator = await userDataProvider.fetchById(creatorId);
      creatorUsername = creator?.firstName + ' ' + creator?.lastName;

      const userCreateDataObject = getUserInput(teamId, 'Project Manager');
      const userId1 = await userDataProvider.create(userCreateDataObject);
      projectManager = userId1;

      const timezone = 'Europe/London';
      fetchRemindersOptions = { userId: userId1, timezone };
    });

    test('Should see the reminder when the user is PM within the team that owns the RO', async () => {
      const researchOutputInput = {
        ...getResearchOutputInputDraft(teamId, creatorId),
        addedDate: undefined,
      };
      const researchOutputId = await researchOutputDataProvider.create(
        researchOutputInput,
        { publish: false },
      );

      await researchOutputDataProvider.update(researchOutputId, {
        reviewRequestedById: creatorId,
        documentType: researchOutputInput.documentType,
        sharingStatus: researchOutputInput.sharingStatus,
        title: researchOutputInput.title,
        authors: researchOutputInput.authors,
        environmentIds: researchOutputInput.environmentIds,
        labIds: researchOutputInput.labIds,
        methodIds: researchOutputInput.methodIds,
        organismIds: researchOutputInput.organismIds,
        keywordIds: researchOutputInput.keywordIds,
        teamIds: researchOutputInput.teamIds,
        updatedBy: creatorId,
        workingGroups: researchOutputInput.workingGroups || [],
      });

      await retryable(async () => {
        const researchOutput = await researchOutputDataProvider.fetchById(
          researchOutputId,
        );

        const expectedReminder: ResearchOutputInReviewReminder = {
          id: `research-output-in-review-${researchOutputId}`,
          entity: 'Research Output',
          type: 'In Review',
          data: {
            researchOutputId,
            associationName: getTeamCreateDataObject().displayName,
            associationType: 'team',
            title: researchOutputInput.title,
            addedDate: researchOutput?.created.slice(0, -5) + 'Z' || '',
            documentType: researchOutputInput.documentType,
            reviewRequestedBy: creatorUsername,
          },
        };
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 1,
          items: [expectedReminder],
        });
      });
    });

    test('Should see the reminder when the user is PM within the working group that owns the RO', async () => {
      const wgData = createWorkingGroup(projectManager);

      const workingGroup = await workingGroupRestClient.create(
        wgData as any,
        true,
      );
      const workingGroupId = workingGroup.id;

      const researchOutputInput = {
        ...getResearchOutputInputDraft(teamId, creatorId, workingGroupId),
        addedDate: undefined,
      };

      const researchOutputId = await researchOutputDataProvider.create(
        researchOutputInput,
        { publish: false },
      );

      await researchOutputDataProvider.update(researchOutputId, {
        reviewRequestedById: creatorId,
        documentType: researchOutputInput.documentType,
        sharingStatus: researchOutputInput.sharingStatus,
        title: researchOutputInput.title,
        authors: researchOutputInput.authors,
        environmentIds: researchOutputInput.environmentIds,
        labIds: researchOutputInput.labIds,
        methodIds: researchOutputInput.methodIds,
        organismIds: researchOutputInput.organismIds,
        keywordIds: researchOutputInput.keywordIds,
        teamIds: researchOutputInput.teamIds,
        updatedBy: creatorId,
        workingGroups: researchOutputInput.workingGroups || [],
      });

      await retryable(async () => {
        const researchOutput = await researchOutputDataProvider.fetchById(
          researchOutputId,
        );

        const expectedReminder: ResearchOutputInReviewReminder = {
          id: `research-output-in-review-${researchOutputId}`,
          entity: 'Research Output',
          type: 'In Review',
          data: {
            researchOutputId,
            associationName: workingGroup.data.title.iv,
            associationType: 'working group',
            title: researchOutputInput.title,
            addedDate: researchOutput?.created.slice(0, -5) + 'Z' || '',
            documentType: researchOutputInput.documentType,
            reviewRequestedBy: creatorUsername,
          },
        };
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );

        expect(reminders).toEqual({
          total: 1,
          items: [expectedReminder],
        });
      });
    });

    test('Should not see the reminder when the user is not PM within the working group that owns the RO', async () => {
      const wgData = createWorkingGroup(creatorId);

      const workingGroup = await workingGroupRestClient.create(
        wgData as any,
        true,
      );
      const workingGroupId = workingGroup.id;

      const researchOutputInput = getResearchOutputInputDraft(
        teamId,
        creatorId,
        workingGroupId,
      );

      const researchOutputId = await researchOutputDataProvider.create(
        researchOutputInput,
        {
          publish: false,
        },
      );

      await researchOutputDataProvider.update(researchOutputId, {
        reviewRequestedById: creatorId,
        documentType: researchOutputInput.documentType,
        sharingStatus: researchOutputInput.sharingStatus,
        title: researchOutputInput.title,
        authors: researchOutputInput.authors,
        environmentIds: researchOutputInput.environmentIds,
        labIds: researchOutputInput.labIds,
        methodIds: researchOutputInput.methodIds,
        organismIds: researchOutputInput.organismIds,
        keywordIds: researchOutputInput.keywordIds,
        teamIds: researchOutputInput.teamIds,
        updatedBy: creatorId,
        workingGroups: researchOutputInput.workingGroups || [],
      });

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch({
          ...fetchRemindersOptions,
          userId: projectManager,
        });
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });

    test('Should not see the reminder when the user is not PM within the team that owns the RO', async () => {
      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      const anotherTeamId = await teamDataProvider.create(teamCreateDataObject);

      const researchOutputInput = getResearchOutputInputDraft(
        teamId,
        creatorId,
      );
      researchOutputInput.teamIds = [anotherTeamId];

      const researchOutputId = await researchOutputDataProvider.create(
        researchOutputInput,
        {
          publish: false,
        },
      );

      await researchOutputDataProvider.update(researchOutputId, {
        reviewRequestedById: creatorId,
        documentType: researchOutputInput.documentType,
        sharingStatus: researchOutputInput.sharingStatus,
        title: researchOutputInput.title,
        authors: researchOutputInput.authors,
        environmentIds: researchOutputInput.environmentIds,
        labIds: researchOutputInput.labIds,
        methodIds: researchOutputInput.methodIds,
        organismIds: researchOutputInput.organismIds,
        keywordIds: researchOutputInput.keywordIds,
        teamIds: researchOutputInput.teamIds,
        updatedBy: creatorId,
        workingGroups: researchOutputInput.workingGroups || [],
      });

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });

    test('Should see the reminder when the user is ASAP staff', async () => {
      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      const anotherTeamId = await teamDataProvider.create(teamCreateDataObject);

      const researchOutputInput = {
        ...getResearchOutputInputDraft(teamId, creatorId),
        addedDate: undefined,
      };
      researchOutputInput.teamIds = [anotherTeamId];

      await userDataProvider.update(creatorId, {
        role: 'Staff',
      });

      const researchOutputId = await researchOutputDataProvider.create(
        researchOutputInput,
        { publish: false },
      );

      await researchOutputDataProvider.update(researchOutputId, {
        reviewRequestedById: creatorId,
        documentType: researchOutputInput.documentType,
        sharingStatus: researchOutputInput.sharingStatus,
        title: researchOutputInput.title,
        authors: researchOutputInput.authors,
        environmentIds: researchOutputInput.environmentIds,
        labIds: researchOutputInput.labIds,
        methodIds: researchOutputInput.methodIds,
        organismIds: researchOutputInput.organismIds,
        keywordIds: researchOutputInput.keywordIds,
        teamIds: researchOutputInput.teamIds,
        updatedBy: creatorId,
        workingGroups: researchOutputInput.workingGroups || [],
      });

      await retryable(async () => {
        const researchOutput = await researchOutputDataProvider.fetchById(
          researchOutputId,
        );

        const expectedReminder: ResearchOutputInReviewReminder = {
          id: `research-output-in-review-${researchOutputId}`,
          entity: 'Research Output',
          type: 'In Review',
          data: {
            researchOutputId,
            associationName: getTeamCreateDataObject().displayName,
            associationType: 'team',
            title: researchOutputInput.title,
            addedDate: researchOutput?.created.slice(0, -5) + 'Z' || '',
            documentType: researchOutputInput.documentType,
            reviewRequestedBy: creatorUsername,
          },
        };
        const reminders = await reminderDataProvider.fetch({
          ...fetchRemindersOptions,
          userId: creatorId,
        });
        expect(reminders).toEqual({
          total: 1,
          items: [expectedReminder],
        });
      });
    });
  });

  const getUserInput = (
    teamId: string,
    role = 'Key Personnel' as TeamRole,
  ): UserCreateDataObject => ({
    ...getUserCreateDataObject(),
    teams: [{ id: teamId, role }],
    labIds: [],
    email: chance.email(),
    orcid: createRandomOrcid(),
    avatar: undefined,
  });

  const getResearchOutputInput = (
    teamId: string,
    creatorId: string,
  ): PublishedResearchOutputCreateDataObject => ({
    ...getResearchOutputCreateDataObject(),
    teamIds: [teamId],
    createdBy: creatorId,
    subtypeId: undefined,
    link: chance.url(),
    environmentIds: [],
    organismIds: [],
    methodIds: [],
    keywordIds: [],
    labIds: [],
    authors: [],
    relatedResearchIds: [],
    relatedEventIds: [],
    addedDate: new Date().toISOString(),
  });

  const getResearchOutputInputDraft = (
    teamId: string,
    creatorId: string,
    workingGroupId: string = '',
  ): DraftResearchOutputCreateDataObject => ({
    ...getResearchOutputCreateDataObject(),
    teamIds: [teamId],
    workingGroups: workingGroupId ? [workingGroupId] : [],
    createdBy: creatorId,
    subtypeId: undefined,
    link: chance.url(),
    environmentIds: [],
    organismIds: [],
    methodIds: [],
    keywordIds: [],
    labIds: [],
    authors: [],
    relatedResearchIds: [],
    relatedEventIds: [],
  });
});

const createWorkingGroup = (creatorId: string) => {
  return {
    title: {
      iv: 'Created via test',
    },
    complete: {
      iv: false,
    },
    description: {
      iv: 'a short description',
    },
    shortText: {
      iv: 'just a short text>',
    },
    calendars: {},
    'external-link': {
      iv: 'https://google.com',
    },
    deliverables: {
      iv: [
        {
          description: '<string>',
          status: 'In Progress',
        },
      ],
    },
    leaders: {
      iv: [
        {
          user: [creatorId],
          role: 'Project Manager',
          workstreamRole: 'Test',
        },
      ],
    },
    members: {},
  };
};
