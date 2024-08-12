import { BiographyModal } from '@asap-hub/gp2-components';
import { ComponentProps } from 'react';
import { StaticRouter } from 'react-router-dom/server';

import { text } from '../knobs';

export default {
  title: 'GP2 / Molecules / Onboarding / Biography Modal',
  component: BiographyModal,
};

const props: ComponentProps<typeof BiographyModal> = {
  biography: text('biography', 'this is a bio'),
  backHref: '#',
  onSave: () => Promise.resolve(),
};

export const Normal = () => (
  <StaticRouter location="/url">
    <BiographyModal {...props} />
  </StaticRouter>
);
