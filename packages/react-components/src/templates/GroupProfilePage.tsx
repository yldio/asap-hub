import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import GroupProfileHeader from './GroupProfileHeader';
import { perRem } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';

const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(10)}`,
});

type GroupProfilePageProps = ComponentProps<typeof GroupProfileHeader>;
const GroupProfilePage: React.FC<GroupProfilePageProps> = ({
  children,
  ...props
}) => (
  <article>
    <GroupProfileHeader {...props} />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default GroupProfilePage;
