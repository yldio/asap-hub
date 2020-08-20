import React from 'react';
import css from '@emotion/css';

import { contentSidePaddingWithNavigation } from '../pixels';
import { TabLink } from '../atoms';
import { TabNav } from '../molecules';

const containerStyles = css({
  alignSelf: 'stretch',

  padding: `0 ${contentSidePaddingWithNavigation(8)}`,
});

type TeamProps = {
  readonly aboutHref: string;
  readonly outputsHref: string;
};

const ProfileHeader: React.FC<TeamProps> = ({ aboutHref, outputsHref }) => {
  return (
    <header css={containerStyles}>
      <section>Header</section>
      <TabNav>
        <TabLink href={aboutHref}>About</TabLink>
        <TabLink href={outputsHref}>Shared Outputs</TabLink>
      </TabNav>
    </header>
  );
};

export default ProfileHeader;
