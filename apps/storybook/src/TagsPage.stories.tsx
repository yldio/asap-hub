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
  />
);
