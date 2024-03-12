import { OrcidIcon, Button } from '@asap-hub/react-components';

import { boolean, text } from './knobs';

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
export const MinimumText = () => (
  <div style={{ width: 'min-content' }}>
    <Button
      enabled={boolean('Enabled', true)}
      primary={boolean('Primary', true)}
      small={boolean('Small', false)}
      active={boolean('Active', false)}
    >
      {text('Text', 'Text')}
    </Button>
  </div>
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

export const MinimumTextAndIcon = () => (
  <div style={{ width: 'min-content' }}>
    <Button
      enabled={boolean('Enabled', true)}
      primary={boolean('Primary', true)}
      small={boolean('Small', false)}
      active={boolean('Active', false)}
    >
      {text('Text', 'Text')}
      <OrcidIcon />
    </Button>
  </div>
);
export const LinkStyledText = () => (
  <Button linkStyle>{text('Text', 'Text')}</Button>
);
export const LinkStyledIcon = () => (
  <Button linkStyle>
    <OrcidIcon />
  </Button>
);
