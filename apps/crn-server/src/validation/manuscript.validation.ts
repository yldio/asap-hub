import {
  manuscriptPostRequestSchema,
  manuscriptPutRequestSchema,
  ManuscriptFileType,
  manuscriptFileTypes,
} from '@asap-hub/model';
import { validateInput } from '@asap-hub/server-common';
import Boom from '@hapi/boom';
import { JSONSchemaType } from 'ajv';

type ManuscriptParameters = {
  manuscriptId: string;
};

type ManuscriptBatchRequest = {
  ids: string[];
};

const manuscriptParametersValidationSchema: JSONSchemaType<ManuscriptParameters> =
  {
    type: 'object',
    properties: {
      manuscriptId: { type: 'string' },
    },
    required: ['manuscriptId'],
    additionalProperties: false,
  };

export const validateManuscriptParameters = validateInput(
  manuscriptParametersValidationSchema,
  {
    skipNull: false,
    coerce: false,
  },
);

const manuscriptBatchRequestValidationSchema: JSONSchemaType<ManuscriptBatchRequest> =
  {
    type: 'object',
    properties: {
      ids: {
        type: 'array',
        items: { type: 'string' },
        minItems: 1,
      },
    },
    required: ['ids'],
    additionalProperties: false,
  };

export const validateManuscriptBatchRequestParameters = validateInput(
  manuscriptBatchRequestValidationSchema,
  {
    skipNull: false,
    coerce: false,
  },
);

export const validateManuscriptPostRequestParameters = validateInput(
  manuscriptPostRequestSchema,
  {
    skipNull: true,
    coerce: true,
  },
);

export const validateManuscriptPutRequestParameters = validateInput(
  manuscriptPutRequestSchema,
  {
    skipNull: true,
    coerce: true,
  },
);

type FileUploadFromUrlRequest = {
  fileType: ManuscriptFileType;
  url: string;
  filename: string;
  contentType: string;
};

const allowedContentTypesByManuscriptFileType: Record<
  Exclude<ManuscriptFileType, 'Discussion Files'>,
  readonly string[]
> = {
  'Manuscript File': ['application/pdf'],
  'Key Resource Table': ['text/csv'],
  'Compliance Report Response': [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
  ],
  'Additional Files': ['text/csv', 'application/pdf'],
};

const fileUploadFromUrlBaseSchema: JSONSchemaType<FileUploadFromUrlRequest> = {
  type: 'object',
  properties: {
    fileType: {
      type: 'string',
      enum: manuscriptFileTypes,
    },
    url: { type: 'string' },
    filename: { type: 'string' },
    contentType: { type: 'string' },
  },
  required: ['fileType', 'url', 'filename', 'contentType'],
  additionalProperties: false,
};

const validateFileUploadFromUrlBase = validateInput(fileUploadFromUrlBaseSchema);

export const validateFileUploadFromUrl = (
  data: Record<string, unknown>,
): FileUploadFromUrlRequest => {
  const body = validateFileUploadFromUrlBase(data);

  if (body.fileType === 'Discussion Files') {
    return body;
  }

  const allowedContentTypes =
    allowedContentTypesByManuscriptFileType[body.fileType];

  if (!allowedContentTypes.includes(body.contentType)) {
    throw Boom.badRequest('Validation error', [
      {
        instancePath: '/contentType',
        schemaPath: '#/properties/contentType/enum',
        keyword: 'enum',
        params: { allowedValues: [...allowedContentTypes] },
        message: 'must be equal to one of the allowed values',
      },
    ]);
  }

  return body;
};
