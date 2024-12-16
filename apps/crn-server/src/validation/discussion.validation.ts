import {
  DiscussionCreateRequest,
  DiscussionPatchRequest,
} from '@asap-hub/model';
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

const discussionPatchRequestValidationSchema: JSONSchemaType<DiscussionPatchRequest> =
  {
    type: 'object',
    properties: {
      replyText: { type: 'string', maxLength: 256 },
    },
    required: ['replyText'],
    additionalProperties: false,
  };

export const validateDiscussionPatchRequest = validateInput(
  discussionPatchRequestValidationSchema,
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
      type: { type: 'string', maxLength: 256 },
    },
    required: ['message'],
    additionalProperties: false,
  };

export const validateDiscussionCreateRequest = validateInput(
  discussionCreateRequestValidationSchema,
  {
    skipNull: true,
    coerce: false,
  },
);
