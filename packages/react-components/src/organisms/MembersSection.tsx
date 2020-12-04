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
  gridTemplateColumns: `${48 / perRem}em 1fr`,
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: `${48 / perRem}em 1fr ${48 / perRem}em 1fr`,
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
  readonly title?: string;
  readonly members: (Omit<TeamMember, 'role'> & {
    role: string;
  })[];
};

const MembersSection: React.FC<MembersSectionProps> = ({
  members,
  title = `Team Members (${members.length})`,
}) => {
  return (
    <Card>
      <Headline2 styleAsHeading={3}>{title}</Headline2>
      <ul css={containerStyles}>
        {members.map(
          ({ id, displayName, firstName, lastName, avatarUrl, role }) => (
            <li key={id} css={{ display: 'contents' }}>
              <Link
                href={`/network/users/${id}`}
                theme={null}
                display="contents"
              >
                <div css={avatarStyles}>
                  <Avatar
                    imageUrl={avatarUrl}
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
