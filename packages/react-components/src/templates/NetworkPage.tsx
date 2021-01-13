import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { perRem } from '../pixels';
import NetworkPageHeader from './NetworkPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const articleStyles = css({
  alignSelf: 'stretch',
});

const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const NetworkPage: React.FC<ComponentProps<typeof NetworkPageHeader>> = ({
  children,

  ...props
}) => (
  <article css={articleStyles}>
    <NetworkPageHeader {...props} />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default NetworkPage;
