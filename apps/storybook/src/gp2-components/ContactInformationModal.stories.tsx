import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { ContactInformationModal } from '@asap-hub/gp2-components';
import { ComponentProps } from 'react';
import { StaticRouter } from 'react-router-dom';

export default {
  title: 'GP2 / Molecules / Onboarding / Contact Information Modal',
  component: ContactInformationModal,
};

const props: ComponentProps<typeof ContactInformationModal> = {
  ...gp2Fixtures.createUserResponse(),
  backHref: '#',
  onSave: () => Promise.resolve(),
};

export const Normal = () => (
  <StaticRouter>
    <ContactInformationModal {...props} />
  </StaticRouter>
);
