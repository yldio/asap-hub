import { createUserResponse } from '@asap-hub/fixtures';
import { UserResponse } from '@asap-hub/model';
import { AuthHandler } from '@asap-hub/server-common';
import supertest from 'supertest';

import { appFactory } from '../../src/app';
import { getComplianceReportCreateDataObject } from '../fixtures/compliance-reports.fixtures';
import { loggerMock } from '../mocks/logger.mock';
import { complianceReportControllerMock } from '../mocks/compliance-report.controller.mock';

describe('/compliance-reports/ route', () => {
  const userMockFactory = jest.fn<UserResponse, []>();
  const authHandlerMock: AuthHandler = (req, _res, next) => {
    req.loggedInUser = userMockFactory();
    next();
  };

  const app = appFactory({
    complianceReportController: complianceReportControllerMock,
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

      userMockFactory.mockReturnValueOnce(user);

      complianceReportControllerMock.create.mockResolvedValueOnce(
        complianceReportId,
      );

      const response = await supertest(app)
        .post('/compliance-reports')
        .send(createComplianceReportRequest)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(complianceReportControllerMock.create).toHaveBeenCalledWith({
        ...createComplianceReportRequest,
        userId: user.id,
      });

      expect(response.body).toEqual(complianceReportId);
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
