import { validateInput } from '@asap-hub/server-common';
import { JSONSchemaType } from 'ajv';

type MilestoneArticleUpdateRequest = {
  articleIds: string[];
};

const milestoneArticleUpdateValidationSchema: JSONSchemaType<MilestoneArticleUpdateRequest> =
  {
    type: 'object',
    properties: {
      articleIds: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    required: ['articleIds'],
    additionalProperties: false,
  };

export const validateMilestoneArticleUpdateRequest = validateInput(
  milestoneArticleUpdateValidationSchema,
  {
    skipNull: true,
    coerce: false,
  },
);
