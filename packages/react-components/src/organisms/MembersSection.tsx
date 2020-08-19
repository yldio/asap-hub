import React from 'react';
import css from '@emotion/css';

import { Link, Card, Headline2, Avatar, Paragraph } from '../atoms';
import { perRem, mobileScreen } from '../pixels';

type MembersSectionProps = {
  readonly members: {
    readonly id: string;
    readonly firstName?: string;
    readonly lastName?: string;
    readonly displayName: string;
    readonly role: string;
    readonly avatarURL?: string;
  }[];
};

const containerStyles = css({
  padding: 0,
  listStyle: 'none',

  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
});

const avatarContainer = css({
  flexBasis: 1,
});

const detailsContainer = css({
  paddingLeft: `${12 / perRem}em`,
});

const memberContainerStyles = css({
  flexBasis: '50%',
  [`@media (max-width: ${mobileScreen.width}px)`]: {
    flexBasis: '100%',
    flexDirection: 'column',
  },

  display: 'flex',
});

const MembersSection: React.FC<MembersSectionProps> = ({ members = [] }) => {
  return (
    <Card>
      <Headline2 styleAsHeading={3}>Team Members ({members.length})</Headline2>
      <ul css={containerStyles}>
        {members.map(
          ({ id, displayName, firstName, lastName, avatarURL, role }) => (
            <li key={id} css={memberContainerStyles}>
              <Link href={`/users/${id}`} underline={false}>
                <div css={{ display: 'flex', alignItems: 'center' }}>
                  <div css={avatarContainer}>
                    <Avatar
                      imageUrl={avatarURL}
                      border
                      firstName={firstName}
                      lastName={lastName}
                    />
                  </div>
                  <div css={detailsContainer}>
                    <Paragraph primary accent="charcoal">
                      {displayName}
                    </Paragraph>
                    <Paragraph accent="lead">{role}</Paragraph>
                  </div>
                </div>
              </Link>
            </li>
          ),
        )}
      </ul>
    </Card>
  );
};

export default MembersSection;
