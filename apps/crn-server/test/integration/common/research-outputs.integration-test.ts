import supertest from 'supertest';
import { Express } from 'express';
import { omit } from 'lodash';
import { ResearchTagDataObject, ResearchOutputResponse } from '@asap-hub/model';

import { AppHelper } from '../helpers/app';
import { retryable } from '../helpers/retryable';
import '../helpers/matchers';

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
} from '../fixtures';

jest.setTimeout(120000);

const fixtures = FixtureFactory(process.env.INTEGRATION_TEST_CMS);

describe('research outputs', () => {
  let app: Express;
  let loggedInUser: UserFixture;
  let researchTags: ResearchTagDataObject[];

  beforeAll(async () => {
    loggedInUser = await fixtures.createUser(getUserFixture({}));
    app = AppHelper(() => loggedInUser);

    const response = await supertest(app)
      .get('/research-tags')
      .query({
        filter: {
          entity: 'Research Output',
        },
      });
    researchTags = await response.body.items;
  });

  afterAll(async () => {
    await fixtures.teardown();
  });

  test('can list research outputs', async () => {
    const response = await supertest(app).get('/research-outputs').expect(200);

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

        const response = await supertest(app)
          .post('/research-outputs')
          .send(input)
          .expect(201);

        expect(response.body).toMatchObject({
          ...omit(input, 'workingGroups'),
          teams: input.teams.map((id) => ({ id })),
        });
        expect(response.body.published).toEqual(false);
        expect(response.body.created).toBeCloseInTimeTo(
          new Date().toISOString(),
        );
        expect(response.body.addedDate).toEqual(null);
      });

      test('can create a published team research output as a team PM', async () => {
        const input = getResearchOutputFixture({
          teams: [pmTeam.id],
          workingGroups: [],
          published: true,
        });

        const response = await supertest(app)
          .post('/research-outputs')
          .send(input)
          .expect(201);

        expect(response.body).toMatchObject({
          ...omit(input, 'workingGroups'),
          teams: input.teams.map((id) => ({ id })),
        });
        expect(response.body.published).toEqual(true);
        expect(response.body.created).toBeCloseInTimeTo(
          new Date().toISOString(),
        );
        expect(response.body.addedDate).toBeCloseInTimeTo(
          new Date().toISOString(),
        );
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

        await retryable(async () => {
          const response = await supertest(app)
            .get(`/research-outputs/${researchOutputId}`)
            .expect(200);

          expect(response.body.title).toEqual(
            `${researchOutput.title} - updated`,
          );
          expect(response.body.lastUpdatedPartial).toBeCloseInTimeTo(
            new Date().toISOString(),
          );
        });
      });

      test('can update a draft research output to request a review', async () => {
        const response = await supertest(app)
          .put(`/research-outputs/${researchOutputId}`)
          .send({ ...researchOutput, reviewRequestedById: loggedInUser.id })
          .expect(200);

        expect(response.body.reviewRequestedBy.id).toEqual(loggedInUser.id);
        expect(response.body.reviewRequestedBy.firstName).toEqual(
          loggedInUser.firstName,
        );
        expect(response.body.reviewRequestedBy.lastName).toEqual(
          loggedInUser.lastName,
        );
        expect(response.body.lastUpdatedPartial).toBeCloseInTimeTo(
          new Date().toISOString(),
        );
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

        test('can publish a draft output by updating with `published: true`', async () => {
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
            expect(response.body.addedDate).toBeCloseInTimeTo(
              new Date().toISOString(),
            );
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

        const response = await supertest(app)
          .post('/research-outputs')
          .send(input)
          .expect(201);

        expect(response.body).toMatchObject({
          teams: input.teams.map((id) => ({ id })),
        });
        expect(response.body.published).toEqual(false);
        expect(response.body.created).toBeCloseInTimeTo(
          new Date().toISOString(),
        );
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

        const response = await supertest(app)
          .post('/research-outputs')
          .send(input)
          .expect(201);

        expect(response.body).toMatchObject({
          teams: input.teams.map((id) => ({ id })),
        });
        expect(response.body.published).toEqual(true);
        expect(response.body.created).toBeCloseInTimeTo(
          new Date().toISOString(),
        );
        expect(response.body.addedDate).toBeCloseInTimeTo(
          new Date().toISOString(),
        );
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
