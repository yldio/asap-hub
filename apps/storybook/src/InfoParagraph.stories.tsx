import { text } from '@storybook/addon-knobs';
import { InfoParagraph } from '@asap-hub/react-components';

export default {
  title: 'Atoms / InfoParagraph',
  component: InfoParagraph,
};

export const Normal = () => (
  <InfoParagraph
    boldText={text('Bold text', 'This text is bold')}
    bodyText={text('Body text', 'This is the main text')}
  />
);
