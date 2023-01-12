import { ProfileOutputs } from '@asap-hub/react-components';
import { createListResearchOutputResponse } from '@asap-hub/fixtures';
import { boolean, number, select, text } from '@storybook/addon-knobs';

export default {
  title: 'Templates / Profile Outputs',
  component: ProfileOutputs,
};

export const Normal = () => {
  const numberOfOutputs = number('Number of outputs', 2);
  return (
    <ProfileOutputs
      researchOutputs={createListResearchOutputResponse(numberOfOutputs).items}
      numberOfItems={2}
      numberOfPages={1}
      currentPageIndex={0}
      renderPageHref={() => ''}
      isListView={false}
      cardViewHref={''}
      listViewHref={''}
      userAssociationMember={boolean('Own Entity', true)}
      publishingEntity={select(
        'Publishing Entity',
        ['Team', 'Working Group'],
        'Team',
      )}
      contactEmail={text('Contact Email', 'test@exmaple.com')}
    />
  );
};
