import { ComplianceReportPostRequest } from '@asap-hub/model';
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
    },
    required: ['description', 'url', 'manuscriptVersionId'],
    additionalProperties: false,
  };

export const validateComplianceReportPostRequestParameters = validateInput(
  complianceReportPostRequestValidationSchema,
  {
    skipNull: true,
    coerce: true,
  },
);
