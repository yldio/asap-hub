import { Collapsible, Paragraph } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'Molecules / Collapsible',
  component: Collapsible,
};

export const InitiallyCollapsed = () => (
  <Collapsible>
    <Paragraph>
      {text(
        'Content',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
          'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim' +
          'veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea',
      )}
    </Paragraph>
  </Collapsible>
);
export const InitiallyExpanded = () => (
  <Collapsible initiallyExpanded>
    <Paragraph>
      {text(
        'Content',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
          'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim' +
          'veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea',
      )}
    </Paragraph>
  </Collapsible>
);
