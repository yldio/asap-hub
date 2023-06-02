import { gp2 as gp2Model } from '@asap-hub/model';
import { validateInput } from '@asap-hub/server-common';
import { urlExpression } from '@asap-hub/validation';
import { JSONSchemaType } from 'ajv';

type OutputParameters = {
  outputId: string;
};

const { outputDocumentTypes, outputTypes, outputSubtypes } = gp2Model;
const outputParametersValidationSchema: JSONSchemaType<OutputParameters> = {
  type: 'object',
  properties: {
    outputId: { type: 'string' },
  },
  required: ['outputId'],
  additionalProperties: false,
};

const outputsParametersValidationSchema: JSONSchemaType<gp2Model.FetchOutputOptions> =
  {
    type: 'object',
    properties: {
      take: { type: 'number', nullable: true },
      skip: { type: 'number', nullable: true },
      search: { type: 'string', nullable: true },
      filter: {
        type: 'object',
        properties: {
          workingGroup: { type: 'string', nullable: true },
          project: { type: 'string', nullable: true },
          author: {
            type: 'string',
            nullable: true,
          },
          documentType: {
            type: 'array',
            items: { type: 'string' },
            nullable: true,
          },
          link: {
            type: 'string',
            nullable: true,
            pattern: urlExpression,
          },
          title: { type: 'string', nullable: true },
        },
        nullable: true,
      },
      includeDrafts: { type: 'boolean', nullable: true },
    },
    additionalProperties: false,
  };

export const validateOutputParameters = validateInput(
  outputParametersValidationSchema,
  {
    skipNull: false,
    coerce: false,
  },
);

export const validateOutputsParameters = validateInput(
  outputsParametersValidationSchema,
  {
    skipNull: true,
    coerce: true,
  },
);

const outputPostRequestValidationSchema: JSONSchemaType<gp2Model.OutputPostRequest> =
  {
    type: 'object',
    properties: {
      documentType: {
        type: 'string',
        enum: outputDocumentTypes,
      },
      type: {
        type: 'string',
        nullable: true,
        enum: outputTypes,
      },
      subtype: {
        type: 'string',
        nullable: true,
        enum: outputSubtypes,
      },
      link: {
        type: 'string',
        nullable: true,
        pattern: urlExpression,
      },
      title: { type: 'string' },
      publishDate: { type: 'string', format: 'date-time', nullable: true },
      authors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            externalUserId: { type: 'string' },
            externalUserName: { type: 'string' },
          },
          oneOf: [
            {
              type: 'object',
              required: ['userId'],
            },
            {
              type: 'object',
              required: ['externalUserId'],
            },
            {
              type: 'object',
              required: ['externalUserName'],
            },
          ],
        },
        nullable: true,
      },
      workingGroups: {
        type: 'array',
        items: { type: 'string' },
        minItems: 0,
        maxItems: 1,
        nullable: true,
      },
      projects: {
        type: 'array',
        items: { type: 'string' },
        minItems: 0,
        maxItems: 1,
        nullable: true,
      },
    },
    required: ['documentType', 'title'],
    additionalProperties: false,
  };

export const validateOutputPostRequestParameters = validateInput(
  outputPostRequestValidationSchema,
  {
    skipNull: true,
    coerce: true,
  },
);

export const validateOutputPutRequestParameters = validateInput<
  gp2Model.OutputPutRequest,
  true
>(outputPostRequestValidationSchema, {
  skipNull: true,
  coerce: true,
});
