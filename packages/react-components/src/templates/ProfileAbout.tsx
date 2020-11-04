import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { ProfileBiography, ProfileRecentWorks } from '../organisms';
import {
  perRem,
  tabletScreen,
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
} from '../pixels';
import { editIcon } from '../icons';
import { Link } from '../atoms';

const styles = css({
  // compensate for cards having more bottom than top padding (see below)
  paddingTop: `${24 / perRem}em`,
  paddingBottom: `${12 / perRem}em`,

  display: 'grid',
  gridTemplate: `
    repeat(2, [edit] minmax(${12 / perRem}em, auto) [card] auto)
  / [card edit] auto
  `,

  [`@media (min-width: ${tabletScreen.width}px)`]: {
    gridTemplate: `
      repeat(2, [card edit] auto)
    / [none] ${36 / perRem}em [card] auto [edit] ${36 / perRem}em
    `,
    gridColumnGap: vminLinearCalc(
      mobileScreen,
      24,
      largeDesktopScreen,
      30,
      'px',
    ),
  },
});
const cardStyles = css({
  // bottom only to separate from the pencil belonging to the next card
  paddingBottom: `${24 / perRem}em`,
  [`@media (min-width: ${tabletScreen.width}px)`]: {
    // top to align with pencil on the side
    paddingTop: `${12 / perRem}em`,
  },
});
const editButtonStyles = css({
  justifySelf: 'end',
});

export interface ProfileAboutProps {
  biography?: ComponentProps<typeof ProfileBiography>['biography'];
  biosketch?: ComponentProps<typeof ProfileBiography>['biosketch'];
  orcidWorks?: ComponentProps<typeof ProfileRecentWorks>['orcidWorks'];

  editBiographyHref?: string;
  editOrcidWorksHref?: string;
}

const ProfileAbout: React.FC<ProfileAboutProps> = ({
  biography,
  biosketch,
  orcidWorks,

  editBiographyHref,
  editOrcidWorksHref,
}) => (
  <div css={styles}>
    <div css={[cardStyles, { gridArea: '1 card / card' }]}>
      {biography && (
        <ProfileBiography biosketch={biosketch} biography={biography} />
      )}
    </div>
    <div css={[editButtonStyles, { gridArea: '1 edit / edit' }]}>
      {editBiographyHref && (
        <Link
          buttonStyle
          small
          primary
          href={editBiographyHref}
          label="Edit biography"
        >
          {editIcon}
        </Link>
      )}
    </div>
    <div css={[cardStyles, { gridArea: '2 card / card' }]}>
      {orcidWorks && orcidWorks.length ? (
        <ProfileRecentWorks orcidWorks={orcidWorks} />
      ) : null}
    </div>
    <div css={[editButtonStyles, { gridArea: '2 edit / edit' }]}>
      {editOrcidWorksHref && (
        <Link
          buttonStyle
          small
          primary
          href={editOrcidWorksHref}
          label="Edit recent works visibility"
        >
          {editIcon}
        </Link>
      )}
    </div>
  </div>
);

// TODO test
export default ProfileAbout;
