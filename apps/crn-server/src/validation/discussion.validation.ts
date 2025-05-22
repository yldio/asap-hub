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
    manuscriptId: { type: 'string' },
    text: { type: 'string' },
    notificationList: { type: 'string', nullable: true },
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
      manuscriptId: { type: 'string', maxLength: 256 },
      title: { type: 'string', maxLength: 100 },
      text: { type: 'string' },
      notificationList: { type: 'string', nullable: true },
    },
    required: ['manuscriptId', 'title', 'text'],
    additionalProperties: false,
  };

export const validateDiscussionCreateRequest = validateInput(
  discussionCreateRequestValidationSchema,
  {
    skipNull: true,
    coerce: false,
  },
);
