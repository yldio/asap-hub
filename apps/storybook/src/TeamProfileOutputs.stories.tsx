import { TeamProfileOutputs } from '@asap-hub/react-components';
import { createListResearchOutputResponse } from '@asap-hub/fixtures';
import { boolean, number, text } from '@storybook/addon-knobs';

export default {
  title: 'Templates / Team Profile / Outputs',
  component: TeamProfileOutputs,
};

export const Normal = () => {
  const numberOfOutputs = number('Number of outputs', 2);
  return (
    <TeamProfileOutputs
      researchOutputs={createListResearchOutputResponse(numberOfOutputs).items}
      numberOfItems={2}
      numberOfPages={1}
      currentPageIndex={0}
      renderPageHref={() => ''}
      isListView={false}
      cardViewHref={''}
      listViewHref={''}
      ownTeam={boolean('Own Team', true)}
      hasOutputs={!!numberOfOutputs}
      contactEmail={text('Contact Email', 'test@exmaple.com')}
    />
  );
};
