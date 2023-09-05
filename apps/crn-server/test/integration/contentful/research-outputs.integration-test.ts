import supertest from 'supertest';
import { Express } from 'express';

import { AppHelper } from '../helpers/app';
import { retryable } from '../helpers/retryable';
import { getEnvironment, ContentfulFixture } from '../fixtures/contentful';
import {
  getUserFixture,
  UserFixture,
  getTeamFixture,
  TeamFixture,
  getResearchOutputFixture,
} from '../fixtures';

jest.setTimeout(120000);

const fixtures = new ContentfulFixture();

describe('research outputs', () => {
  let app: Express;
  let team: TeamFixture;
  let loggedInUser: UserFixture;

  beforeAll(async () => {
    team = await fixtures.createTeam(getTeamFixture());
    loggedInUser = await fixtures.createUser(
      getUserFixture({
        teams: [
          {
            id: team.id,
            role: 'Project Manager',
          },
        ],
      }),
    );

    app = AppHelper(() => loggedInUser);
  });

  afterAll(async () => {
    await fixtures.teardown();
  });

  test('fetches the previously published version if unpublished changes are made in contentful', async () => {
    const input = getResearchOutputFixture({
      teams: [team.id],
      workingGroups: [],
      published: true,
    });

    const response = await supertest(app)
      .post('/research-outputs')
      .send(input)
      .expect(201);

    const id = response.body.id;
    const title = response.body.title;

    const environment = await getEnvironment();

    const entry = await environment.getEntry(id);

    await entry.patch([
      {
        op: 'replace',
        path: '/fields/title',
        value: { 'en-US': `${title} - (updated)` },
      },
    ]);

    const updated = await supertest(app)
      .get(`/research-outputs/${id}`)
      .expect(200);

    expect(updated.body.title).toEqual(title);
  });

  describe('filter by document type', () => {
    beforeAll(async () => {
      const article = getResearchOutputFixture({
        teams: [team.id],
        workingGroups: [],
        published: false,
        documentType: 'Article',
      });
      const dataset = getResearchOutputFixture({
        teams: [team.id],
        workingGroups: [],
        published: false,
        documentType: 'Dataset',
      });
      const report = getResearchOutputFixture({
        teams: [team.id],
        workingGroups: [],
        published: false,
        documentType: 'Report',
      });

      await supertest(app).post('/research-outputs').send(article).expect(201);

      await supertest(app).post('/research-outputs').send(dataset).expect(201);

      await supertest(app).post('/research-outputs').send(report).expect(201);
    });

    test('can filter for a single document type', async () => {
      await retryable(async () => {
        const response = await supertest(app)
          .get(
            `/research-outputs?teamId=${team.id}&status=draft&filter=Dataset`,
          )
          .expect(200);

        expect(response.body.items).toHaveLength(1);
        expect(response.body.items[0].documentType).toEqual('Dataset');
      });
    });

    test('can filter for multiple document types', async () => {
      await retryable(async () => {
        const response = await supertest(app)
          .get(
            `/research-outputs?teamId=${team.id}&status=draft&filter=Dataset&filter=Report`,
          )
          .expect(200);

        expect(response.body.items).toHaveLength(2);
        expect(response.body.items[0].documentType).toEqual('Report');
        expect(response.body.items[1].documentType).toEqual('Dataset');
      });
    });
  });
});
