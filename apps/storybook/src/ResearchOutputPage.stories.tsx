import {
  createTeamResponse,
  createUserResponse,
  researchTagMethodResponse,
  createResearchOutputResponse,
} from '@asap-hub/fixtures';
import { ResearchOutputPage } from '@asap-hub/react-components';
import { StaticRouter } from 'react-router-dom';

export default {
  title: 'Templates / Team Profile / Team Create Output Page',
  component: ResearchOutputPage,
};

export const Normal = () => (
  <StaticRouter>
    <ResearchOutputPage
      onSave={() => Promise.resolve()}
      tagSuggestions={['A53T', 'Activity assay'].map((suggestion) => ({
        label: suggestion,
        value: suggestion,
      }))}
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
      team={createTeamResponse()}
      getTeamSuggestions={() =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve([{ label: 'team name', value: '1' }]);
          }, 1000);
        })
      }
      getResearchTags={() =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve([researchTagMethodResponse]);
          }, 1000);
        })
      }
    />
  </StaticRouter>
);

const researchOutputData = {
  ...createResearchOutputResponse(),
  link: 'https://google.com',
};
export const EditMode = () => (
  <StaticRouter>
    <ResearchOutputPage
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
      getResearchTags={() =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve([researchTagMethodResponse]);
          }, 1000);
        })
      }
    />
  </StaticRouter>
);
