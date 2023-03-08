import {
  createResearchOutputResponse,
  createUserResponse,
  researchTagMethodResponse,
} from '@asap-hub/fixtures';
import { researchOutputDocumentTypeToType } from '@asap-hub/model';
import { ResearchOutputForm } from '@asap-hub/react-components';
import { boolean } from '@storybook/addon-knobs';
import { StaticRouter } from 'react-router-dom';

export default {
  title: 'Templates / Research Output Form',
  component: ResearchOutputForm,
};

export const Normal = () => (
  <StaticRouter>
    <ResearchOutputForm
      permissions={{
        canEditResearchOutput: true,
        canPublishResearchOutput: true,
        canShareResearchOutput: true,
      }}
      onSave={() => Promise.resolve()}
      onSaveDraft={() => Promise.resolve()}
      tagSuggestions={['A53T', 'Activity assay']}
      documentType="Article"
      getLabSuggestions={() =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve([{ label: 'lab name', value: '1' }]);
          }, 1000);
        })
      }
      getAuthorSuggestions={() =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              { label: 'user name', value: '1', author: createUserResponse() },
            ]);
          }, 1000);
        })
      }
      selectedTeams={[]}
      typeOptions={Array.from(researchOutputDocumentTypeToType.Article)}
      getTeamSuggestions={() =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve([{ label: 'team name', value: '1' }]);
          }, 1000);
        })
      }
      getRelatedResearchSuggestions={() =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                label: 'Research 1',
                value: '1',
                type: 'Preprint',
                documentType: 'Report',
              },
              {
                label: 'Research With a very long name to display in the page',
                value: '2',
                type: 'Preprint',
                documentType: 'Article',
              },
              {
                label: 'Research 3',
                value: '3',
                type: 'Preprint',
                documentType: 'Protocol',
              },
            ]);
          }, 1000);
        })
      }
      researchTags={[researchTagMethodResponse]}
      published={boolean('Published', true)}
    />
  </StaticRouter>
);

const researchOutputData = {
  ...createResearchOutputResponse(),
  link: 'https://google.com',
};
export const EditMode = () => (
  <StaticRouter>
    <ResearchOutputForm
      permissions={{
        canEditResearchOutput: true,
        canPublishResearchOutput: true,
        canShareResearchOutput: true,
      }}
      researchOutputData={researchOutputData}
      onSave={() => Promise.resolve()}
      onSaveDraft={() => Promise.resolve()}
      tagSuggestions={['A53T', 'Activity assay']}
      documentType="Dataset"
      getLabSuggestions={() =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve([{ label: 'lab name', value: '1' }]);
          }, 1000);
        })
      }
      getAuthorSuggestions={() =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              { label: 'user name', value: '1', author: createUserResponse() },
            ]);
          }, 1000);
        })
      }
      selectedTeams={[]}
      typeOptions={Array.from(researchOutputDocumentTypeToType.Dataset)}
      getTeamSuggestions={() =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve([{ label: 'team name', value: '1' }]);
          }, 1000);
        })
      }
      getRelatedResearchSuggestions={() =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve([{ label: 'Research 1', value: '1' }]);
          }, 1000);
        })
      }
      researchTags={[researchTagMethodResponse]}
      published={boolean('Published', true)}
    />
  </StaticRouter>
);
