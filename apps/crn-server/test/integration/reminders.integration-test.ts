import { Chance } from 'chance';
import {
  RestResearchOutput,
  RestTeam,
  RestUser,
  SquidexGraphql,
  SquidexRest,
  InputUser,
} from '@asap-hub/squidex';
import { appName, baseUrl } from '../../src/config';
import { getAuthToken } from '../../src/utils/auth';
import { getUserCreateDataObject } from '../fixtures/users.fixtures';
import { UserSquidexDataProvider } from '../../src/data-providers/users.data-provider';
import { ResearchOutputSquidexDataProvider } from '../../src/data-providers/research-outputs.data-provider';
import { ReminderSquidexDataProvider } from '../../src/data-providers/reminders.data-provider';
import { TeamSquidexDataProvider } from '../../src/data-providers/teams.data-provider';
import { getResearchOutputCreateDataObject } from '../fixtures/research-output.fixtures';
import { getTeamCreateDataObject } from '../fixtures/teams.fixtures';
import { createRandomOrcid } from '../helpers/users';
import {
  ResearchOutputCreateDataObject,
  ResearchOutputPublishedReminder,
  UserCreateDataObject,
} from '@asap-hub/model';

jest.setTimeout(30000);

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
  const researchOutputDataProvider = new ResearchOutputSquidexDataProvider(
    squidexGraphqlClient,
    researchOutputRestClient,
    teamRestClient,
  );
  const reminderDataProvider = new ReminderSquidexDataProvider(
    squidexGraphqlClient,
  );
  const teamDataProvider = new TeamSquidexDataProvider(
    squidexGraphqlClient,
    teamRestClient,
  );

  describe('Research Output Published Reminder', () => {
    let userId1: string;
    let creatorId: string;
    let teamId: string;

    beforeEach(async () => {
      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      teamId = await teamDataProvider.create(teamCreateDataObject);

      const userCreateDataObject2 = getUserInput();
      creatorId = await userDataProvider.create(userCreateDataObject2);

      const userCreateDataObject = getUserInput();
      userId1 = await userDataProvider.create(userCreateDataObject);
    });

    test('Should see the reminder when the research output was created recently and the user is associated with the team that owns it', async () => {
      const researchOutputInput = getResearchOutputInput();

      const researchOutputId = await researchOutputDataProvider.create(
        researchOutputInput,
      );

      const reminders = await reminderDataProvider.fetch({ userId: userId1 });

      const expectedReminder: ResearchOutputPublishedReminder = {
        id: `research-output-published-${researchOutputId}`,
        entity: 'Research Output',
        type: 'Published',
        data: {
          researchOutputId,
          documentType: researchOutputInput.documentType,
          title: researchOutputInput.title,
        },
      };
      expect(reminders).toEqual({
        total: 1,
        items: [expectedReminder],
      });
    });

    test('Should not see the reminder when the research output was created recently but the user is NOT associated with the team that owns it', async () => {
      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      const anotherTeamId = await teamDataProvider.create(teamCreateDataObject);

      const researchOutputInput = getResearchOutputInput();
      researchOutputInput.teamIds = [anotherTeamId];

      await researchOutputDataProvider.create(researchOutputInput);

      const reminders = await reminderDataProvider.fetch({ userId: userId1 });

      expect(reminders).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should not see the reminder when the research output was created over 24 hours ago and the user is associated with the team that owns it', async () => {
      const researchOutputInput = getResearchOutputInput();
      const timeOver24hago = new Date(
        new Date().getTime() - (24 * 60 * 60 * 1000 + 1000),
      );
      researchOutputInput.addedDate = timeOver24hago.toISOString();

      await researchOutputDataProvider.create(researchOutputInput);

      const reminders = await reminderDataProvider.fetch({ userId: userId1 });

      expect(reminders).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should sort the research-output-published reminders by added-date in descending order (newest first)', async () => {
      const time3HoursAgo = new Date(new Date().getTime() - 3 * 60 * 60 * 1000);
      const researchOutputInput1 = getResearchOutputInput();
      researchOutputInput1.addedDate = time3HoursAgo.toISOString();

      const time1HourAgo = new Date(new Date().getTime() - 1 * 60 * 60 * 1000);
      const researchOutputInput2 = getResearchOutputInput();
      researchOutputInput2.addedDate = time1HourAgo.toISOString();

      const time2HoursAgo = new Date(new Date().getTime() - 2 * 60 * 60 * 1000);
      const researchOutputInput3 = getResearchOutputInput();
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

      const reminders = await reminderDataProvider.fetch({ userId: userId1 });
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

    const getResearchOutputInput = (): ResearchOutputCreateDataObject => ({
      ...getResearchOutputCreateDataObject(),
      teamIds: [teamId],
      createdBy: creatorId,
      subtypeId: undefined,
      link: chance.url(),
      environmentIds: [],
      organismIds: [],
      methodIds: [],
      labIds: [],
      authors: [],
      addedDate: new Date().toISOString(),
    });

    const getUserInput = (): UserCreateDataObject => ({
      ...getUserCreateDataObject(),
      teams: [{ id: teamId, role: 'Key Personnel' }],
      labIds: [],
      email: chance.email(),
      orcid: createRandomOrcid(),
      avatar: undefined,
    });
  });
});
