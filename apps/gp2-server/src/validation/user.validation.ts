import { gp2 } from '@asap-hub/model';
import { validateInput } from '@asap-hub/server-common';
import {
  emailExpression,
  orcidExpression,
  telephoneCountryExpression,
  telephoneNumberExpression,
  urlExpression,
} from '@asap-hub/validation';
import { JSONSchemaType } from 'ajv';

const { userDegrees, userRegions, userContributingCohortRole } = gp2;
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
    firstName: { type: 'string', nullable: true, minLength: 1, maxLength: 50 },
    middleName: { type: 'string', nullable: true },
    lastName: { type: 'string', nullable: true, minLength: 1, maxLength: 50 },
    nickname: { type: 'string', nullable: true },
    degrees: {
      type: 'array',
      items: {
        type: 'string',
        enum: userDegrees,
      },
      nullable: true,
    },
    region: {
      type: 'string',
      enum: userRegions,
      nullable: true,
    },
    country: { type: 'string', nullable: true, minLength: 1 },
    stateOrProvince: { type: 'string', nullable: true },
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
    alternativeEmail: {
      type: 'string',
      nullable: true,
      pattern: emailExpression,
    },
    telephone: {
      nullable: true,
      type: 'object',
      additionalProperties: false,
      properties: {
        countryCode: {
          type: 'string',
          nullable: true,
          pattern: telephoneCountryExpression,
        },
        number: {
          type: 'string',
          nullable: true,
          pattern: telephoneNumberExpression,
        },
      },
    },
    tags: {
      type: 'array',
      minItems: 1,
      maxItems: 10,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
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
      maxItems: 5,
      items: {
        type: 'string',
        minLength: 1,
        maxLength: 250,
        nullable: false,
      },
      nullable: true,
    },
    contributingCohorts: {
      type: 'array',
      minItems: 0,
      maxItems: 10,
      nullable: true,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          contributingCohortId: { type: 'string' },
          role: { type: 'string', enum: userContributingCohortRole },
          studyUrl: {
            type: 'string',
            pattern: urlExpression,
            nullable: true,
          },
        },
        required: ['contributingCohortId', 'role'],
      },
    },
    social: {
      type: 'object',
      nullable: true,
      additionalProperties: false,
      properties: {
        googleScholar: {
          type: 'string',
          pattern: urlExpression,
          nullable: true,
        },
        researchGate: {
          type: 'string',
          pattern: urlExpression,
          nullable: true,
        },
        researcherId: {
          type: 'string',
          pattern: urlExpression,
          nullable: true,
        },
        blog: { type: 'string', pattern: urlExpression, nullable: true },
        blueSky: { type: 'string', pattern: urlExpression, nullable: true },
        threads: { type: 'string', pattern: urlExpression, nullable: true },
        twitter: { type: 'string', pattern: urlExpression, nullable: true },
        linkedIn: { type: 'string', pattern: urlExpression, nullable: true },
        github: { type: 'string', pattern: urlExpression, nullable: true },
      },
    },
    orcid: {
      type: 'string',
      pattern: orcidExpression,
      nullable: true,
    },
  },
  additionalProperties: false,
};

export const validateUserPatchRequest = validateInput(
  userPatchRequestValidationSchema,
  {
    skipNull: true,
    nullableKeys: ['alternativeEmail'],
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
