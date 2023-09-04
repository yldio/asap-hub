import { TagsPage } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';

import { NoPaddingDecorator } from './layout';

export default {
  title: 'Templates / Tags Page',
  component: TagsPage,
  decorators: [NoPaddingDecorator],
};

export const Normal = () => (
  <TagsPage
    tags={Array.from({ length: number('Number of tags to show', 5) }).map(
      (_, i) => [`Tag ${i + 1}`, `tag${i}`],
    )}
  />
);
