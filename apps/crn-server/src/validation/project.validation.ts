import {
  FetchProjectMilestonesOptions,
  grantTypes,
  MilestoneCreateRequest,
  milestoneSortOptions,
  milestoneStatuses,
  ProjectStatus,
  ProjectTool,
  ProjectType,
} from '@asap-hub/model';
import {
  fetchOptionsValidationSchema,
  validateInput,
} from '@asap-hub/server-common';
import { JSONSchemaType } from 'ajv';

const projectTypes: readonly ProjectType[] = [
  'Discovery Project',
  'Resource Project',
  'Trainee Project',
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

type ProjectPatchRequest = {
  tools: ProjectTool[];
};

const projectToolSchema: JSONSchemaType<ProjectTool> = {
  type: 'object',
  properties: {
    id: { type: 'string', nullable: true },
    name: { type: 'string', minLength: 1, pattern: '\\S' },
    url: { type: 'string', minLength: 1, pattern: '\\S' },
    description: { type: 'string', nullable: true },
  },
  required: ['name', 'url'],
  additionalProperties: false,
};

const projectPatchRequestValidationSchema: JSONSchemaType<ProjectPatchRequest> =
  {
    type: 'object',
    properties: {
      tools: {
        type: 'array',
        items: projectToolSchema,
        nullable: false,
      },
    },
    required: ['tools'],
    additionalProperties: false,
  };

export const validateProjectPatchRequest = validateInput(
  projectPatchRequestValidationSchema,
  {
    skipNull: true,
    coerce: false,
  },
);

const projectMilestonesFetchOptionsValidationSchema: JSONSchemaType<FetchProjectMilestonesOptions> =
  {
    type: 'object',
    properties: {
      ...fetchOptionsValidationSchema.properties,
      grantType: { type: 'string', enum: grantTypes, nullable: true },
      sort: { type: 'string', enum: milestoneSortOptions, nullable: true },
    },
    additionalProperties: false,
  };

export const validateProjectMilestonesFetchOptions = validateInput(
  projectMilestonesFetchOptionsValidationSchema,
  {
    skipNull: true,
    coerce: true,
  },
);

const projectMilestoneCreateValidationSchema: JSONSchemaType<MilestoneCreateRequest> =
  {
    type: 'object',
    properties: {
      grantType: { type: 'string', enum: grantTypes },
      description: { type: 'string', minLength: 1, maxLength: 750 },
      status: { type: 'string', enum: milestoneStatuses },
      aimIds: {
        type: 'array',
        items: { type: 'string' },
        minItems: 1,
      },
      relatedArticleIds: {
        type: 'array',
        nullable: true,
        items: { type: 'string' },
      },
    },
    required: ['grantType', 'description', 'status', 'aimIds'],
    additionalProperties: false,
  };

export const validateProjectMilestoneCreateRequest = validateInput(
  projectMilestoneCreateValidationSchema,
  {
    skipNull: true,
    coerce: false,
  },
);
