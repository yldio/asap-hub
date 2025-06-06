import {
  manuscriptPostRequestSchema,
  manuscriptPutRequestSchema,
  ManuscriptFileType,
} from '@asap-hub/model';
import { validateInput } from '@asap-hub/server-common';
import { JSONSchemaType } from 'ajv';

type ManuscriptParameters = {
  manuscriptId: string;
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

const fileUploadFromUrlSchema: JSONSchemaType<FileUploadFromUrlRequest> = {
  type: 'object',
  properties: {
    fileType: {
      type: 'string',
      enum: ['Manuscript File', 'Key Resource Table', 'Additional Files'],
    },
    url: { type: 'string' },
    filename: { type: 'string' },
    contentType: {
      type: 'string',
      enum: ['application/pdf', 'text/csv', 'application/vnd.ms-excel'],
    },
  },
  required: ['fileType', 'url', 'filename', 'contentType'],
  additionalProperties: false,
};

export const validateFileUploadFromUrl = validateInput(fileUploadFromUrlSchema);
