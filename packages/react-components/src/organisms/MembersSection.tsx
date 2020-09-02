import React from 'react';
import css from '@emotion/css';
import { TeamMember } from '@asap-hub/model';

import { Link, Card, Headline2, Avatar } from '../atoms';
import { lead } from '../colors';
import { perRem, tabletScreen } from '../pixels';

const containerStyles = css({
  margin: 0,
  padding: 0,
  display: 'grid',

  gridColumnGap: `${18 / perRem}em`,
  gridTemplateColumns: 'min-content 1fr',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: 'min-content 1fr min-content 1fr',
  },

  alignItems: 'center',
  gridAutoRows: '1fr',
  gridAutoFlow: 'row dense',
});

const avatarStyles = css({
  gridRowEnd: 'span 2',
});
const nameStyles = css({
  alignSelf: 'end',
  marginTop: `${12 / perRem}em`,

  fontWeight: 'bold',
});
const roleStyles = css({
  gridColumn: 2,
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    'li:nth-of-type(2n) &': {
      gridColumn: 4,
    },
  },
  alignSelf: 'start',
  marginBottom: `${24 / perRem}em`,

  color: lead.rgb,
});

type MembersSectionProps = {
  readonly members: TeamMember[];
};
const MembersSection: React.FC<MembersSectionProps> = ({ members }) => {
  return (
    <Card>
      <Headline2 styleAsHeading={3}>Team Members ({members.length})</Headline2>
      <ul css={containerStyles}>
        {members.map(
          ({ id, displayName, firstName, lastName, avatarURL, role }) => (
            <li key={id} css={{ display: 'contents' }}>
              <Link href={`/users/${id}`} theme={null} display="contents">
                <div css={avatarStyles}>
                  <Avatar
                    imageUrl={avatarURL}
                    small
                    border
                    firstName={firstName}
                    lastName={lastName}
                  />
                </div>
                <div css={nameStyles}>{displayName}</div>
                <div css={roleStyles}>{role}</div>
              </Link>
            </li>
          ),
        )}
      </ul>
    </Card>
  );
};

export default MembersSection;
