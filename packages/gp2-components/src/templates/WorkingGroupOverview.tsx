import { gp2 } from '@asap-hub/model';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import {
  Card,
  crossQuery,
  Headline3,
  MembersList,
  Paragraph,
  pixels,
  RichText,
  TagList,
} from '@asap-hub/react-components';

import { css } from '@emotion/react';
import ExpandableText from '../molecules/ExpandableText';
import EmailSection from '../organisms/EmailSection';
import Events from '../organisms/Events';
import { Milestones } from '../organisms';

type WorkingGroupOverviewProps = Pick<
  gp2.WorkingGroupResponse,
  | 'members'
  | 'description'
  | 'primaryEmail'
  | 'secondaryEmail'
  | 'calendar'
  | 'milestones'
  | 'tags'
>;

const { rem } = pixels;

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(32),
  padding: `0 0 ${rem(48)}`,
});

const contentStyles = css({
  marginTop: rem(32),
});
const cardStyles = css({
  padding: rem(24),
});
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
  milestones,
  tags,
}) => (
  <div css={containerStyles}>
    <Card overrideStyles={cardStyles}>
      <Headline3 noMargin>Description</Headline3>
      <div css={contentStyles}>
        <ExpandableText>
          <RichText text={description} />
        </ExpandableText>
      </div>
    </Card>
    <div css={columnStyles}>
      <Card overrideStyles={cardStyles}>
        <Headline3 noMargin>Contact Details</Headline3>
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
    {tags.length ? (
      <Card overrideStyles={cardStyles}>
        <Headline3 noMargin>Tags</Headline3>
        <Paragraph accent="lead">
          Explore keywords related to skills, techniques, resources, and tools.
        </Paragraph>
        <div css={contentStyles}>
          <TagList tags={tags.map(({ name }) => name)} />
        </div>
      </Card>
    ) : null}
    <Card overrideStyles={cardStyles}>
      <Headline3
        noMargin
      >{`Working Group Members (${members.length})`}</Headline3>
      <div css={contentStyles}>
        <MembersList
          members={members.map(
            ({
              role,
              firstName,
              lastName,
              displayName,
              avatarUrl,
              userId: id,
            }) => ({
              firstLine: displayName,
              secondLine: role,
              avatarUrl,
              firstName,
              lastName,
              id,
            }),
          )}
          userRoute={(params: { id: string }) =>
            gp2Routing.users.DEFAULT.DETAILS.buildPath({ userId: params.id })
          }
          overrideNameStyles={css({ overflowWrap: 'anywhere' })}
        />
      </div>
    </Card>
    <Card overrideStyles={cardStyles}>
      <Milestones
        milestones={milestones}
        title="Working Group Milestones"
        description=""
      />
    </Card>
  </div>
);

export default WorkingGroupOverview;
