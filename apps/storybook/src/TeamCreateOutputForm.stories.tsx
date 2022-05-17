import {
  createTeamResponse,
  createUserResponse,
  researchTagResponse,
} from '@asap-hub/fixtures';
import { researchOutputDocumentTypes } from '@asap-hub/model';
import { TeamCreateOutputForm } from '@asap-hub/react-components';
import { select } from '@storybook/addon-knobs';
import { StaticRouter } from 'react-router-dom';

export default {
  title: 'Organisms / Team Profile / Team Create Output Form',
  component: TeamCreateOutputForm,
};

export const Normal = () => (
  <StaticRouter>
    <TeamCreateOutputForm
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
