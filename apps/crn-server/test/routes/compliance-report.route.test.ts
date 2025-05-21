import { createUserResponse } from '@asap-hub/fixtures';
import { ComplianceReportResponse, UserResponse } from '@asap-hub/model';
import { AuthHandler } from '@asap-hub/server-common';
import supertest from 'supertest';

import { appFactory } from '../../src/app';
import {
  getComplianceReportCreateDataObject,
  getComplianceReportDataObject,
} from '../fixtures/compliance-reports.fixtures';
import { loggerMock } from '../mocks/logger.mock';
import { complianceReportControllerMock } from '../mocks/compliance-report.controller.mock';
import { manuscriptControllerMock } from '../mocks/manuscript.controller.mock';

describe('/compliance-reports/ route', () => {
  const userMockFactory = jest.fn<UserResponse, []>();
  const authHandlerMock: AuthHandler = (req, _res, next) => {
    req.loggedInUser = userMockFactory();
    next();
  };

  const app = appFactory({
    complianceReportController: complianceReportControllerMock,
    manuscriptController: manuscriptControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  beforeEach(() => {
    userMockFactory.mockReturnValue({ ...createUserResponse(), role: 'Staff' });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('POST /compliance-reports/', () => {
    const complianceReportId = 'compliance-report-id';
    const { userId, ...createComplianceReportRequest } =
      getComplianceReportCreateDataObject();

    test('Should return 403 when not allowed to create a compliance report because user is not onboarded', async () => {
      userMockFactory.mockReturnValueOnce({
        ...createUserResponse(),
        onboarded: false,
        role: 'Staff',
      });

      const response = await supertest(app)
        .post('/compliance-reports')
        .send(createComplianceReportRequest)
        .set('Accept', 'application/json');

      expect(response.status).toEqual(403);
    });

    test('Should return 403 when not allowed to create a compliance report because user is not ASAP Staff', async () => {
      userMockFactory.mockReturnValueOnce({
        ...createUserResponse(),
        onboarded: true,
        role: 'Grantee',
      });

      const response = await supertest(app)
        .post('/compliance-reports')
        .send(createComplianceReportRequest)
        .set('Accept', 'application/json');

      expect(response.status).toEqual(403);
    });

    test('Should return a 201 and pass input to the controller', async () => {
      const user = {
        ...createUserResponse(),
        role: 'Staff',
      } as UserResponse;

      const mockComplianceReport: Omit<
        ComplianceReportResponse['complianceReport'],
        'manuscriptId'
      > = {
        id: complianceReportId,
        url: 'https://example.com',
        description: 'Test description',
        createdBy: {
          ...user,
          teams: user.teams.map((team) => ({
            id: team.id,
            name: team.displayName || '',
          })),
        },
        createdDate: '2024-01-01',
        count: 1,
      };

      userMockFactory.mockReturnValueOnce(user);

      complianceReportControllerMock.create.mockResolvedValueOnce(
        mockComplianceReport,
      );

      manuscriptControllerMock.fetchById.mockResolvedValueOnce({
        id: 'manuscript-1',
        title: 'Manuscript 1',
        teamId: 'team-1',
        versions: [],
        count: 1,
        assignedUsers: [],
        status: 'Manuscript Resubmitted',
        discussions: [],
      });

      manuscriptControllerMock.update.mockResolvedValueOnce({
        id: 'manuscript-1',
        title: 'Manuscript 1',
        teamId: 'team-1',
        versions: [],
        count: 1,
        assignedUsers: [],
        status: 'Review Compliance Report',
        discussions: [],
      });

      const response = await supertest(app)
        .post('/compliance-reports')
        .send({
          ...createComplianceReportRequest,
          status: 'Review Compliance Report',
          notificationList: '',
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(complianceReportControllerMock.create).toHaveBeenCalledWith({
        url: createComplianceReportRequest.url,
        description: createComplianceReportRequest.description,
        manuscriptVersionId: createComplianceReportRequest.manuscriptVersionId,
        userId: user.id,
      });
      expect(manuscriptControllerMock.update).toHaveBeenCalledWith(
        'manuscript-1',
        {
          status: createComplianceReportRequest.status,
          notificationList: '',
        },
        user.id,
      );

      expect(response.body).toEqual({
        complianceReport: mockComplianceReport,
        status: 'Review Compliance Report',
      });
    });

    test('Should not update manuscript status when status is unchanged', async () => {
      const user = {
        ...createUserResponse(),
        role: 'Staff',
      } as UserResponse;

      userMockFactory.mockReturnValueOnce(user);

      complianceReportControllerMock.create.mockResolvedValueOnce(
        getComplianceReportDataObject(),
      );

      manuscriptControllerMock.fetchById.mockResolvedValueOnce({
        id: 'manuscript-1',
        title: 'Manuscript 1',
        teamId: 'team-1',
        versions: [],
        count: 1,
        assignedUsers: [],
        status: 'Review Compliance Report',
        discussions: [],
      });

      const { userId, ...requestBody } = getComplianceReportCreateDataObject();

      const response = await supertest(app)
        .post('/compliance-reports')
        .send(requestBody)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(manuscriptControllerMock.update).not.toHaveBeenCalled();
    });

    describe('Validation', () => {
      test('Should return 400 when url is missing', async () => {
        const { url: _url, ...createComplianceReportRequest } =
          getComplianceReportCreateDataObject();

        const response = await supertest(app)
          .post('/compliance-reports')
          .send(createComplianceReportRequest)
          .set('Accept', 'application/json');

        expect(response.status).toEqual(400);
      });

      test('Should return 400 when description is missing', async () => {
        const { description: _description, ...createComplianceReportRequest } =
          getComplianceReportCreateDataObject();

        const response = await supertest(app)
          .post('/compliance-reports')
          .send(createComplianceReportRequest)
          .set('Accept', 'application/json');

        expect(response.status).toEqual(400);
      });

      test('Should return 400 when manuscriptVersionId is missing', async () => {
        const {
          manuscriptVersionId: _manuscriptVersionId,
          ...createComplianceReportRequest
        } = getComplianceReportCreateDataObject();

        const response = await supertest(app)
          .post('/compliance-reports')
          .send(createComplianceReportRequest)
          .set('Accept', 'application/json');

        expect(response.status).toEqual(400);
      });
    });
  });
});
