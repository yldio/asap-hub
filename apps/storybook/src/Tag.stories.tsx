import { boolean, text } from '@storybook/addon-knobs';
import { Tag } from '@asap-hub/react-components';

export default {
  title: 'Atoms / Tag',
};

export const Normal = () => (
  <Tag
    enabled={boolean('Enabled', true)}
    highlight={boolean('Highlight', false)}
    title={text('Title', 'Example')}
    href={boolean('Link', false) ? '#' : undefined}
  >
    {text('Text', 'Example')}
  </Tag>
);

export const RemovableTag = () => (
  <Tag
    enabled={boolean('Enabled', true)}
    highlight={boolean('Highlight', false)}
    title={text('Title', 'Example')}
    onRemove={() => {}}
  >
    {text('Text', 'Example')}
  </Tag>
);
