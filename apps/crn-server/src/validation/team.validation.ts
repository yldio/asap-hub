import { TeamPatchRequest } from '@asap-hub/model';
import { validateInput } from '@asap-hub/server-common';
import { JSONSchemaType } from 'ajv';

type TeamParameters = {
  teamId: string;
};

const teamParametersValidationSchema: JSONSchemaType<TeamParameters> = {
  type: 'object',
  properties: {
    teamId: { type: 'string' },
  },
  required: ['teamId'],
  additionalProperties: false,
};

export const validateTeamParameters = validateInput(
  teamParametersValidationSchema,
  {
    skipNull: false,
    coerce: false,
  },
);

const teamPatchRequestValidationSchema: JSONSchemaType<TeamPatchRequest> = {
  type: 'object',
  properties: {
    tools: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          name: { type: 'string' },
          url: { type: 'string' },
          description: { type: 'string', nullable: true },
        },
        required: ['name', 'url'],
      },
      nullable: true,
    },
  },
  required: ['tools'],
  additionalProperties: false,
};

export const validateTeamPatchRequest = validateInput(
  teamPatchRequestValidationSchema,
  {
    skipNull: true,
    coerce: false,
  },
);
