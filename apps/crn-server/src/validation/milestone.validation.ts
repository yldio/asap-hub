import { milestoneStatuses, MilestoneUpdateRequest } from '@asap-hub/model';
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

const milestoneUpdateValidationSchema: JSONSchemaType<MilestoneUpdateRequest> =
  {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: milestoneStatuses,
        nullable: true,
      },
      articleIds: {
        type: 'array',
        items: { type: 'string' },
        nullable: true,
      },
    },
    required: [],
    additionalProperties: false,
  };

export const validateMilestoneUpdateRequest = validateInput(
  milestoneUpdateValidationSchema,
  {
    skipNull: true,
    coerce: false,
  },
);
