import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import ProfileAbout from './ProfileAbout';
import ProfileHeader from './ProfileHeader';
import { perRem } from '../pixels';

const styles = css({
  alignSelf: 'stretch',
  paddingTop: `${36 / perRem}em`,
});

const tabTemplates = {
  about: ProfileAbout,
  researchInterests: () => <>TODO Research Interests here</>,
  outputs: () => <>TODO Outputs here</>,
};

type ProfilePageProps = ComponentProps<typeof ProfileHeader> &
  ComponentProps<typeof ProfileAbout> & {
    tab: 'about' | 'researchInterests' | 'outputs';
  };

const ProfilePage: React.FC<ProfilePageProps> = ({ tab, ...profile }) => {
  const TabTemplate = tabTemplates[tab];
  return (
    <article css={styles}>
      <ProfileHeader {...profile} />
      <TabTemplate {...profile} />
    </article>
  );
};

export default ProfilePage;
