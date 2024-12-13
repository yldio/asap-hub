import { isCMSAdministrator } from '@asap-hub/validation';
import Boom from '@hapi/boom';
import { Router } from 'express';
import ComplianceReportController from '../controllers/compliance-report.controller';
import { validateComplianceReportPostRequestParameters } from '../validation/compliance-report.validation';

export const complianceReportRouteFactory = (
  complianceReportController: ComplianceReportController,
): Router => {
  const complianceReportRoutes = Router();

  complianceReportRoutes.post('/compliance-reports', async (req, res) => {
    const { body, loggedInUser } = req;
    console.log('here first');
    const createRequest = validateComplianceReportPostRequestParameters(body);
    console.log('here second');

    if (!loggedInUser || !isCMSAdministrator(loggedInUser.role)) {
      throw Boom.forbidden();
    }

    const complianceReport = await complianceReportController.create({
      ...createRequest,
      userId: loggedInUser.id,
    });

    res.status(201).json(complianceReport);
  });

  return complianceReportRoutes;
};
