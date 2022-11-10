import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { perRem } from '../pixels';
import WorkingGroupHeader from './WorkingGroupHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const WorkingGroupPage: React.FC<ComponentProps<typeof WorkingGroupHeader>> = ({
  children,
  ...props
}) => (
  <article>
    <WorkingGroupHeader {...props} />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default WorkingGroupPage;
