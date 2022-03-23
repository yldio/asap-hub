import { useEffect, useMemo } from 'react';
import { LabeledDropdown, LabeledTextField } from '../molecules';
import { ResearchOutputIdentifierType } from '../research-output-identifier-type';

const identifiers = [
  ResearchOutputIdentifierType.None,
  ResearchOutputIdentifierType.DOI,
  ResearchOutputIdentifierType.AcessionNumber,
  ResearchOutputIdentifierType.RRID,
  ResearchOutputIdentifierType.LabCatalogNumber,
].map((identifier) => ({ value: identifier, label: identifier }));
const identifierMap = {
  [ResearchOutputIdentifierType.DOI]: {
    helpText: 'Your DOI must start with 1 and it cannot be a URL',
    placeholder: 'DOI number e.g. 10.5555/YFRU1371',
    regex: '^(doi:)?\\d{2}\\.\\d{4}.*$',
    errorMessage: 'Please enter a valid DOI (e.g. 10.1234/abcde.121212)',
  },
  [ResearchOutputIdentifierType.AcessionNumber]: {
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
}

export const TeamCreateOutputIdentifier: React.FC<TeamCreateOutputIdentifierProps> =
  ({ identifierType, setIdentifierType, identifier, setIdentifier }) => {
    const data = useMemo(() => identifierMap[identifierType], [identifierType]);

    useEffect(() => {
      setIdentifier('');
    }, [identifierType, setIdentifier]);

    return (
      <>
        <LabeledDropdown
          title="Identifier"
          subtitle="(required)"
          options={identifiers}
          value={identifierType}
          onChange={setIdentifierType}
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
