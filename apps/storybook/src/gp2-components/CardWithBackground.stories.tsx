import { projectsImage, CardWithBackground } from '@asap-hub/gp2-components/';

export default {
  title: 'GP2 / Molecules / Card With Background',
  component: CardWithBackground,
};

export const Normal = () => (
  <CardWithBackground image={projectsImage}>Content</CardWithBackground>
);
