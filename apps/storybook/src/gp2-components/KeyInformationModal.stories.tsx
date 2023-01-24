import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { KeyInformationModal } from '@asap-hub/gp2-components';
import { ComponentProps } from 'react';
import { StaticRouter } from 'react-router-dom';

export default {
  title: 'GP2 / Molecules / Onboarding / Key Information Modal',
  component: KeyInformationModal,
};

const props: ComponentProps<typeof KeyInformationModal> = {
  ...gp2Fixtures.createUserResponse(),
  backHref: '#',
  onSave: () => Promise.resolve(),
  loadInstitutionOptions: () => Promise.resolve([]),
  locationSuggestions: [],
};

export const Normal = () => (
  <StaticRouter>
    <KeyInformationModal {...props} />
  </StaticRouter>
);
