import { UserProfileResearchOutputs } from '@asap-hub/react-components';
import { createListResearchOutputResponse } from '@asap-hub/fixtures';
import { boolean, number, text } from './knobs';

export default {
  title: 'Templates / User Profile / Outputs',
  component: UserProfileResearchOutputs,
};

export const Normal = () => {
  const numberOfOutputs = number('Number of outputs', 2);
  return (
    <UserProfileResearchOutputs
      researchOutputs={createListResearchOutputResponse(numberOfOutputs).items}
      numberOfItems={2}
      numberOfPages={1}
      currentPageIndex={0}
      renderPageHref={() => ''}
      isListView={false}
      cardViewHref={''}
      listViewHref={''}
      ownUser={boolean('Own User', true)}
      hasOutputs={!!numberOfOutputs}
      firstName={text('First Name', 'Tess')}
    />
  );
};
