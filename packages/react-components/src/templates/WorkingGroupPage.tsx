import { ComponentProps, PropsWithChildren } from 'react';
import { css } from '@emotion/react';

import WorkingGroupPageHeader from './WorkingGroupPageHeader';
import { networkPageLayoutPaddingStyle } from '../layout';

const mainStyles = css({
  padding: networkPageLayoutPaddingStyle,
});

const WorkingGroupPage: React.FC<
  PropsWithChildren<ComponentProps<typeof WorkingGroupPageHeader>>
> = ({ children, ...props }) => (
  <article>
    <WorkingGroupPageHeader {...props} />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default WorkingGroupPage;
