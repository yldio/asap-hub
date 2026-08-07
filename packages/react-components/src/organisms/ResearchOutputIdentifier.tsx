import {
  ResearchOutputDocumentType,
  ResearchOutputIdentifierType,
  researchOutputToIdentifierType,
} from '@asap-hub/model';
import { ResearchOutputIdentifierValidationExpression } from '@asap-hub/validation';
import { useMemo, ReactElement } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { LabeledDropdown, LabeledTextField } from '../molecules';
import { ResearchOutputFormValues } from '../utils';

type IdentifierType = Array<{
  value: ResearchOutputIdentifierType;
  label: ResearchOutputIdentifierType;
}>;

const getIdentifiers = (
  researchOutputDocumentType: ResearchOutputDocumentType,
): IdentifierType => {
  const identifiers =
    researchOutputToIdentifierType[researchOutputDocumentType] ?? [];

  return identifiers.map((identifier) => ({
    value: identifier,
    label: identifier,
  }));
};

const identifierMap = {
  [ResearchOutputIdentifierType.DOI]: {
    helpText: 'Your DOI must start with 10 and it cannot be a URL',
    placeholder: 'e.g. 10.5555/YFRU1371',
    regex: ResearchOutputIdentifierValidationExpression.DOI,
    errorMessage:
      'Please enter a valid DOI. It starts with a 10 and it cannot be a URL. (e.g. 10.5555/YFRU1371.121212)',
    required: true,
    name: 'DOI',
  },
  [ResearchOutputIdentifierType.AccessionNumber]: {
    helpText:
      'Your Accession Number must start with a letter. Accession Numbers are attributed by NIH, EMBL-EBI, ProteomeXchange, etc.',
    placeholder: 'e.g. AF123456',
    regex: ResearchOutputIdentifierValidationExpression['Accession Number'],
    errorMessage:
      'Please enter a valid Accession Number which must start with a letter (e.g. NT_123456)',
    required: true,
    name: 'Accesion Number',
  },
  [ResearchOutputIdentifierType.RRID]: {
    helpText: 'Your RRID must start with “RRID:”',
    placeholder: 'e.g. RRID:AB_007358',
    regex: ResearchOutputIdentifierValidationExpression.RRID,
    errorMessage:
      'Please enter a valid RRID which starts with `RRID`. (e.g. RRID:AB_007358)',
    required: true,
    name: 'RRID',
  },
  [ResearchOutputIdentifierType.None]: {
    helpText: '',
    placeholder: '',
    regex: ResearchOutputIdentifierValidationExpression.None,
    errorMessage: undefined,
    required: false,
    name: '',
  },
  [ResearchOutputIdentifierType.Empty]: {
    helpText: '',
    placeholder: '',
    regex: undefined,
    errorMessage: undefined,
    required: false,
    name: '',
  },
} as const;

const getIdentifierInfoMessage = (
  identifiers: IdentifierType,
): Array<ReactElement> =>
  identifiers
    .filter(
      ({ value }) =>
        value !== ResearchOutputIdentifierType.None &&
        value !== ResearchOutputIdentifierType.Empty,
    )
    .map(({ value }, index) => (
      <span key={`info-${index}`}>
        <strong>{identifierMap[value].name}: </strong>
        {identifierMap[value].helpText}
      </span>
    ));

export interface ResearchOutputIdentifierProps {
  documentType: ResearchOutputDocumentType;
  isEditMode?: boolean;
}

export const getIdentifierValidationRules = (
  type: ResearchOutputIdentifierType,
) => {
  const { errorMessage, regex, required } = identifierMap[type];

  return {
    required: required && errorMessage ? errorMessage : false,
    ...(regex && errorMessage
      ? { pattern: { value: new RegExp(regex), message: errorMessage } }
      : {}),
  };
};

export const ResearchOutputIdentifier: React.FC<
  ResearchOutputIdentifierProps
> = ({ documentType }) => {
  const { control, setValue, clearErrors } =
    useFormContext<ResearchOutputFormValues>();

  const identifiers = useMemo(
    () => getIdentifiers(documentType),
    [documentType],
  );

  const infoText = getIdentifierInfoMessage(identifiers);

  return (
    <>
      <Controller
        name="identifierType"
        control={control}
        rules={{ required: 'Please choose an identifier.' }}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => (
          <LabeledDropdown
            title="Identifier Type"
            subtitle={'(required)'}
            options={identifiers}
            value={value ?? ResearchOutputIdentifierType.Empty}
            onChange={(newType) => {
              // Clearing the dropdown reports no value at all, and the
              // identifier belongs to the type that was selected, so it is
              // dropped whenever the type changes.
              onChange(newType ?? ResearchOutputIdentifierType.Empty);
              setValue('identifier', '');
              // The message that was on screen belonged to the previous type,
              // so it is dropped instead of revalidated: the new field starts
              // empty and untouched.
              clearErrors('identifier');
            }}
            required
            onBlur={onBlur}
            placeholder={'Choose an identifier'}
            customValidationMessage={error?.message}
            info={infoText}
          />
        )}
      />

      <TeamCreateOutputIdentifierField />
    </>
  );
};

export const TeamCreateOutputIdentifierField: React.FC = () => {
  const { control } = useFormContext<ResearchOutputFormValues>();
  const type = useWatch({ control, name: 'identifierType' });

  if (
    type !== ResearchOutputIdentifierType.AccessionNumber &&
    type !== ResearchOutputIdentifierType.DOI &&
    type !== ResearchOutputIdentifierType.RRID
  ) {
    return null;
  }

  const { helpText, placeholder } = identifierMap[type];

  return (
    <Controller
      name="identifier"
      control={control}
      rules={getIdentifierValidationRules(type)}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <LabeledTextField
          title={type}
          subtitle={'(required)'}
          description={helpText}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={onChange}
          onBlur={onBlur}
          customValidationMessage={error?.message}
        />
      )}
    />
  );
};
