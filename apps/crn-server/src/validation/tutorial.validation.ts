import { JSONSchemaType } from 'ajv';
import { validateInput } from '@asap-hub/server-common';

type TutorialParameters = {
  tutorialId: string;
};

const tutorialParametersValidationSchema: JSONSchemaType<TutorialParameters> = {
  type: 'object',
  properties: {
    tutorialId: { type: 'string' },
  },
  required: ['tutorialId'],
  additionalProperties: false,
};

export const validateTutorialParameters = validateInput(
  tutorialParametersValidationSchema,
  {
    skipNull: false,
    coerce: true,
  },
);
