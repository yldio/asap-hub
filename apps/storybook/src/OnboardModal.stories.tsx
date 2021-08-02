import { ComponentProps } from 'react';
import { OnboardModal } from '@asap-hub/react-components';
import { StaticRouter } from 'react-router-dom';

export default {
  title: 'Templates / User Profile / Onboard Modal',
  component: OnboardModal,
};

const props: ComponentProps<typeof OnboardModal> = {
  backHref: '#',
};

export const Normal = () => (
  <StaticRouter>
    <OnboardModal {...props} />
  </StaticRouter>
);
