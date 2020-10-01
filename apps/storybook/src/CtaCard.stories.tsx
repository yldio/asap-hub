import React from 'react';
import { text } from '@storybook/addon-knobs';

import { CtaCard } from '@asap-hub/react-components';

export default {
  title: 'Molecules / Cta Card',
  component: CtaCard,
};

export const TitleOnSeparateLine = () => (
  <CtaCard href="#" buttonText="Contact PM">
    <strong>{text('Title', 'Interested in what you’ve seen?')}</strong> <br />
    {text('Body', 'Reach out to this team and see how you can collaborate')}
  </CtaCard>
);

export const TitleOnSameLine = () => (
  <CtaCard href="#" buttonText="Contact PM">
    <strong>{text('Title', 'Interested in what you’ve seen?')} </strong>{' '}
    {text('Body', 'Why not get in touch with Tess W. B. Goetz')}
  </CtaCard>
);
