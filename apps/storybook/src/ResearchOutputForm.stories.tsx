import {
  createResearchOutputResponse,
  createUserResponse,
  researchTagMethodResponse,
} from '@asap-hub/fixtures';
import { researchOutputDocumentTypeToType } from '@asap-hub/model';
import { ResearchOutputForm } from '@asap-hub/react-components';
import { StaticRouter } from 'react-router-dom';

export default {
  title: 'Templates / Research Output Form',
  component: ResearchOutputForm,
};

export const Normal = () => (
  <StaticRouter>
    <ResearchOutputForm
      onSave={() => Promise.resolve()}
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
              { label: 'user name', value: '1', user: createUserResponse() },
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
            resolve([{ label: 'Research 1', value: '1' }]);
          }, 1000);
        })
      }
      researchTags={[researchTagMethodResponse]}
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
      researchOutputData={researchOutputData}
      onSave={() => Promise.resolve()}
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
              { label: 'user name', value: '1', user: createUserResponse() },
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
    />
  </StaticRouter>
);
