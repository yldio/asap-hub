import { ComplianceReportPostRequest, manuscriptStatus } from '@asap-hub/model';
import { validateInput } from '@asap-hub/server-common';
import { urlExpression } from '@asap-hub/validation';
import { JSONSchemaType } from 'ajv';

const complianceReportPostRequestValidationSchema: JSONSchemaType<ComplianceReportPostRequest> =
  {
    type: 'object',
    properties: {
      description: { type: 'string' },
      url: {
        type: 'string',
        pattern: urlExpression,
      },
      manuscriptVersionId: { type: 'string' },
      discussionId: { type: 'string', nullable: true },
      versionId: { type: 'string', nullable: true },
      manuscriptId: { type: 'string', nullable: true },
      status: { enum: manuscriptStatus, type: 'string', nullable: false },
      sendNotifications: { type: 'boolean', nullable: true },
      notificationList: { type: 'string', nullable: true },
    },
    required: ['description', 'url', 'manuscriptVersionId', 'status'],
    additionalProperties: false,
  };

export const validateComplianceReportPostRequestParameters = validateInput(
  complianceReportPostRequestValidationSchema,
  {
    skipNull: true,
    coerce: true,
  },
);
