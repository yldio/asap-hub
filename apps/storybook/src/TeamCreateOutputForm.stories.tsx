import { researchOutputTypes } from '@asap-hub/model';
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
      tagSuggestions={['A53T', 'Activity assay']}
      type={select('type', researchOutputTypes, 'Article')}
      getLabSuggestions={() =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve([{ label: 'lab name', id: '1' }]);
          }, 1000);
        })
      }
    />
  </StaticRouter>
);
