import { TagsPage } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';
import { loadOptionsMock } from './LabeledMultiSelect.stories';

import { NoPaddingDecorator } from './layout';

export default {
  title: 'Templates / Tags Page',
  component: TagsPage,
  decorators: [NoPaddingDecorator],
};

export const Normal = () => (
  <TagsPage
    loadTags={loadOptionsMock(['Tag 1', 'Example 2', 'Orange 3', 'Oops 4'])}
    tags={Array.from({ length: number('Number of tags to show', 1) }).map(
      (_, i) => `Tag ${i + 1}`,
    )}
    filterOptions={[
      { title: 'AREAS' },
      { label: 'Calendar & Events', value: 'event' },
      { label: 'Interest Groups', value: 'event' },
      { label: 'News', value: 'event' },
      { label: 'People', value: 'user' },
      { label: 'Shared Research', value: 'research-output' },
      { label: 'Teams', value: 'team' },
      { label: 'Working Groups', value: 'working-group' },
    ]}
    setTags={() => {}}
    onChangeFilter={() => {}}
  />
);
