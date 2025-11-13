import { ReactNode } from 'react';
import { css } from '@emotion/react';

import { paper, steel } from '../colors';
import PageConstraints from './PageConstraints';
import { rem } from '../pixels';

type PageInfoContainerProps = {
  children: ReactNode;
  nav?: ReactNode;
};

const containerStyles = css({
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
});

const navContainerStyles = css({
  marginTop: rem(40),
});

const PageInfoContainer: React.FC<PageInfoContainerProps> = ({
  children,
  nav,
}) => (
  <PageConstraints
    unconstrainedStyles={containerStyles}
    as="div"
    noPaddingBottom={!!nav}
  >
    {children}
    <div css={navContainerStyles}>{nav}</div>
  </PageConstraints>
);

export default PageInfoContainer;
