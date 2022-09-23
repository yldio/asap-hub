import { WarningText } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'Atoms / Warning Text',
  component: WarningText,
};

export const Normal = () => (
  <WarningText
    text={text(
      'Warning text',
      'This will appear to the right side of the icon',
    )}
  />
);
