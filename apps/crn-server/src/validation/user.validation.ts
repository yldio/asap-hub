import { teamRole, userDegree, UserPatchRequest } from '@asap-hub/model';
import { validateInput } from '@asap-hub/server-common';
import { JSONSchemaType } from 'ajv';

const userPatchRequestValidationSchema: JSONSchemaType<UserPatchRequest> = {
  type: 'object',
  properties: {
    jobTitle: { type: 'string', nullable: true },
    onboarded: { type: 'boolean', nullable: true },
    dismissedGettingStarted: { type: 'boolean', nullable: true },
    contactEmail: { type: 'string', nullable: true },
    firstName: { type: 'string', nullable: true },
    middleName: { type: 'string', nullable: true },
    lastName: { type: 'string', nullable: true },
    nickname: { type: 'string', nullable: true },
    degree: {
      type: 'string',
      enum: [...userDegree, '', null],
      nullable: true,
    },
    institution: { type: 'string', nullable: true },
    biography: { type: 'string', nullable: true },
    country: { type: 'string', nullable: true },
    stateOrProvince: { type: 'string', nullable: true },
    city: { type: 'string', nullable: true },
    tagIds: {
      type: 'array',
      items: {
        type: 'string',
      },
      nullable: true,
    },
    expertiseAndResourceDescription: { type: 'string', nullable: true },
    researchInterests: { type: 'string', nullable: true },
    responsibilities: { type: 'string', nullable: true },
    reachOut: { type: 'string', maxLength: 250, nullable: true },
    questions: { type: 'array', items: { type: 'string' }, nullable: true },
    teams: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string' },
          role: { type: 'string', enum: teamRole },
          inactiveSinceDate: { type: 'string', nullable: true },
        },
        required: ['id', 'role'],
      },
      nullable: true,
    },
    social: {
      type: 'object',
      additionalProperties: false,
      properties: {
        website1: { type: 'string', nullable: true },
        website2: { type: 'string', nullable: true },
        linkedIn: { type: 'string', nullable: true },
        researcherId: { type: 'string', nullable: true },
        twitter: { type: 'string', nullable: true },
        github: { type: 'string', nullable: true },
        googleScholar: { type: 'string', nullable: true },
        researchGate: { type: 'string', nullable: true },
      },
      nullable: true,
    },
  },
  additionalProperties: false,
};

export const validateUserPatchRequest = validateInput(
  userPatchRequestValidationSchema,
  {
    skipNull: true,
  },
);

type UserPostRequest = { avatar: string };

const userPostRequestValidationSchema: JSONSchemaType<UserPostRequest> = {
  type: 'object',
  properties: {
    avatar: { type: 'string' },
  },
  required: ['avatar'],
  additionalProperties: false,
};

export const validateUserPostRequestInput = validateInput(
  userPostRequestValidationSchema,
  {
    skipNull: false,
  },
);

type UserParameters = {
  userId: string;
};

const userParametersValidationSchema: JSONSchemaType<UserParameters> = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
  },
  required: ['userId'],
  additionalProperties: false,
};

export const validateUserParameters = validateInput(
  userParametersValidationSchema,
  {
    skipNull: false,
    coerce: true,
  },
);
