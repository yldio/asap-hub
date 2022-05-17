import {
  createTeamResponse,
  createUserResponse,
  researchTagResponse,
} from '@asap-hub/fixtures';
import { TeamCreateOutputPage } from '@asap-hub/react-components';
import { StaticRouter } from 'react-router-dom';

export default {
  title: 'Templates / Team Profile / Team Create Output Page',
  component: TeamCreateOutputPage,
};

export const Normal = () => (
  <StaticRouter>
    <TeamCreateOutputPage
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
            resolve([researchTagResponse]);
          }, 1000);
        })
      }
    />
  </StaticRouter>
);
