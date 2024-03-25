import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import NetworkPageHeader from './NetworkPageHeader';
import { networkPageLayoutPaddingStyle } from '../layout';

const mainStyles = css({
  padding: networkPageLayoutPaddingStyle,
});

const NetworkPage: React.FC<
  React.PropsWithChildren<ComponentProps<typeof NetworkPageHeader>>
> = ({
  children,

  ...props
}) => (
  <article>
    <NetworkPageHeader {...props} />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default NetworkPage;
