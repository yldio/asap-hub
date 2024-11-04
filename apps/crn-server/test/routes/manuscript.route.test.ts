import { createUserResponse } from '@asap-hub/fixtures';
import { ManuscriptPostRequest, UserResponse } from '@asap-hub/model';
import { AuthHandler } from '@asap-hub/server-common';
import Boom from '@hapi/boom';
import supertest from 'supertest';

import { appFactory } from '../../src/app';
import {
  getManuscriptCreateDataObject,
  getManuscriptFileResponse,
  getManuscriptPostBody,
  getManuscriptResponse,
  getManuscriptUpdateStatusDataObject,
} from '../fixtures/manuscript.fixtures';
import { loggerMock } from '../mocks/logger.mock';
import { manuscriptControllerMock } from '../mocks/manuscript.controller.mock';

describe('/manuscripts/ route', () => {
  const userMockFactory = jest.fn<UserResponse, []>();
  const authHandlerMock: AuthHandler = (req, _res, next) => {
    req.loggedInUser = userMockFactory();
    next();
  };

  const app = appFactory({
    manuscriptController: manuscriptControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  beforeEach(() => {
    userMockFactory.mockReturnValue(createUserResponse());
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /manuscripts/{id}', () => {
    test('Should return a 404 error when manuscript is not found', async () => {
      manuscriptControllerMock.fetchById.mockRejectedValueOnce(Boom.notFound());

      const response = await supertest(app).get('/manuscripts/123');

      expect(response.status).toBe(404);
    });

    test('Should return 403 when not allowed to get the manuscript', async () => {
      userMockFactory.mockReturnValueOnce({
        ...createUserResponse(),
        onboarded: false,
      });

      const response = await supertest(app).get('/manuscripts/123');

      expect(response.status).toEqual(403);
    });

    test('Should return the result correctly', async () => {
      const manuscriptResponse = getManuscriptResponse();

      manuscriptControllerMock.fetchById.mockResolvedValueOnce(
        manuscriptResponse,
      );

      const response = await supertest(app).get('/manuscripts/123');

      expect(response.body).toEqual(manuscriptResponse);
    });

    test('Should call the controller with the right parameter', async () => {
      const manuscriptId = 'abc123';

      await supertest(app).get(`/manuscripts/${manuscriptId}`);

      expect(manuscriptControllerMock.fetchById).toHaveBeenCalledWith(
        manuscriptId,
      );
    });
  });

  describe('POST /manuscripts/', () => {
    const manuscriptResponse = getManuscriptResponse();

    test('Should return 403 when not allowed to create a manuscript because user is not onboarded', async () => {
      const createManuscriptRequest = getManuscriptCreateDataObject();

      userMockFactory.mockReturnValueOnce({
        ...createUserResponse(),
        onboarded: false,
      });

      const response = await supertest(app)
        .post('/manuscripts')
        .send(createManuscriptRequest)
        .set('Accept', 'application/json');

      expect(response.status).toEqual(403);
    });

    test('Should return 403 when not allowed to create a manuscript because user does not belong to the team', async () => {
      const createManuscriptRequest: ManuscriptPostRequest = {
        ...getManuscriptPostBody(),
        teamId: 'team-3',
      };

      userMockFactory.mockReturnValueOnce({
        ...createUserResponse(),
        teams: [
          {
            role: 'Key Personnel',
            displayName: 'Test 1',
            id: 'test-1',
          },
          {
            role: 'Collaborating PI',
            displayName: 'Test 2',
            id: 'test-2',
          },
        ],
      });

      const response = await supertest(app)
        .post('/manuscripts')
        .send(createManuscriptRequest)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(403);
    });

    test('Should return a 201 and pass input to the controller', async () => {
      const teamId = 'team-1';

      const createManuscriptRequest: ManuscriptPostRequest = {
        ...getManuscriptPostBody(),
        teamId,
      };

      userMockFactory.mockReturnValueOnce({
        ...createUserResponse(),
        teams: [
          {
            role: 'Key Personnel',
            displayName: 'Test 1',
            id: teamId,
          },
        ],
      });

      manuscriptControllerMock.create.mockResolvedValueOnce(manuscriptResponse);

      const response = await supertest(app)
        .post('/manuscripts')
        .send(createManuscriptRequest)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(manuscriptControllerMock.create).toHaveBeenCalledWith({
        ...createManuscriptRequest,
        userId: 'user-id-0',
      });

      expect(response.body).toEqual(manuscriptResponse);
    });

    describe('Validation', () => {
      test('Should return 400 when title is missing', async () => {
        const { title: _title, ...createManuscriptRequest } =
          getManuscriptCreateDataObject();

        const response = await supertest(app)
          .post('/manuscripts')
          .send(createManuscriptRequest)
          .set('Accept', 'application/json');

        expect(response.status).toEqual(400);
      });

      test('Should return 400 when teamId is missing', async () => {
        const { teamId: _teamId, ...createManuscriptRequest } =
          getManuscriptCreateDataObject();

        const response = await supertest(app)
          .post('/manuscripts')
          .send(createManuscriptRequest)
          .set('Accept', 'application/json');

        expect(response.status).toEqual(400);
      });

      test('Should return 400 when versions are missing', async () => {
        const { versions: _versions, ...createManuscriptRequest } =
          getManuscriptCreateDataObject();

        const response = await supertest(app)
          .post('/manuscripts')
          .send(createManuscriptRequest)
          .set('Accept', 'application/json');

        expect(response.status).toEqual(400);
      });

      test('Should return 400 when more than a single version is sent', async () => {
        const createManuscriptRequest = getManuscriptCreateDataObject();
        createManuscriptRequest.versions.push({
          lifecycle: 'Preprint',
          type: 'Original Research',
          manuscriptFile: {
            url: 'http://example.com/file.pdf',
            filename: 'file.pdf',
            id: 'file-id',
          },
          teams: ['team-1'],
          labs: [],
          description: '',
          firstAuthors: [],
          correspondingAuthor: [],
          additionalAuthors: [],
        });

        const response = await supertest(app)
          .post('/manuscripts')
          .send(createManuscriptRequest)
          .set('Accept', 'application/json');

        expect(response.status).toEqual(400);
      });

      test('Should return 400 when an empty array of versions is sent', async () => {
        const createManuscriptRequest = getManuscriptCreateDataObject();
        createManuscriptRequest.versions = [];

        const response = await supertest(app)
          .post('/manuscripts')
          .send(createManuscriptRequest)
          .set('Accept', 'application/json');

        expect(response.status).toEqual(400);
      });
    });
  });

  describe('POST /manuscripts/file-upload', () => {
    const manuscriptFileResponse = getManuscriptFileResponse();

    test('Should return 403 when not allowed to create a manuscript because user is not onboarded', async () => {
      userMockFactory.mockReturnValueOnce({
        ...createUserResponse(),
        onboarded: false,
      });

      const response = await supertest(app)
        .post('/manuscripts/file-upload')
        .attach('file', Buffer.from('file content'), {
          filename: 'file.pdf',
          contentType: 'application/pdf',
        })
        .field('fileType', 'Manuscript File');

      expect(response.status).toEqual(403);
    });

    test('Should return a 201 and pass input to the controller', async () => {
      userMockFactory.mockReturnValueOnce({
        ...createUserResponse(),
        onboarded: true,
      });
      manuscriptControllerMock.createFile.mockResolvedValueOnce(
        manuscriptFileResponse,
      );

      const response = await supertest(app)
        .post('/manuscripts/file-upload')
        .attach('file', Buffer.from('file content'), {
          filename: 'file.pdf',
          contentType: 'application/pdf',
        })
        .field('fileType', 'Manuscript File');

      expect(manuscriptControllerMock.createFile).toHaveBeenCalledWith({
        filename: 'file.pdf',
        fileType: 'Manuscript File',
        content: expect.any(Buffer),
        contentType: 'application/pdf',
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(manuscriptFileResponse);
    });

    test('Should return 400 if the file is missing', async () => {
      const response = await supertest(app).post('/manuscripts/file-upload');

      expect(response.status).toBe(400);
    });

    it.each([
      {
        fileType: 'Manuscript File',
        mimeType: 'text/csv',
        extension: 'csv',
        acceptedExtension: 'pdf',
      },
      {
        fileType: 'Key Resource Table',
        mimeType: 'application/pdf',
        extension: 'pdf',
        acceptedExtension: 'csv',
      },
      {
        fileType: 'Additional Files',
        mimeType: 'image/png',
        extension: 'png',
        acceptedExtension: 'csv',
      },
    ])(
      'should return 400 if file type is $fileType and the file mimetype is not $acceptedExtension',
      async ({ fileType, mimeType, extension }) => {
        const response = await supertest(app)
          .post('/manuscripts/file-upload')
          .attach('file', Buffer.from('file content'), {
            filename: `file.${extension}`,
            contentType: mimeType,
          })
          .field('fileType', fileType);

        expect(response.status).toBe(400);
      },
    );
  });

  describe('PUT /manuscripts/{id}', () => {
    const manuscriptId = 'manuscript-id-1';
    const manuscriptResponse = getManuscriptResponse();
    const manuscriptPutRequest = getManuscriptUpdateStatusDataObject();

    test('Should return 403 when not allowed to update a manuscript because user is not onboarded', async () => {
      userMockFactory.mockReturnValueOnce({
        ...createUserResponse(),
        onboarded: false,
      });

      const response = await supertest(app)
        .put(`/manuscripts/${manuscriptId}`)
        .send(manuscriptPutRequest)
        .set('Accept', 'application/json');

      expect(response.status).toEqual(403);
    });

    test('Should return 403 when not allowed to update a manuscript because user is not a staff', async () => {
      userMockFactory.mockReturnValueOnce({
        ...createUserResponse(),
        role: 'Grantee',
      });

      const response = await supertest(app)
        .put(`/manuscripts/${manuscriptId}`)
        .send(manuscriptPutRequest)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(403);
    });

    test('Should return 403 when not allowed to update a manuscript because user is not a staff belonging to open science team', async () => {
      userMockFactory.mockReturnValueOnce({
        ...createUserResponse(),
        role: 'Staff',
        openScienceTeamMember: false,
      });

      const response = await supertest(app)
        .put(`/manuscripts/${manuscriptId}`)
        .send(manuscriptPutRequest)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(403);
    });

    test('Should send the data to the controller and return status 200 along with all the manuscript data', async () => {
      manuscriptControllerMock.update.mockResolvedValueOnce(manuscriptResponse);

      userMockFactory.mockReturnValueOnce({
        ...createUserResponse(),
        role: 'Staff',
        openScienceTeamMember: true,
      });

      const response = await supertest(app)
        .put(`/manuscripts/${manuscriptId}`)
        .send(manuscriptPutRequest)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(manuscriptControllerMock.update).toHaveBeenCalledWith(
        manuscriptId,
        manuscriptPutRequest,
        'user-id-0',
      );
      expect(response.body).toEqual(manuscriptResponse);
    });

    describe('validation', () => {
      test('Should return 400 when additional parameters are sent', async () => {
        userMockFactory.mockReturnValueOnce({
          ...createUserResponse(),
          role: 'Staff',
          openScienceTeamMember: true,
        });

        const response = await supertest(app)
          .put(`/manuscripts/${manuscriptId}`)
          .send({
            ...manuscriptPutRequest,
            eligibilityReasons: ['New reason'],
          })
          .set('Accept', 'application/json');

        expect(response.status).toEqual(400);
      });
    });
  });
});
