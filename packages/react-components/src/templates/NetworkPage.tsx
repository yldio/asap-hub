import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { perRem } from '../pixels';
import NetworkPageHeader from './NetworkPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const NetworkPage: React.FC<ComponentProps<typeof NetworkPageHeader>> = ({
  children,

  ...props
}) => (
  <article>
    <NetworkPageHeader {...props} />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default NetworkPage;
