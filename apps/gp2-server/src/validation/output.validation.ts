import { gp2 as gp2Model } from '@asap-hub/model';
import { validateInput } from '@asap-hub/server-common';
import { UrlExpression } from '@asap-hub/validation';
import { JSONSchemaType } from 'ajv';

type OutputParameters = {
  outputId: string;
};
const { outputDocumentTypes, outputTypes, outputSubTypes } = gp2Model;
const outputParametersValidationSchema: JSONSchemaType<OutputParameters> = {
  type: 'object',
  properties: {
    outputId: { type: 'string' },
  },
  required: ['outputId'],
  additionalProperties: false,
};

export const validateOutputParameters = validateInput(
  outputParametersValidationSchema,
  {
    skipNull: false,
    coerce: false,
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
        enum: outputSubTypes,
      },
      link: {
        type: 'string',
        nullable: true,
        pattern: UrlExpression,
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
