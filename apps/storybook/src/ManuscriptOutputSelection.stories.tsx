import {
  ManuscriptOutputSelection,
  ManuscriptVersionOption,
} from '@asap-hub/react-components';
import { ComponentProps } from 'react';
import { StaticRouter } from 'react-router-dom/server';

export default {
  title: 'Templates / Manuscript Output Selection',
  component: ManuscriptOutputSelection,
};

const manuscriptVersionOptions: ManuscriptVersionOption[] = [
  {
    label: 'Alpha-synuclein aggregation in PD patient-derived neurons',
    value: '1',
    version: {
      id: 'version-1',
      hasLinkedResearchOutput: false,
      type: 'Original Research',
      lifecycle: 'Preprint',
      manuscriptId: 'ASAP-001',
      title: 'Alpha-synuclein aggregation in PD patient-derived neurons',
      url: 'https://example.com/manuscript-1',
    },
  },
  {
    label: 'LRRK2 kinase activity and mitochondrial dysfunction',
    value: '2',
    version: {
      id: 'version-2',
      hasLinkedResearchOutput: false,
      type: 'Review / Op-Ed / Letter / Hot Topic',
      lifecycle: 'Publication',
      manuscriptId: 'ASAP-002',
      title: 'LRRK2 kinase activity and mitochondrial dysfunction',
      url: 'https://example.com/manuscript-2',
    },
  },
  {
    label: 'GBA variants and glucocerebrosidase activity in Parkinson disease',
    value: '3',
    version: {
      id: 'version-3',
      hasLinkedResearchOutput: true,
      type: 'Original Research',
      lifecycle: 'Preprint',
      manuscriptId: 'ASAP-003',
      title:
        'GBA variants and glucocerebrosidase activity in Parkinson disease',
      url: 'https://example.com/manuscript-3',
    },
  },
];

const getManuscriptVersionOptions: ComponentProps<
  typeof ManuscriptOutputSelection
>['getManuscriptVersionOptions'] = (inputValue, callback) => {
  setTimeout(() => {
    const filtered = manuscriptVersionOptions.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase()),
    );
    callback(filtered);
  }, 300);
};

const defaultProps: ComponentProps<typeof ManuscriptOutputSelection> = {
  isImportingManuscript: false,
  manuscriptOutputSelection: '',
  onChangeManuscriptOutputSelection: () => {},
  onSelectCreateManually: () => {},
  onImportManuscript: () => {},
  setSelectedVersion: () => {},
  getManuscriptVersionOptions,
};

export const Initial = () => (
  <StaticRouter location="/">
    <ManuscriptOutputSelection {...defaultProps} />
  </StaticRouter>
);

export const CreateManuallySelected = () => (
  <StaticRouter location="/">
    <ManuscriptOutputSelection
      {...defaultProps}
      manuscriptOutputSelection="manually"
    />
  </StaticRouter>
);

export const ImportFromCompliance = () => (
  <StaticRouter location="/">
    <ManuscriptOutputSelection
      {...defaultProps}
      manuscriptOutputSelection="import"
    />
  </StaticRouter>
);

export const ImportWithVersionSelected = () => (
  <StaticRouter location="/">
    <ManuscriptOutputSelection
      {...defaultProps}
      manuscriptOutputSelection="import"
      selectedVersion={manuscriptVersionOptions[0]}
    />
  </StaticRouter>
);

export const ImportInProgress = () => (
  <StaticRouter location="/">
    <ManuscriptOutputSelection
      {...defaultProps}
      manuscriptOutputSelection="import"
      selectedVersion={manuscriptVersionOptions[0]}
      isImportingManuscript
    />
  </StaticRouter>
);
