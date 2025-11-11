import { ReactNode } from 'react';
import { css } from '@emotion/react';

import { paper, steel } from '../colors';
import PageContraints from './PageConstraints';

type PageInfoContainerProps = {
  children: ReactNode;
  nav?: ReactNode;
};

const containerStyles = css({
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
});

const PageInfoContainer: React.FC<PageInfoContainerProps> = ({
  children,
  nav,
}) => (
  <PageContraints
    unconstrainedStyles={containerStyles}
    as="div"
    noPaddingBottom={!!nav}
  >
    {children}
    <div>{nav}</div>
  </PageContraints>
);

export default PageInfoContainer;
