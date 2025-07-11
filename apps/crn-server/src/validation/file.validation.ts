import { FileAction } from '@asap-hub/model';
import { validateInput } from '@asap-hub/server-common';
import { JSONSchemaType } from 'ajv';

type FilePostRequest = {
  action: FileAction;
  filename: string;
  contentType?: string;
};

const filePostRequestValidationSchema: JSONSchemaType<FilePostRequest> = {
  type: 'object',
  properties: {
    action: { type: 'string', enum: ['upload', 'download'] },
    filename: { type: 'string' },
    contentType: { type: 'string', nullable: true },
  },
  required: ['action', 'filename'],
  additionalProperties: false,
};

export const validateFilePostRequestInput = validateInput(
  filePostRequestValidationSchema,
  {
    skipNull: false,
  },
);
