import { NotFoundError } from '@asap-hub/errors';
import { WorkingGroupLeader } from '@asap-hub/model';
import supertest from 'supertest';
import { publicAppFactory } from '../../../src/publicApp';
import {
  getListPublicWorkingGroupResponse,
  getPublicWorkingGroupResponse,
  getWorkingGroupResponse,
} from '../../fixtures/working-groups.fixtures';
import { workingGroupControllerMock } from '../../mocks/working-group.controller.mock';

describe('/working-groups/ route', () => {
  const publicApp = publicAppFactory({
    workingGroupController: workingGroupControllerMock,
  });

  afterEach(jest.clearAllMocks);

  describe('GET /working-groups', () => {
    test('Should return 200 when no user exists', async () => {
      workingGroupControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(publicApp).get('/public/working-groups');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      const workingGroupResponse = getWorkingGroupResponse();
      const publicWorkingGroupResponse = getPublicWorkingGroupResponse();

      workingGroupResponse.leaders = publicWorkingGroupResponse.members.map(
        (member) => ({
          ...member,
          user: {
            ...member,
            email: 'test@test.com',
            teams: [],
          },
          role: member.role as WorkingGroupLeader['role'],
          workstreamRole: '',
          isActive: true,
        }),
      );

      const listPublicWorkingGroupResponse =
        getListPublicWorkingGroupResponse();
      workingGroupControllerMock.fetch.mockResolvedValueOnce({
        items: [workingGroupResponse],
        total: 1,
      });

      const response = await supertest(publicApp).get('/public/working-groups');

      expect(response.body).toEqual(listPublicWorkingGroupResponse);
    });

    describe('Parameter validation', () => {
      beforeEach(() => {
        workingGroupControllerMock.fetch.mockResolvedValueOnce({
          items: [],
          total: 0,
        });
      });

      test('Should call the controller with the right parameters', async () => {
        await supertest(publicApp).get('/public/working-groups').query({
          take: 15,
          skip: 5,
        });

        const expectedParams = {
          take: 15,
          skip: 5,
        };

        expect(workingGroupControllerMock.fetch).toHaveBeenCalledWith(
          expectedParams,
        );
      });
      test('Should return a validation error when additional fields exist', async () => {
        const response = await supertest(publicApp)
          .get(`/public/working-groups`)
          .query({
            additionalField: 'some-data',
          });

        expect(response.status).toBe(400);
      });

      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(publicApp)
          .get(`/public/working-groups`)
          .query({
            take: 'invalid param',
          });

        expect(response.status).toBe(400);
      });
    });
  });

  describe('GET /working-groups/:workingGroupId', () => {
    const workingGroupResponse = getWorkingGroupResponse();
    const publicWorkingGroupResponse = getPublicWorkingGroupResponse();
    workingGroupResponse.leaders = [
      {
        ...publicWorkingGroupResponse.members[0]!,
        user: {
          ...publicWorkingGroupResponse.members[0]!,
          email: 'test@test.com',
          teams: [],
        },
        role: publicWorkingGroupResponse.members[0]!
          .role as WorkingGroupLeader['role'],
        workstreamRole: '',
        isActive: true,
      },
    ];
    workingGroupResponse.members = [
      {
        ...publicWorkingGroupResponse.members[1]!,
        user: {
          ...publicWorkingGroupResponse.members[1]!,
          email: 'test@test.com',
          teams: [],
        },
        isActive: true,
      },
    ];
    // member role is not returned when user is just a member and not a leader
    delete publicWorkingGroupResponse.members[1]!.role;

    workingGroupResponse.deliverables = publicWorkingGroupResponse.deliverables;
    workingGroupResponse.researchOutputsIds =
      publicWorkingGroupResponse.researchOutputsIds;

    test('Should return 200 when the working group exists', async () => {
      const workingGroupId = 'working-group-id-1';

      workingGroupControllerMock.fetchById.mockResolvedValueOnce(
        workingGroupResponse,
      );

      const response = await supertest(publicApp).get(
        `/public/working-groups/${workingGroupId}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(publicWorkingGroupResponse);
    });

    test('Should return 404 when the working group does not exist', async () => {
      workingGroupControllerMock.fetchById.mockRejectedValueOnce(
        new NotFoundError(
          undefined,
          `working group with id non-existing-working-group-id not found`,
        ),
      );

      const response = await supertest(publicApp).get(
        `/public/working-groups/non-existing-working-group-id`,
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        statusCode: 404,
        error: 'Not Found',
        message: `working group with id non-existing-working-group-id not found`,
      });
    });
  });
});
