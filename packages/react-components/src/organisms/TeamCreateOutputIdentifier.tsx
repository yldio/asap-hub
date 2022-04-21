import { useCallback, useEffect, useMemo } from 'react';
import {
  ResearchOutputDocumentType,
  ResearchOutputIdentifierType,
  researchOutputToIdentifierType,
} from '@asap-hub/model';
import { ResearchOutputIdentifierValidationExpression } from '@asap-hub/validation';
import { LabeledDropdown, LabeledTextField } from '../molecules';
import { noop } from '../utils';

const getIdentifiers = (
  researchOutputDocumentType: ResearchOutputDocumentType,
  required: boolean,
): Array<{
  value: ResearchOutputIdentifierType;
  label: ResearchOutputIdentifierType;
}> => {
  let identifiers =
    researchOutputToIdentifierType[researchOutputDocumentType] ?? [];

  if (required) {
    identifiers = identifiers.filter(
      (identifier) => identifier !== ResearchOutputIdentifierType.None,
    );
  }

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
      'Please enter a valid Accession Number which must started with a letter (e.g. NT_123456)',
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
  [ResearchOutputIdentifierType.LabCatalogNumber]: {
    helpText: 'Number used by your lab to identify this resource internally.',
    placeholder: 'Lab catalog number',
    regex: ResearchOutputIdentifierValidationExpression['Lab Catalog Number'],
    errorMessage: undefined,
    required: false,
  },
  [ResearchOutputIdentifierType.None]: {
    helpText: '',
    placeholder: '',
    regex: ResearchOutputIdentifierValidationExpression.None,
    errorMessage: undefined,
    required: false,
  },
} as const;

export interface TeamCreateOutputIdentifierProps {
  identifier?: string;
  setIdentifier?: (value: string) => void;
  identifierType?: ResearchOutputIdentifierType;
  setIdentifierType?: (value: ResearchOutputIdentifierType) => void;
  documentType: ResearchOutputDocumentType;
  required: boolean;
}

export const TeamCreateOutputIdentifier: React.FC<TeamCreateOutputIdentifierProps> =
  ({
    identifierType = ResearchOutputIdentifierType.None,
    setIdentifierType = noop,
    identifier = '',
    setIdentifier = noop,
    documentType,
    required,
  }) => {
    const data = useMemo(() => identifierMap[identifierType], [identifierType]);
    const identifiers = useMemo(
      () => getIdentifiers(documentType, required),
      [documentType, required],
    );

    useEffect(() => {
      if (required && identifierType === ResearchOutputIdentifierType.None) {
        setIdentifierType(identifiers[0].value);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [required, setIdentifierType]);

    useEffect(() => {
      setIdentifier('');
    }, [identifierType, setIdentifier]);

    const onChangeIdentifierType = useCallback(
      (newType: string) => {
        if (
          identifiers.find(
            (availableIdentifier) => availableIdentifier.value === newType,
          )
        ) {
          setIdentifierType(newType as ResearchOutputIdentifierType);
        } else {
          setIdentifierType(identifiers[0].value);
        }
      },
      [setIdentifierType, identifiers],
    );

    return (
      <>
        <LabeledDropdown
          title="Identifier Type"
          subtitle="(required)"
          options={identifiers}
          value={identifierType}
          onChange={onChangeIdentifierType}
        />
        {identifierType !== ResearchOutputIdentifierType.None && (
          <LabeledTextField
            title={identifierType}
            description={data.helpText}
            placeholder={data.placeholder}
            getValidationMessage={() => data.errorMessage}
            value={identifier}
            onChange={setIdentifier}
            pattern={data.regex}
            required={data.required}
          />
        )}
      </>
    );
  };
