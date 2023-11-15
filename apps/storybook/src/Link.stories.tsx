import { text, boolean } from '@storybook/addon-knobs';
import {
  Link,
  Paragraph,
  ThemeVariant,
  OrcidIcon,
} from '@asap-hub/react-components';
import { Story } from '@storybook/react';

import { ThemeDecorator } from './theme';

export default {
  title: 'Atoms / Link',
  decorators: [ThemeDecorator],
};

export const Normal: Story<{ themeVariant: ThemeVariant }> = (
  _,
  { themeVariant },
) => (
  <Paragraph>
    <Link
      href={text('Destination', 'https://www.parkinsonsroadmap.org/')}
      themeVariant={themeVariant}
    >
      {text('Text', "Aligning Science Across Parkinson's")}
    </Link>
  </Paragraph>
);

export const ElipsedText: Story<{ theme: ThemeVariant }> = (_, { theme }) => (
  <Paragraph>
    <Link
      ellipsed
      href={text('Destination', 'https://www.parkinsonsroadmap.org/')}
      themeVariant={theme}
    >
      {text(
        'Text',
        'A Super Long Title Here to Test The Text Wrapping For Links, The Text Should be Trucated and The Tooltip Must Appear Showing This Text Completely',
      )}
    </Link>
  </Paragraph>
);

export const ButtonStyledText = () => (
  <Link
    href={text('Destination', 'https://www.parkinsonsroadmap.org/')}
    buttonStyle
    primary={boolean('Primary', true)}
    small={boolean('Small', false)}
  >
    {text('Text', 'Text')}
  </Link>
);

export const ButtonStyledIcon = () => (
  <Link
    href={text('Destination', 'https://www.parkinsonsroadmap.org/')}
    buttonStyle
    primary={boolean('Primary', true)}
    small={boolean('Small', false)}
  >
    <OrcidIcon />
  </Link>
);

export const MinimumButtonStyledIconAndText = () => (
  <div style={{ width: 'min-content' }}>
    <Link
      href={text('Destination', 'https://www.parkinsonsroadmap.org/')}
      buttonStyle
      primary={boolean('Primary', true)}
      small={boolean('Small', false)}
    >
      <OrcidIcon />
      {text('Text', 'Text')}
    </Link>
  </div>
);

export const ButtonStyledIconAndText = () => (
  <Link
    href={text('Destination', 'https://www.parkinsonsroadmap.org/')}
    buttonStyle
    primary={boolean('Primary', true)}
    small={boolean('Small', false)}
  >
    <OrcidIcon />
    {text('Text', 'Text')}
  </Link>
);
