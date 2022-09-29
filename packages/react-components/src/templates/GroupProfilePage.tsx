import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import GroupProfileHeader from './GroupProfileHeader';
import { perRem } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';
import { Toast } from '../organisms';

const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(10)}`,
});

type GroupProfilePageProps = ComponentProps<typeof GroupProfileHeader>;
const GroupProfilePage: React.FC<GroupProfilePageProps> = ({
  children,
  active,
  ...props
}) => (
  <article>
    {!active && (
      <Toast accent="info">
        This group is inactive and might not have all content available.
      </Toast>
    )}
    <GroupProfileHeader {...props} active={active} />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default GroupProfilePage;
