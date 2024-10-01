import supertest from 'supertest';
import { Express } from 'express';
import { omit } from 'lodash';
import { ResearchTagDataObject, ResearchOutputResponse } from '@asap-hub/model';

import { PAGE_SIZE } from '../../scripts/export-entity';
import { AppHelper } from './helpers/app';
import { retryable } from './helpers/retryable';
import './helpers/matchers';

import {
  FixtureFactory,
  getUserFixture,
  UserFixture,
  getTeamFixture,
  TeamFixture,
  getWorkingGroupFixture,
  WorkingGroupFixture,
  getResearchOutputFixture,
  ResearchOutputCreateDataObject,
} from './fixtures';
import { getEnvironment } from './fixtures/contentful';

jest.setTimeout(120000);

const fixtures = FixtureFactory();

describe('research outputs', () => {
  let app: Express;
  let loggedInUser: UserFixture;
  let researchTags: ResearchTagDataObject[];

  beforeAll(async () => {
    loggedInUser = await fixtures.createUser(getUserFixture({}));
    app = AppHelper(() => loggedInUser);

    const response = await supertest(app).get('/research-tags').query({
      take: 200,
    });
    researchTags = await response.body.items;
  });

  test('can list research outputs', async () => {
    const response = await supertest(app)
      .get('/research-outputs')
      .query({ take: PAGE_SIZE })
      .expect(200);

    expect(response.body.total).toEqual(expect.any(Number));
    expect(response.body.items).toEqual(expect.any(Array));
  });

  describe('team outputs', () => {
    let pmTeam: TeamFixture;
    let nonPmTeam: TeamFixture;
    let nonMemberTeam: TeamFixture;

    beforeAll(async () => {
      pmTeam = await fixtures.createTeam(getTeamFixture());
      nonPmTeam = await fixtures.createTeam(getTeamFixture());
      nonMemberTeam = await fixtures.createTeam(getTeamFixture());
      loggedInUser = await fixtures.createUser(
        getUserFixture({
          role: 'Grantee',
          teams: [
            {
              id: nonPmTeam.id,
              role: 'Key Personnel',
            },
            {
              id: pmTeam.id,
              role: 'Project Manager',
            },
          ],
        }),
      );
    });
    test('fetches the previously published version if unpublished changes are made in contentful', async () => {
      const input = getResearchOutputFixture({
        teams: [pmTeam.id],
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
          teams: [pmTeam.id],
          workingGroups: [],
          published: false,
          documentType: 'Article',
        });
        const dataset = getResearchOutputFixture({
          teams: [pmTeam.id],
          workingGroups: [],
          published: false,
          documentType: 'Dataset',
        });
        const report = getResearchOutputFixture({
          teams: [pmTeam.id],
          workingGroups: [],
          published: false,
          documentType: 'Report',
        });

        await supertest(app)
          .post('/research-outputs')
          .send(article)
          .expect(201);

        await supertest(app)
          .post('/research-outputs')
          .send(dataset)
          .expect(201);

        await supertest(app).post('/research-outputs').send(report).expect(201);
      });

      test('can filter for a single document type', async () => {
        const response = await supertest(app)
          .get(
            `/research-outputs?teamId=${pmTeam.id}&status=draft&filter=Dataset`,
          )
          .expect(200);

        expect(response.body.items).toHaveLength(1);
        expect(response.body.items[0].documentType).toEqual('Dataset');
      });

      test('can filter for multiple document types', async () => {
        const response = await supertest(app)
          .get(
            `/research-outputs?teamId=${pmTeam.id}&status=draft&filter=Dataset&filter=Report`,
          )
          .expect(200);

        expect(response.body.items).toHaveLength(2);
        expect(response.body.items[0].documentType).toEqual('Report');
        expect(response.body.items[1].documentType).toEqual('Dataset');
      });
    });

    describe('create', () => {
      test('can create a draft team research output as a team non-PM', async () => {
        const input = getResearchOutputFixture(
          {
            teams: [nonPmTeam.id],
            workingGroups: [],
            published: false,
          },
          { researchTags },
        );
        const now = new Date().toISOString();
        const response = await supertest(app)
          .post('/research-outputs')
          .send(input)
          .expect(201);

        expect(response.body).toMatchObject({
          ...omit(input, 'workingGroups'),
          teams: input.teams.map((id) => ({ id })),
        });
        expect(response.body.published).toEqual(false);
        expect(response.body.created).toBeCloseInTimeTo(now);
        expect(response.body.addedDate).toEqual(null);
      });

      test('can create a published team research output as a team PM', async () => {
        const input = getResearchOutputFixture({
          teams: [pmTeam.id],
          workingGroups: [],
          published: true,
        });
        const now = new Date().toISOString();
        const response = await supertest(app)
          .post('/research-outputs')
          .send(input)
          .expect(201);

        expect(response.body).toMatchObject({
          ...omit(input, 'workingGroups'),
          teams: input.teams.map((id) => ({ id })),
        });
        expect(response.body.published).toEqual(true);
        expect(response.body.created).toBeCloseInTimeTo(now);
        expect(response.body.addedDate).toBeCloseInTimeTo(now);
      });

      test('cannot create a published team research output as a team non-PM', async () => {
        const input = getResearchOutputFixture(
          {
            teams: [nonPmTeam.id],
            workingGroups: [],
            published: true,
          },
          { researchTags },
        );

        await supertest(app).post('/research-outputs').send(input).expect(403);
      });

      test('cannot create a draft team research output as a team non-member', async () => {
        const input = getResearchOutputFixture(
          {
            teams: [nonMemberTeam.id],
            workingGroups: [],
            published: false,
          },
          { researchTags },
        );

        await supertest(app).post('/research-outputs').send(input).expect(403);
      });
    });

    describe('update', () => {
      let researchOutput: ResearchOutputCreateDataObject;
      let researchOutputId: string;

      beforeAll(async () => {
        researchOutput = getResearchOutputFixture(
          {
            teams: [nonPmTeam.id],
            workingGroups: [],
            published: false,
          },
          { researchTags },
        );

        const response = await supertest(app)
          .post('/research-outputs')
          .send(researchOutput)
          .expect(201);

        researchOutputId = response.body.id;
      });

      test('can update a draft research output', async () => {
        await supertest(app)
          .put(`/research-outputs/${researchOutputId}`)
          .send({
            ...researchOutput,
            title: `${researchOutput.title} - updated`,
          })
          .expect(200);
        const now = new Date().toISOString();
        await retryable(async () => {
          const response = await supertest(app)
            .get(`/research-outputs/${researchOutputId}`)
            .expect(200);

          expect(response.body.title).toEqual(
            `${researchOutput.title} - updated`,
          );
          expect(response.body.lastUpdatedPartial).toBeCloseInTimeTo(now);
        });
      });

      test('can update a draft research output to request a review', async () => {
        const now = new Date().toISOString();
        const response = await supertest(app)
          .put(`/research-outputs/${researchOutputId}`)
          .send({
            ...researchOutput,
            statusChangedById: loggedInUser.id,
            isInReview: true,
            hasStatusChanged: true,
          })
          .expect(200);

        expect(response.body.statusChangedBy.id).toEqual(loggedInUser.id);
        expect(response.body.statusChangedBy.firstName).toEqual(
          loggedInUser.firstName,
        );
        expect(response.body.statusChangedBy.lastName).toEqual(
          loggedInUser.lastName,
        );
        expect(response.body.lastUpdatedPartial).toBeCloseInTimeTo(now);
        expect(response.body.isInReview).toBe(true);
        expect(response.body.statusChangedAt).toBeCloseInTimeTo(now);
      });

      // regression test for cache behaviour when updating published content  in contentful
      test('editing a published output returns the fresh data', async () => {
        const researchOutput = getResearchOutputFixture(
          {
            teams: [pmTeam.id],
            workingGroups: [],
            published: true,
          },
          { researchTags },
        );

        const response = await supertest(app)
          .post('/research-outputs')
          .send(researchOutput)
          .expect(201);

        const updated = await supertest(app)
          .put(`/research-outputs/${response.body.id}`)
          .send({
            ...researchOutput,
            title: `${researchOutput.title} - updated`,
          })
          .expect(200);

        expect(updated.body.title).toEqual(`${researchOutput.title} - updated`);
      });

      describe('publishing', () => {
        let publishOutput: ResearchOutputCreateDataObject;
        let publishOutputId: string;

        beforeAll(async () => {
          publishOutput = getResearchOutputFixture(
            {
              teams: [pmTeam.id],
              workingGroups: [],
              published: false,
            },
            { researchTags },
          );

          const response = await supertest(app)
            .post('/research-outputs')
            .send(publishOutput)
            .expect(201);

          publishOutputId = response.body.id;
        });

        test.skip('can publish a draft output by updating with `published: true`', async () => {
          const now = new Date().toISOString();
          await supertest(app)
            .put(`/research-outputs/${publishOutputId}`)
            .send({
              ...publishOutput,
              published: true,
            })
            .expect(200);

          await retryable(async () => {
            const response = await supertest(app)
              .get(`/research-outputs/${publishOutputId}`)
              .expect(200);

            expect(response.body.published).toEqual(true);
            expect(response.body.addedDate).toBeCloseInTimeTo(now);
          });
        });

        test('cannot publish draft outputs for non pm teams', async () => {
          await supertest(app)
            .put(`/research-outputs/${researchOutputId}`)
            .send({
              ...researchOutput,
              published: true,
            })
            .expect(403);

          const response = await supertest(app)
            .get(`/research-outputs/${researchOutputId}`)
            .expect(200);

          expect(response.body.published).toEqual(false);
        });
      });
    });

    describe('list', () => {
      test('can list draft research outputs for a team you are a member of', async () => {
        await retryable(async () => {
          const response = await supertest(app)
            .get(`/research-outputs?teamId=${nonPmTeam.id}&status=draft`)
            .expect(200);
          response.body.items.forEach((output: ResearchOutputResponse) => {
            expect(
              output.teams.some((team) => team.id === nonPmTeam.id),
            ).toEqual(true);
          });
        });
      });

      test('cannot list draft research outputs for a team you are not a member of', async () => {
        await supertest(app)
          .get(`/research-outputs?teamId=${nonMemberTeam.id}&status=draft`)
          .expect(403);
      });
    });

    describe('fetch by ID', () => {
      let researchOutputId: string;

      beforeAll(async () => {
        const input = getResearchOutputFixture({
          teams: [pmTeam.id],
          workingGroups: [],
        });

        const response = await supertest(app)
          .post('/research-outputs')
          .send(input)
          .expect(201);

        researchOutputId = response.body.id;
      });

      test('includes PM contact emails', async () => {
        await retryable(async () => {
          const response = await supertest(app)
            .get(`/research-outputs/${researchOutputId}`)
            .expect(200);

          expect(response.body.contactEmails).toEqual([loggedInUser.email]);
        });
      });
    });
  });

  describe('working group outputs', () => {
    let team: TeamFixture;
    let leaderWorkingGroup: WorkingGroupFixture;
    let memberWorkingGroup: WorkingGroupFixture;
    let nonMemberWorkingGroup: WorkingGroupFixture;

    beforeAll(async () => {
      loggedInUser = await fixtures.createUser(getUserFixture({}));
      team = await fixtures.createTeam(getTeamFixture());
      leaderWorkingGroup = await fixtures.createWorkingGroup(
        getWorkingGroupFixture({
          leaders: [
            {
              user: loggedInUser.id,
              role: 'Project Manager',
              workstreamRole: 'Test',
            },
          ],
        }),
      );
      memberWorkingGroup = await fixtures.createWorkingGroup(
        getWorkingGroupFixture({
          members: [loggedInUser.id],
        }),
      );
      nonMemberWorkingGroup = await fixtures.createWorkingGroup(
        getWorkingGroupFixture({}),
      );
    });

    describe('create', () => {
      test('can create a draft working group output in a working group you are a member of', async () => {
        const input = getResearchOutputFixture(
          {
            teams: [team.id],
            workingGroups: [memberWorkingGroup.id],
            published: false,
          },
          { researchTags },
        );
        const now = new Date().toISOString();
        const response = await supertest(app)
          .post('/research-outputs')
          .send(input)
          .expect(201);

        expect(response.body).toMatchObject({
          teams: input.teams.map((id) => ({ id })),
        });
        expect(response.body.published).toEqual(false);
        expect(response.body.created).toBeCloseInTimeTo(now);
        expect(response.body.addedDate).toEqual(null);
      });

      test('cannot create a published working group output in a working group you are not a PM of', async () => {
        const input = getResearchOutputFixture(
          {
            teams: [team.id],
            workingGroups: [memberWorkingGroup.id],
            published: true,
          },
          { researchTags },
        );

        await supertest(app).post('/research-outputs').send(input).expect(403);
      });

      test('cannot create a draft working group output in a working group you are not a member of', async () => {
        const input = getResearchOutputFixture(
          {
            teams: [team.id],
            workingGroups: [nonMemberWorkingGroup.id],
            published: false,
          },
          { researchTags },
        );

        await supertest(app).post('/research-outputs').send(input).expect(403);
      });

      test('can create a published working group output in a working group you are a PM of', async () => {
        const input = getResearchOutputFixture(
          {
            teams: [team.id],
            workingGroups: [leaderWorkingGroup.id],
            published: true,
          },
          { researchTags },
        );
        const now = new Date().toISOString();
        const response = await supertest(app)
          .post('/research-outputs')
          .send(input)
          .expect(201);

        expect(response.body).toMatchObject({
          teams: input.teams.map((id) => ({ id })),
        });
        expect(response.body.published).toEqual(true);
        expect(response.body.created).toBeCloseInTimeTo(now);
        expect(response.body.addedDate).toBeCloseInTimeTo(now);
      });
    });

    describe('list', () => {
      test('can list draft research outputs for a working group you are a member of', async () => {
        await retryable(async () => {
          const response = await supertest(app)
            .get(
              `/research-outputs?workingGroupId=${memberWorkingGroup.id}&status=draft`,
            )
            .expect(200);

          response.body.items.forEach((output: ResearchOutputResponse) => {
            expect(
              output.workingGroups?.some(
                (wg) => wg.id === memberWorkingGroup.id,
              ),
            ).toEqual(true);
          });
        });
      });

      test('cannot list draft research outputs for a working group you are not a member of', async () => {
        await retryable(async () => {
          await supertest(app)
            .get(
              `/research-outputs?workingGroupId=${nonMemberWorkingGroup.id}&status=draft`,
            )
            .expect(403);
        });
      });
    });
  });

  describe('staff users', () => {
    let nonMemberWorkingGroup: WorkingGroupFixture;
    let nonMemberTeam: TeamFixture;

    beforeAll(async () => {
      loggedInUser = await fixtures.createUser(
        getUserFixture({
          role: 'Staff',
        }),
      );
      nonMemberTeam = await fixtures.createTeam(getTeamFixture());
      nonMemberWorkingGroup = await fixtures.createWorkingGroup(
        getWorkingGroupFixture({}),
      );
    });

    test('can list draft research outputs for a working group you are not a member of if a staff user', async () => {
      await retryable(async () => {
        const response = await supertest(app)
          .get(
            `/research-outputs?workingGroupId=${nonMemberWorkingGroup.id}&status=draft`,
          )
          .expect(200);
        response.body.items.forEach((output: ResearchOutputResponse) => {
          expect(
            output.workingGroups?.some(
              (wg) => wg.id === nonMemberWorkingGroup.id,
            ),
          ).toEqual(true);
        });
      });
    });
    test('can list draft research outputs for a team you are not a member of if a staff user', async () => {
      await retryable(async () => {
        const response = await supertest(app)
          .get(`/research-outputs?teamId=${nonMemberTeam.id}&status=draft`)
          .expect(200);
        response.body.items.forEach((output: ResearchOutputResponse) => {
          expect(
            output.teams.some((team) => team.id === nonMemberTeam.id),
          ).toEqual(true);
        });
      });
    });
  });
});
