import { ProjectStatus, ProjectType } from '@asap-hub/model';
import {
  fetchOptionsValidationSchema,
  validateInput,
} from '@asap-hub/server-common';
import { JSONSchemaType } from 'ajv';

const projectTypes: readonly ProjectType[] = [
  'Discovery',
  'Resource',
  'Trainee',
];

const projectStatuses: readonly ProjectStatus[] = [
  'Active',
  'Completed',
  'Closed',
];

type ProjectFetchQuery = {
  take?: number;
  skip?: number;
  search?: string;
  projectType?: ProjectType[];
  status?: ProjectStatus[];
  tags?: string[];
  teamId?: string;
};

const { filter: _ignoredFilter, ...baseFetchProperties } =
  fetchOptionsValidationSchema.properties;

const projectFetchValidationSchema: JSONSchemaType<ProjectFetchQuery> = {
  type: 'object',
  properties: {
    ...baseFetchProperties,
    projectType: {
      type: 'array',
      nullable: true,
      items: { type: 'string', enum: projectTypes },
    },
    status: {
      type: 'array',
      nullable: true,
      items: { type: 'string', enum: projectStatuses },
    },
    tags: {
      type: 'array',
      nullable: true,
      items: { type: 'string' },
    },
    teamId: { type: 'string', nullable: true },
  },
  additionalProperties: false,
};

export const validateProjectFetchParameters = validateInput(
  projectFetchValidationSchema,
  {
    skipNull: true,
    coerce: true,
  },
);

type ProjectParameters = {
  projectId: string;
};

const projectParametersValidationSchema: JSONSchemaType<ProjectParameters> = {
  type: 'object',
  properties: {
    projectId: { type: 'string' },
  },
  required: ['projectId'],
  additionalProperties: false,
};

export const validateProjectParameters = validateInput(
  projectParametersValidationSchema,
  {
    skipNull: false,
    coerce: true,
  },
);
