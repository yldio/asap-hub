import { gp2 } from '@asap-hub/model';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import {
  Card,
  crossQuery,
  Headline3,
  MembersList,
  pixels,
} from '@asap-hub/react-components';

import { css } from '@emotion/react';
import ExpandableText from '../molecules/ExpandableText';
import EmailSection from '../organisms/EmailSection';
import Events from '../organisms/Events';
// import { Milestones } from '../organisms';

type WorkingGroupOverviewProps = Pick<
  gp2.WorkingGroupResponse,
  | 'members'
  | 'description'
  | 'primaryEmail'
  | 'secondaryEmail'
  | 'calendar'
  // | 'milestones'
>;

const { rem } = pixels;

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(32),
  padding: `${rem(32)} 0 ${rem(48)}`,
});

const contentStyles = css({
  marginTop: rem(32),
});
const cardStyles = css({ padding: `${rem(32)} ${rem(24)}` });
const columnStyles = css({
  display: 'grid',
  columnGap: rem(32),
  gridRowGap: rem(32),
  [crossQuery]: {
    gridTemplateColumns: '1fr 1fr',
    rowGap: rem(32),
  },
});

const WorkingGroupOverview: React.FC<WorkingGroupOverviewProps> = ({
  description,
  primaryEmail,
  secondaryEmail,
  members,
  calendar,
  // milestones,
}) => (
  <div css={containerStyles}>
    <Card>
      <Headline3 noMargin>Description</Headline3>
      <div css={contentStyles}>
        <ExpandableText>{description}</ExpandableText>
      </div>
    </Card>
    <div css={columnStyles}>
      <Card>
        <Headline3 noMargin>Contact</Headline3>
        <div css={contentStyles}>
          <EmailSection
            contactEmails={[
              { email: primaryEmail, contact: 'WG Email' },
              { email: secondaryEmail, contact: 'Lead Email' },
            ]}
          />
        </div>
      </Card>
      {calendar ? (
        <Card overrideStyles={cardStyles}>
          <Headline3 noMargin>Events</Headline3>
          <Events
            calendarId={calendar.id}
            paragraph={
              'Subscribe this working group calendar to stay always updated with the latest events.'
            }
          />
        </Card>
      ) : undefined}
    </div>
    <Card>
      <Headline3
        noMargin
      >{`Working Group Members (${members.length})`}</Headline3>
      <div css={contentStyles}>
        <MembersList
          members={members.map(
            ({ role, firstName, lastName, avatarUrl, userId: id }) => ({
              firstLine: `${firstName} ${lastName}`,
              secondLine: role,
              avatarUrl,
              firstName,
              lastName,
              id,
            }),
          )}
          userRoute={gp2Routing.users({}).user}
          overrideNameStyles={css({ overflowWrap: 'anywhere' })}
        />
      </div>
    </Card>
    {/* <Card padding={false} overrideStyles={cardStyles}>
      <Milestones
        milestones={milestones}
        title="Working Group Milestones"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat"
      />
    </Card> */}
  </div>
);

export default WorkingGroupOverview;
