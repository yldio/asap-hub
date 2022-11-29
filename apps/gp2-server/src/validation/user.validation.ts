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
    firstName: { type: 'string', nullable: true },
    lastName: { type: 'string', nullable: true },
    degrees: {
      type: 'array',
      items: {
        type: 'string',
        enum: [...userDegrees, '', null],
      },
      nullable: true,
    },
    region: {
      type: 'string',
      enum: [...userRegions, null],
      nullable: true,
    },
    country: { type: 'string', nullable: true },
    city: { type: 'string', nullable: true },
    positions: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          role: { type: 'string', nullable: true },
          department: { type: 'string', nullable: true },
          institution: { type: 'string', nullable: true },
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
      items: {
        type: 'string',
        enum: [...keywords, '', null],
      },
      nullable: true,
    },
    biography: { type: 'string', nullable: true },
    fundingStreams: { type: 'string', nullable: true },
  },
  additionalProperties: false,
};

export const validateUserPatchRequest = validateInput(
  userPatchRequestValidationSchema,
  {
    skipNull: true,
  },
);
