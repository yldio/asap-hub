import { text } from '@storybook/addon-knobs';

import { Markdown } from '@asap-hub/react-components';

export default {
  title: 'Atoms / Markdown',
  component: Markdown,
};

export const Normal = () => (
  <Markdown
    value={text(
      'Text',
      '# Hello\n\n some *text* and **more text** \n\n [link](http://example.com)',
    )}
  />
);
