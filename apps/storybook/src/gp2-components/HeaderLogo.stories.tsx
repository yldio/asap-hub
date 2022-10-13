import HeaderLogo from '@asap-hub/gp2-components/src/molecules/HeaderLogo';

export default {
  title: 'GP2 / Molecules / Header Logo',
  component: HeaderLogo,
};

const props = {
  logoHref: '/',
};

export const Logo = () => <HeaderLogo {...props} />;
