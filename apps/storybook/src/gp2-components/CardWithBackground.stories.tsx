import { projectsImage } from '@asap-hub/gp2-components';
import CardWithBackground from '@asap-hub/gp2-components/src/molecules/CardWithBackground';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'GP2 / Molecules / Card With Background',
  component: CardWithBackground,
};

export const Card = () => (
  <CardWithBackground image={text('Image URL', projectsImage)}>
    <h1>{text('title', 'Title Card')}</h1>
    <div>{text('description', 'This is the text for the Card')}</div>
  </CardWithBackground>
);
