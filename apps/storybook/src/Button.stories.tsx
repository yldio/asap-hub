import { boolean, text } from '@storybook/addon-knobs';

import { OrcidIcon, Button } from '@asap-hub/react-components';

export default {
  title: 'Atoms / Button',
  component: Button,
};

export const Text = () => (
  <Button
    enabled={boolean('Enabled', true)}
    primary={boolean('Primary', true)}
    small={boolean('Small', false)}
    active={boolean('Active', false)}
  >
    {text('Text', 'Text')}
  </Button>
);

export const Icon = () => (
  <Button
    enabled={boolean('Enabled', true)}
    primary={boolean('Primary', true)}
    small={boolean('Small', false)}
    active={boolean('Active', false)}
  >
    <OrcidIcon />
  </Button>
);

export const IconAndText = () => (
  <Button
    enabled={boolean('Enabled', true)}
    primary={boolean('Primary', true)}
    small={boolean('Small', false)}
    active={boolean('Active', false)}
  >
    <OrcidIcon />
    {text('Text', 'Text')}
  </Button>
);

export const LinkStyledText = () => (
  <Button linkStyle>{text('Text', 'Text')}</Button>
);
export const LinkStyledIcon = () => (
  <Button linkStyle>
    <OrcidIcon />
  </Button>
);
