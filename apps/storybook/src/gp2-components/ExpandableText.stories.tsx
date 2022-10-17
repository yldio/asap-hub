import { ExpandableText } from '@asap-hub/gp2-components';

import { text } from '@storybook/addon-knobs';

export default {
  title: 'GP2 / Molecules / Expandable Text',
  component: ExpandableText,
};

const props = {
  description:
    'In order to show you the Hub, we will need to make your profile public to the Hub network. Would you like to continue?',
};

export const Normal = () => (
  <ExpandableText>{text('description', props.description)}</ExpandableText>
);
