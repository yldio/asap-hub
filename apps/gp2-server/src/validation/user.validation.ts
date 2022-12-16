import { validateInput } from '@asap-hub/server-common';
import { JSONSchemaType } from 'ajv';
import { gp2 } from '@asap-hub/model';

const { userDegrees, userRegions, keywords } = gp2;
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

const userPatchRequestValidationSchema: JSONSchemaType<gp2.UserPatchRequest> = {
  type: 'object',
  properties: {
    firstName: { type: 'string', nullable: true, minLength: 1 },
    lastName: { type: 'string', nullable: true, minLength: 1 },
    degrees: {
      type: 'array',
      items: {
        type: 'string',
        enum: [...userDegrees],
      },
      nullable: true,
    },
    region: {
      type: 'string',
      enum: [...userRegions],
      nullable: true,
    },
    country: { type: 'string', nullable: true, minLength: 1 },
    city: { type: 'string', nullable: true },
    positions: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          role: { type: 'string' },
          department: { type: 'string' },
          institution: { type: 'string' },
        },
        required: ['role', 'department', 'institution'],
      },
      nullable: true,
    },
    onboarded: { type: 'boolean', nullable: true },
    secondaryEmail: { type: 'string', nullable: true },
    telephone: {
      nullable: true,
      type: 'object',
      additionalProperties: false,
      properties: {
        countryCode: { type: 'string', nullable: true },
        number: { type: 'string', nullable: true },
      },
    },
    keywords: {
      type: 'array',
      minItems: 1,
      maxItems: 10,
      items: {
        type: 'string',
        enum: [...keywords],
      },
      nullable: true,
    },
    biography: {
      type: 'string',
      nullable: true,
      minLength: 1,
      maxLength: 2500,
    },
    fundingStreams: { type: 'string', nullable: true, maxLength: 1000 },
    questions: {
      type: 'array',
      minItems: 0,
      maxItems: 10,
      items: {
        type: 'string',
        maxLength: 250,
        nullable: true,
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
