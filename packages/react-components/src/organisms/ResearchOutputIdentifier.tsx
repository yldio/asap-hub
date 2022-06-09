import {
  ResearchOutputDocumentType,
  ResearchOutputIdentifierType,
  researchOutputToIdentifierType,
} from '@asap-hub/model';
import { ResearchOutputIdentifierValidationExpression } from '@asap-hub/validation';
import { useCallback, useMemo, ReactElement } from 'react';
import { LabeledDropdown, LabeledTextField } from '../molecules';
import { noop } from '../utils';

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
    helpText: 'Your DOI must start with 1 and it cannot be a URL',
    placeholder: 'DOI number e.g. 10.5555/YFRU1371',
    regex: ResearchOutputIdentifierValidationExpression.DOI,
    errorMessage:
      'Please enter a valid DOI. It starts with a 1 and it cannot be a URL. (e.g. 10.1234/abcde.121212)',
    required: true,
  },
  [ResearchOutputIdentifierType.AccessionNumber]: {
    helpText:
      'Your Accession Number must start with a letter. Accession Numbers are attributed by NIH, EMBL-EBI, ProteomeXchange, etc.',
    placeholder: 'Accession number e.g. AF123456',
    regex: ResearchOutputIdentifierValidationExpression['Accession Number'],
    errorMessage:
      'Please enter a valid Accession Number which must start with a letter (e.g. NT_123456)',
    required: true,
  },
  [ResearchOutputIdentifierType.RRID]: {
    helpText: 'Your RRID must start with “RRID:”',
    placeholder: 'RRID e.g. RRID:AB_90755',
    regex: ResearchOutputIdentifierValidationExpression.RRID,
    errorMessage:
      'Please enter a valid RRID which starts with `RRID`. (e.g. RRID:SCR_007358)',
    required: true,
  },
  [ResearchOutputIdentifierType.None]: {
    helpText: '',
    placeholder: '',
    regex: ResearchOutputIdentifierValidationExpression.None,
    errorMessage: undefined,
    required: false,
  },
  [ResearchOutputIdentifierType.Empty]: {
    helpText: '',
    placeholder: '',
    regex: undefined,
    errorMessage: undefined,
    required: false,
  },
} as const;

const getIdentifierInfoMessage = (
  identifiers: IdentifierType,
): Array<ReactElement> =>
  identifiers.map(({ value }) => {
    if (value === ResearchOutputIdentifierType.AccessionNumber) {
      return (
        <span key={value}>
          <b>Accesion Number: </b>Your Accession Number must start with a
          letter. Accession Numbers are attributed by NIH, EMBL-EBI,
          ProteomeXchange, etc.
        </span>
      );
    }
    if (value === ResearchOutputIdentifierType.DOI) {
      return (
        <span key={value}>
          <b>DOI: </b>Your DOI must start with 1 and it cannot be a URL
        </span>
      );
    }
    if (value === ResearchOutputIdentifierType.RRID) {
      return (
        <span key={value}>
          <b>RRID: </b>Your RRID must start with "RRID:"
        </span>
      );
    }
    return <></>;
  });

export interface ResearchOutputIdentifierProps {
  identifier?: string;
  setIdentifier?: (value: string) => void;
  identifierType?: ResearchOutputIdentifierType;
  setIdentifierType?: (value: ResearchOutputIdentifierType) => void;
  documentType: ResearchOutputDocumentType;
  isEditMode?: boolean;
}

export const ResearchOutputIdentifier: React.FC<ResearchOutputIdentifierProps> =
  ({
    identifierType = ResearchOutputIdentifierType.Empty,
    setIdentifierType = noop,
    identifier = '',
    setIdentifier = noop,
    documentType,
  }) => {
    const identifiers = useMemo(
      () => getIdentifiers(documentType),
      [documentType],
    );

    const infoText = getIdentifierInfoMessage(identifiers);
    const onChangeIdentifierType = useCallback(
      (newType: string) => {
        if (
          newType === undefined ||
          identifiers.find(
            (availableIdentifier) => availableIdentifier.value === newType,
          )
        ) {
          setIdentifierType(newType as ResearchOutputIdentifierType);
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
          placeholder={'Choose an identifier'}
          getValidationMessage={() => `Please choose an identifier`}
          required={true}
          info={infoText}
        />

        <TeamCreateOutputIdentifierField
          type={identifierType}
          identifier={identifier}
          setIdentifier={setIdentifier}
        />
      </>
    );
  };
export interface TeamCreateOutputIdentifierFieldProps {
  identifier: string;
  setIdentifier: (value: string) => void;
  type: ResearchOutputIdentifierType;
}
export const TeamCreateOutputIdentifierField: React.FC<TeamCreateOutputIdentifierFieldProps> =
  ({ type, identifier, setIdentifier }) => {
    const { helpText, placeholder, errorMessage, regex, required } =
      identifierMap[type];

    return (
      <>
        {type === ResearchOutputIdentifierType.AccessionNumber && (
          <LabeledTextField
            title={type}
            description={helpText}
            placeholder={placeholder}
            getValidationMessage={() => errorMessage}
            value={identifier}
            onChange={setIdentifier}
            pattern={regex}
            required={required}
          />
        )}
        {type === ResearchOutputIdentifierType.DOI && (
          <LabeledTextField
            title={type}
            description={helpText}
            placeholder={placeholder}
            getValidationMessage={() => errorMessage}
            value={identifier}
            onChange={setIdentifier}
            pattern={regex}
            required={required}
          />
        )}
        {type === ResearchOutputIdentifierType.RRID && (
          <LabeledTextField
            title={type}
            description={helpText}
            placeholder={placeholder}
            getValidationMessage={() => errorMessage}
            value={identifier}
            onChange={setIdentifier}
            pattern={regex}
            required={required}
          />
        )}
      </>
    );
  };
