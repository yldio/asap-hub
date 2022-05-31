import {
  createResearchOutputResponse,
  createTeamResponse,
  createUserResponse,
  researchTagMethodResponse,
} from '@asap-hub/fixtures';
import { researchOutputDocumentTypes } from '@asap-hub/model';
import { ResearchOutputForm } from '@asap-hub/react-components';
import { select } from '@storybook/addon-knobs';
import { StaticRouter } from 'react-router-dom';

export default {
  title: 'Organisms / Team Profile / Team Create Output Form',
  component: ResearchOutputForm,
};

export const Normal = () => (
  <StaticRouter>
    <ResearchOutputForm
      onSave={() => Promise.resolve()}
      tagSuggestions={['A53T', 'Activity assay'].map((suggestion) => ({
        label: suggestion,
        value: suggestion,
      }))}
      documentType={select('type', researchOutputDocumentTypes, 'Article')}
      team={createTeamResponse()}
      getTeamSuggestions={() =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve([{ label: 'team name', value: '1' }]);
          }, 1000);
        })
      }
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
              { label: 'author name', value: '1', user: createUserResponse() },
            ]);
          }, 1000);
        })
      }
      researchTags={[researchTagMethodResponse]}
      isEditMode={false}
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
      tagSuggestions={['A53T', 'Activity assay'].map((suggestion) => ({
        label: suggestion,
        value: suggestion,
      }))}
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
      team={createTeamResponse()}
      getTeamSuggestions={() =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve([{ label: 'team name', value: '1' }]);
          }, 1000);
        })
      }
      researchTags={[researchTagMethodResponse]}
      isEditMode={true}
    />
  </StaticRouter>
);
