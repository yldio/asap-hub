import {
  createResearchOutputResponse,
  createUserResponse,
  researchTagMethodResponse,
} from '@asap-hub/fixtures';
import { researchOutputDocumentTypeToType } from '@asap-hub/model';
import { ResearchOutputForm } from '@asap-hub/react-components';
import { boolean } from '@storybook/addon-knobs';
import { ComponentProps } from 'react';
import { StaticRouter } from 'react-router-dom';

export default {
  title: 'Templates / Research Output Form',
  component: ResearchOutputForm,
};

const researchOutputFormProps: ComponentProps<typeof ResearchOutputForm> = {
  permissions: {
    canEditResearchOutput: true,
    canPublishResearchOutput: true,
    canShareResearchOutput: true,
  },
  onSave: () => Promise.resolve(),
  onSaveDraft: () => Promise.resolve(),
  tagSuggestions: ['A53T', 'Activity assay'],
  documentType: 'Article',
  getLabSuggestions: () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve([{ label: 'lab name', value: '1' }]);
      }, 1000);
    }),
  getAuthorSuggestions: () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { label: 'user name', value: '1', author: createUserResponse() },
        ]);
      }, 1000);
    }),
  selectedTeams: [],
  typeOptions: Array.from(researchOutputDocumentTypeToType.Article),
  getTeamSuggestions: () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve([{ label: 'team name', value: '1' }]);
      }, 1000);
    }),
  getRelatedResearchSuggestions: () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            label: 'Research 1',
            value: '1',
            type: 'Preprint',
            documentType: 'Protocol',
          },
          {
            label:
              'Research With a very long name to display in the page so it can show how it will look like in the select list and in the selected values',
            value: '2',
            type: 'Preprint',
            documentType: 'Article',
          },
          {
            label: 'Research 3',
            value: '3',
            type: 'Preprint',
            documentType: 'Dataset',
          },
          {
            label: 'Research 4',
            value: '4',
            type: 'Preprint',
            documentType: 'Bioinformatics',
          },
          {
            label: 'Research 5',
            value: '5',
            type: 'Preprint',
            documentType: 'Lab Resource',
          },
          {
            label: 'Research 6',
            value: '6',
            type: 'Preprint',
            documentType: 'Grant Document',
          },
        ]);
      }, 1000);
    }),
  getRelatedEventSuggestions: () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            label: 'Event 1',
            value: '1',
            endDate: new Date().toISOString(),
          },
          {
            label: 'Event 2',
            value: '2',
            endDate: new Date().toISOString(),
          },
          {
            label: 'Event 3',
            value: '3',
            endDate: new Date().toISOString(),
          },
        ]);
      }, 1000);
    }),
  researchTags: [researchTagMethodResponse],
  published: boolean('Published', true),
};

export const Normal = () => (
  <StaticRouter>
    <ResearchOutputForm {...researchOutputFormProps} />
  </StaticRouter>
);

export const EditMode = () => (
  <StaticRouter>
    <ResearchOutputForm
      {...researchOutputFormProps}
      researchOutputData={{
        ...createResearchOutputResponse(),
        link: 'https://google.com',
      }}
    />
  </StaticRouter>
);
