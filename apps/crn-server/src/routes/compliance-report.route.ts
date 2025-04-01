import { isCMSAdministrator } from '@asap-hub/validation';
import Boom from '@hapi/boom';
import { Router } from 'express';
import ComplianceReportController from '../controllers/compliance-report.controller';
import { validateComplianceReportPostRequestParameters } from '../validation/compliance-report.validation';
import ManuscriptController from '../controllers/manuscript.controller';

export const complianceReportRouteFactory = (
  complianceReportController: ComplianceReportController,
  manuscriptController: ManuscriptController,
): Router => {
  const complianceReportRoutes = Router();

  complianceReportRoutes.post('/compliance-reports', async (req, res) => {
    const { body, loggedInUser } = req;

    const {
      status,
      manuscriptId,
      sendNotifications,
      notificationList,
      ...createRequest
    } = validateComplianceReportPostRequestParameters(body);

    if (!loggedInUser || !isCMSAdministrator(loggedInUser.role)) {
      throw Boom.forbidden();
    }
    const manuscript = (await manuscriptController.fetchById(manuscriptId));

    const complianceReport = await complianceReportController.create({
      ...createRequest,
      userId: loggedInUser.id,
    });

    if (manuscript && status && manuscript.status !== status && manuscriptId) {
      await manuscriptController.update(
        manuscriptId,
        { status, sendNotifications, notificationList },
        loggedInUser.id,
      );
    }

    res.status(201).json({ complianceReport, status });
  });

  return complianceReportRoutes;
};
