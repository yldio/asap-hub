import { gp2 } from '@asap-hub/model';
import { gp2 as gp2Validation } from '@asap-hub/validation';
import { useCallback, useMemo, ReactElement } from 'react';
import {
  LabeledDropdown,
  LabeledTextField,
  noop,
} from '@asap-hub/react-components';

type IdentifierType = Array<{
  value: gp2.OutputIdentifierType;
  label: gp2.OutputIdentifierType;
}>;

const getIdentifiers = (
  researchOutputDocumentType: gp2.OutputDocumentType,
): IdentifierType => {
  const identifiers =
    gp2.outputToIdentifierType[researchOutputDocumentType] ?? [];

  return identifiers.map((identifier) => ({
    value: identifier,
    label: identifier,
  }));
};

const identifierMap = {
  [gp2.OutputIdentifierType.DOI]: {
    helpText: 'Your DOI must start with 10 and it cannot be a URL',
    placeholder: 'e.g. 10.5555/YFRU1371',
    regex: gp2Validation.OutputIdentifierValidationExpression.DOI,
    errorMessage:
      'Please enter a valid DOI which starts with a 10. and it cannot be a URL. (e.g. 10.5555/YFRU1371.121212)',
    required: true,
    name: 'DOI',
  },
  [gp2.OutputIdentifierType.AccessionNumber]: {
    helpText:
      'Your Accession Number must start with a letter. Accession Numbers are attributed by NIH, EMBL-EBI, ProteomeXchange, etc.',
    placeholder: 'e.g. NT_123456',
    regex:
      gp2Validation.OutputIdentifierValidationExpression['Accession Number'],
    errorMessage:
      'Please enter a valid Accession Number which must start with a letter (e.g. NT_123456)',
    required: true,
    name: 'Accesion Number',
  },
  [gp2.OutputIdentifierType.RRID]: {
    helpText: 'Your RRID must start with “RRID:”',
    placeholder: 'e.g. RRID:AB_007358',
    regex: gp2Validation.OutputIdentifierValidationExpression.RRID,
    errorMessage:
      'Please enter a valid RRID which starts with `RRID`. (e.g. RRID:AB_007358)',
    required: true,
    name: 'RRID',
  },
  [gp2.OutputIdentifierType.None]: {
    helpText: '',
    placeholder: '',
    regex: gp2Validation.OutputIdentifierValidationExpression.None,
    errorMessage: undefined,
    required: false,
    name: '',
  },
  [gp2.OutputIdentifierType.Empty]: {
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
        value !== gp2.OutputIdentifierType.None &&
        value !== gp2.OutputIdentifierType.Empty,
    )
    .map(({ value }, index) => (
      <span key={`info-${index}`}>
        <strong>{identifierMap[value].name}: </strong>
        {identifierMap[value].helpText}
      </span>
    ));

export interface OutputIdentifierProps {
  identifier?: string;
  setIdentifier?: (value: string) => void;
  identifierType?: gp2.OutputIdentifierType;
  setIdentifierType?: (value: gp2.OutputIdentifierType) => void;
  documentType: gp2.OutputDocumentType;
  enabled?: boolean;
}

const OutputIdentifier: React.FC<OutputIdentifierProps> = ({
  identifierType = gp2.OutputIdentifierType.Empty,
  setIdentifierType = noop,
  identifier = '',
  setIdentifier = noop,
  documentType,
  enabled,
}) => {
  const identifiers = useMemo(
    () => getIdentifiers(documentType),
    [documentType],
  );

  const infoText = getIdentifierInfoMessage(identifiers);
  const onChangeIdentifierType = useCallback(
    (newType: gp2.OutputIdentifierType) => {
      if (
        newType === undefined ||
        identifiers.find(
          (availableIdentifier) => availableIdentifier.value === newType,
        )
      ) {
        setIdentifierType(newType);
      }
      setIdentifier('');
    },
    [setIdentifierType, identifiers, setIdentifier],
  );

  return (
    <>
      <LabeledDropdown
        title="Identifier Type"
        subtitle={'(required)'}
        options={identifiers}
        value={identifierType}
        onChange={onChangeIdentifierType}
        placeholder={'Choose an identifier...'}
        getValidationMessage={() => `Please choose an identifier.`}
        required
        info={infoText}
        enabled={enabled}
      />

      <OutputIdentifierField
        type={identifierType}
        identifier={identifier}
        setIdentifier={setIdentifier}
        enabled={enabled}
      />
    </>
  );
};
export interface OutputIdentifierFieldProps {
  identifier: string;
  setIdentifier: (value: string) => void;
  type: gp2.OutputIdentifierType;
  enabled?: boolean;
}
export const OutputIdentifierField: React.FC<OutputIdentifierFieldProps> = ({
  type,
  identifier,
  setIdentifier,
  enabled,
}) => {
  const { helpText, placeholder, errorMessage, regex, required } =
    identifierMap[type];

  return (
    <>
      {(type === gp2.OutputIdentifierType.AccessionNumber ||
        type === gp2.OutputIdentifierType.DOI ||
        type === gp2.OutputIdentifierType.RRID) && (
        <LabeledTextField
          title={type}
          description={helpText}
          placeholder={placeholder}
          getValidationMessage={() => errorMessage}
          value={identifier}
          onChange={setIdentifier}
          pattern={regex}
          subtitle={'(required)'}
          required={required}
          enabled={enabled}
        />
      )}
    </>
  );
};

export default OutputIdentifier;
