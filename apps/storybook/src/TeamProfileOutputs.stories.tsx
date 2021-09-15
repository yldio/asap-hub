import { TeamProfileOutputs } from '@asap-hub/react-components';
import { createListResearchOutputResponse } from '@asap-hub/fixtures';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'Templates / Team Profile / Outputs',
  component: TeamProfileOutputs,
};

export const Normal = () => (
  <TeamProfileOutputs
    outputs={
      createListResearchOutputResponse(number('Number of outputs', 2)).items
    }
    numberOfItems={2}
    numberOfPages={1}
    currentPage={0}
    renderPageHref={() => ''}
    isListView={false}
    cardViewHref={''}
    listViewHref={''}
  />
);
