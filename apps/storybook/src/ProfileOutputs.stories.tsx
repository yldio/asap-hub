import { ProfileOutputs } from '@asap-hub/react-components';
import { createListResearchOutputResponse } from '@asap-hub/fixtures';
import { boolean, number, text } from '@storybook/addon-knobs';

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
      draftOutputs={boolean('Draft Outputs', false)}
      userAssociationMember={boolean('User is association member', true)}
      workingGroupAssociation={boolean(
        'Belongs to a working group association',
        true,
      )}
      contactEmail={text('Contact Email', 'test@exmaple.com')}
      hasOutputs={boolean('Has Outputs', true)}
    />
  );
};
