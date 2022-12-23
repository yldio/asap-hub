import {
  ceruleanFernGradientStyles,
  drawerQuery,
  pixels,
} from '@asap-hub/react-components';

import { css } from '@emotion/react';
import { layoutContentStyles } from '../layout';

import HeaderLogo from '../molecules/HeaderLogo';

const { rem } = pixels;

const logoStyles = css({ padding: `0 ${rem(24)}` });
const desktopNavigationStyles = css({
  [drawerQuery]: {
    display: 'none',
  },
});

const bottomBorderStyles = css({
  height: rem(4),
  width: '100%',
  ...ceruleanFernGradientStyles,
});

type BasicLayoutProps = {
  children: React.ReactNode;
  logoHref?: string;
  noPadding?: boolean;
};
const BasicLayout: React.FC<BasicLayoutProps> = ({
  noPadding = false,
  children,
  logoHref,
}) => {
  return (
    <article css={css({ position: 'relative' })}>
      <header css={css({ width: '100%' })}>
        <div css={logoStyles}>
          <HeaderLogo logoHref={logoHref} />
        </div>
        <div css={[bottomBorderStyles, desktopNavigationStyles]} />
      </header>
      <main
        css={[layoutContentStyles, noPadding && css({ ...{ padding: 0 } })]}
      >
        {children}
      </main>
    </article>
  );
};

export default BasicLayout;
