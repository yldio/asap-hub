import { DiscussionCreateRequest, DiscussionRequest } from '@asap-hub/model';
import { validateInput } from '@asap-hub/server-common';
import { JSONSchemaType } from 'ajv';

type DiscussionParameters = {
  discussionId: string;
};

const discussionParametersValidationSchema: JSONSchemaType<DiscussionParameters> =
  {
    type: 'object',
    properties: {
      discussionId: { type: 'string' },
    },
    required: ['discussionId'],
    additionalProperties: false,
  };

export const validateDiscussionParameters = validateInput(
  discussionParametersValidationSchema,
  {
    skipNull: false,
    coerce: false,
  },
);

const DiscussionRequestValidationSchema: JSONSchemaType<DiscussionRequest> = {
  type: 'object',
  properties: {
    text: { type: 'string', maxLength: 256 },
  },
  required: ['text'],
  additionalProperties: false,
};

export const validateDiscussionRequest = validateInput(
  DiscussionRequestValidationSchema,
  {
    skipNull: true,
    coerce: false,
  },
);

const discussionCreateRequestValidationSchema: JSONSchemaType<DiscussionCreateRequest> =
  {
    type: 'object',
    properties: {
      message: { type: 'string', maxLength: 256 },
      id: { type: 'string', maxLength: 256 },
      type: { type: 'string', enum: ['compliance-report'], maxLength: 256 },
    },
    required: ['message', 'id'],
    additionalProperties: false,
  };

export const validateDiscussionCreateRequest = validateInput(
  discussionCreateRequestValidationSchema,
  {
    skipNull: true,
    coerce: false,
  },
);
