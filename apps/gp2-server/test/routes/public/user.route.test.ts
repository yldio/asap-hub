import { FetchPaginationOptions } from '@asap-hub/model';
import supertest from 'supertest';
import { publicAppFactory } from '../../../src/publicApp';
import {
  getListPublicUsersResponse,
  getListUsersResponse,
} from '../../fixtures/user.fixtures';
import { userControllerMock } from '../../mocks/user.controller.mock';

describe('/users/ route', () => {
  const publicApp = publicAppFactory({
    userController: userControllerMock,
  });

  afterEach(jest.clearAllMocks);

  describe('GET /users', () => {
    test('Should return 200 when no user exists', async () => {
      userControllerMock.fetch.mockResolvedValueOnce({
        items: [],
        total: 0,
      });

      const response = await supertest(publicApp).get('/public/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should return the results correctly', async () => {
      const listUserResponse = getListUsersResponse();
      const listPublicUserResponse = getListPublicUsersResponse();

      userControllerMock.fetch.mockResolvedValueOnce(listUserResponse);

      const response = await supertest(publicApp).get('/public/users');

      expect(response.body).toEqual(listPublicUserResponse);
    });

    test('Should remove non-public and non-gp2-funded outputs', async () => {
      const listUserResponse = getListUsersResponse();
      listUserResponse.items[0]!.outputs = [
        {
          id: 'output-id',
          title: 'output-title',
          shortDescription: 'output-description',
          sharingStatus: 'GP2 Only',
          gp2Supported: 'Yes',
        },
        {
          id: 'output-id',
          title: 'output-title',
          shortDescription: 'output-description',
          sharingStatus: 'Public',
          gp2Supported: 'No',
        },
        {
          id: 'output-id',
          title: 'output-title',
          shortDescription: 'output-description',
          sharingStatus: 'Public',
          gp2Supported: "Don't Know",
        },
      ];
      const listPublicUserResponse = getListPublicUsersResponse();

      userControllerMock.fetch.mockResolvedValueOnce(listUserResponse);

      const response = await supertest(publicApp).get('/public/users');

      expect(response.body).toMatchObject({
        items: [
          {
            ...listPublicUserResponse.items[0],
            outputs: [],
          },
        ],
      });
    });

    describe('Parameter validation', () => {
      beforeEach(() => {
        userControllerMock.fetch.mockResolvedValueOnce({
          items: [],
          total: 0,
        });
      });

      test('Should call the controller with the right parameters', async () => {
        await supertest(publicApp).get('/public/users').query({
          take: 15,
          skip: 5,
        });

        const expectedParams: FetchPaginationOptions = {
          take: 15,
          skip: 5,
        };

        expect(userControllerMock.fetch).toHaveBeenCalledWith(expectedParams);
      });
      test('Should return a validation error when additional fields exist', async () => {
        const response = await supertest(publicApp).get(`/public/users`).query({
          additionalField: 'some-data',
        });

        expect(response.status).toBe(400);
      });

      test('Should return a validation error when the arguments are not valid', async () => {
        const response = await supertest(publicApp).get(`/public/users`).query({
          take: 'invalid param',
        });

        expect(response.status).toBe(400);
      });
    });
  });
});
