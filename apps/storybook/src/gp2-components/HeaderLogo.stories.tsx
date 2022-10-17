import { HeaderLogo } from '@asap-hub/gp2-components';

export default {
  title: 'GP2 / Molecules / Header Logo',
  component: HeaderLogo,
};

const props = {
  logoHref: '/',
};

export const Normal = () => <HeaderLogo {...props} />;
