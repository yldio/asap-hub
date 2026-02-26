import { TeamPatchRequest, TeamTool } from '@asap-hub/model';
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
// TODO: Remove this schema once we have migrated all tools to projects
const teamToolSchema: JSONSchemaType<TeamTool> = {
  type: 'object',
  properties: {
    id: { type: 'string', nullable: true },
    name: { type: 'string' },
    url: { type: 'string' },
    description: { type: 'string', nullable: true },
  },
  required: ['name', 'url'],
  additionalProperties: false,
};

// TODO: Remove this validation schema once we have migrated all tools to projects
const teamPatchRequestValidationSchema: JSONSchemaType<TeamPatchRequest> = {
  type: 'object',
  properties: {
    tools: {
      type: 'array',
      items: teamToolSchema,
      nullable: true,
    },
  },
  required: ['tools'],
  additionalProperties: false,
} as unknown as JSONSchemaType<TeamPatchRequest>;

// TODO: Remove this validation once we have migrated all tools to projects
export const validateTeamPatchRequest = validateInput(
  teamPatchRequestValidationSchema,
  {
    skipNull: true,
    coerce: false,
  },
);
