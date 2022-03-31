import { useCallback, useEffect, useMemo } from 'react';
import {
  ResearchOutputType,
  ResearchOutputIdentifierType,
  researchOutputToIdentifierType,
} from '@asap-hub/model';
import { LabeledDropdown, LabeledTextField } from '../molecules';

const getIdentifiers = (
  researchOutputType: ResearchOutputType,
  required: boolean,
): Array<{
  value: ResearchOutputIdentifierType;
  label: ResearchOutputIdentifierType;
}> => {
  let identifiers = researchOutputToIdentifierType[researchOutputType] ?? [];

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
    regex: '^(doi:)?\\d{2}\\.\\d{4}.*$',
    errorMessage: 'Please enter a valid DOI (e.g. 10.1234/abcde.121212)',
  },
  [ResearchOutputIdentifierType.AccessionNumber]: {
    helpText:
      'Your Accession Number must start with a letter. Accession Numbers are attributed by NIH, EMBL-EBI, ProteomeXchange, etc.',
    placeholder: 'Accession number e.g. AF123456',
    regex: '^(\\w+\\d+(\\.\\d+)?)|(NP_\\d+)$',
    errorMessage: 'Please enter a valid Accession Number (e.g. NT_123456).',
  },
  [ResearchOutputIdentifierType.RRID]: {
    helpText: 'Your RRID must start with “RRID:”',
    placeholder: 'RRID e.g. RRID:AB_90755',
    regex: '^RRID:[a-zA-Z]+.+$',
    errorMessage: 'Please enter a valid RRID (e.g. RRID:SCR_007358).',
  },
  [ResearchOutputIdentifierType.LabCatalogNumber]: {
    helpText: 'Number used by your lab to identify this resource internally.',
    placeholder: 'Lab catalog number',
    regex: undefined,
    errorMessage: undefined,
  },
  [ResearchOutputIdentifierType.None]: {
    helpText: '',
    placeholder: '',
    regex: undefined,
    errorMessage: undefined,
  },
} as const;

export interface TeamCreateOutputIdentifierProps {
  identifier: string;
  setIdentifier: (value: string) => void;
  identifierType: ResearchOutputIdentifierType;
  setIdentifierType: (value: ResearchOutputIdentifierType) => void;
  type: ResearchOutputType;
  required: boolean;
}

export const TeamCreateOutputIdentifier: React.FC<TeamCreateOutputIdentifierProps> =
  ({
    identifierType,
    setIdentifierType,
    identifier,
    setIdentifier,
    type,
    required,
  }) => {
    const data = useMemo(() => identifierMap[identifierType], [identifierType]);
    const identifiers = useMemo(
      () => getIdentifiers(type, required),
      [type, required],
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
          title="Identifier"
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
            getValidationMessage={(state) =>
              (state.patternMismatch && data.errorMessage) || ''
            }
            value={identifier}
            onChange={setIdentifier}
            pattern={data.regex}
          />
        )}
      </>
    );
  };
