import React from 'react';
import css from '@emotion/css';
import { PageResponse } from '@asap-hub/model';

import { perRem, contentSidePaddingWithNavigation } from '../pixels';
import { Display, RichText } from '../atoms';

const styles = css({
  alignSelf: 'stretch',
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

type ProfilePageProps = PageResponse;
const ProfilePage: React.FC<ProfilePageProps> = ({ text, title }) => {
  return (
    <article css={styles}>
      <Display>{title}</Display>
      <RichText toc text={text} />
    </article>
  );
};

export default ProfilePage;
