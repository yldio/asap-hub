import { DiscussionPatchRequest } from '@asap-hub/model';
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
