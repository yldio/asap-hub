import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { ProfileHeader, ProfileAbout } from '../templates';
import { Layout } from '../organisms';
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
    <Layout navigation>
      <article css={styles}>
        <ProfileHeader {...profile} />
        <TabTemplate {...profile} />
      </article>
    </Layout>
  );
};

export default ProfilePage;
