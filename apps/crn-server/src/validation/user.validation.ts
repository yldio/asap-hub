import { teamRole, userDegree, UserPatchRequest } from '@asap-hub/model';
import { validateInput } from '@asap-hub/server-common';
import { crnEmailExpression } from '@asap-hub/validation';
import { JSONSchemaType } from 'ajv';

// Defence in depth. The modal validates against the same expression, so a
// request that reaches here with a bad address did not come from the form.
const emailField = {
  type: 'string',
  nullable: true,
  pattern: crnEmailExpression,
} as const;

const userPatchRequestValidationSchema: JSONSchemaType<UserPatchRequest> = {
  type: 'object',
  properties: {
    jobTitle: { type: 'string', nullable: true },
    onboarded: { type: 'boolean', nullable: true },
    dismissedGettingStarted: { type: 'boolean', nullable: true },
    contactEmail: emailField,
    personalEmail: emailField,
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
        blueSky: { type: 'string', nullable: true },
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
    // Report every failure, not just the first: the Contact Details form marks
    // both email fields at once, and with the default AJV setting a request
    // failing both would come back naming only contactEmail.
    allErrors: true,
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
