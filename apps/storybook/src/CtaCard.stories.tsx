import { text } from './knobs';

import { CtaCard } from '@asap-hub/react-components';

export default {
  title: 'Molecules / Cta Card',
  component: CtaCard,
};

export const Normal = () => (
  <CtaCard href="#" buttonText="Contact PM">
    <strong>{text('Title', 'Interested in what you’ve seen?')}</strong> <br />
    {text('Body', 'Reach out to this team and see how you can collaborate')}
  </CtaCard>
);
