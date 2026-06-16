import { gp2 } from '@asap-hub/model';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import {
  Card,
  crossQuery,
  ExpandableText,
  Headline3,
  MembersList,
  Paragraph,
  pixels,
  RichText,
  TagList,
  TabbedContent,
} from '@asap-hub/react-components';

import { css } from '@emotion/react';
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
> & {
  children?: React.ReactNode;
};

type MemberListProps = { data: gp2.WorkingGroupMember[] };

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

const memberListStyles = css({
  paddingTop: rem(32),
});

const tabDescriptionStyles = css({
  fontWeight: 'bold',
  margin: `${rem(8)} 0`,
});

const LEADER_ROLES: ReadonlySet<gp2.WorkingGroupMemberRole> = new Set([
  'Lead',
  'Co-lead',
]);

const isActive = (member: gp2.WorkingGroupMember) =>
  !member.alumniSinceDate && !member.inactiveSinceDate;

const splitActivePast = <T,>(
  arr: T[],
  predicate: (item: T) => boolean,
): [T[], T[]] => {
  const active = [];
  const past = [];
  for (const elmnt of arr)
    predicate(elmnt) ? active.push(elmnt) : past.push(elmnt);
  return [active, past];
};

const WorkingGroupOverview: React.FC<WorkingGroupOverviewProps> = ({
  description,
  primaryEmail,
  secondaryEmail,
  members,
  calendar,
  milestones,
  tags,
}) => {
  const leaders = members.filter(({ role }) => LEADER_ROLES.has(role));
  const regularMembers = members.filter(({ role }) => !LEADER_ROLES.has(role));

  const [activeLeaders, pastLeaders] = splitActivePast(leaders, isActive);
  const [activeMembers, pastMembers] = splitActivePast(
    regularMembers,
    isActive,
  );

  return (
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
            Explore keywords related to skills, techniques, resources, and
            tools.
          </Paragraph>
          <div css={contentStyles}>
            <TagList tags={tags.map(({ name }) => name)} />
          </div>
        </Card>
      ) : null}
      <Card overrideStyles={cardStyles}>
        <TabbedContent
          title={`Working Group Members (${members.length})`}
          description={
            <Paragraph noMargin styles={tabDescriptionStyles}>
              Leaders
            </Paragraph>
          }
          tabs={[
            {
              tabTitle: `Active Leaders (${activeLeaders.length})`,
              items: activeLeaders,
              empty: (
                <Paragraph accent="lead">
                  There are no active leaders.
                </Paragraph>
              ),
            },
            {
              tabTitle: `Past Leaders (${pastLeaders.length})`,
              items: pastLeaders,
              empty: (
                <div css={{ marginBottom: rem(56) }}>
                  <Paragraph accent="lead">
                    There are no past leaders.
                  </Paragraph>
                </div>
              ),
            },
          ]}
        >
          {({ data }: MemberListProps) => (
            <div css={memberListStyles}>
              <MembersList
                members={data.map(
                  ({
                    role,
                    firstName,
                    lastName,
                    displayName,
                    avatarUrl,
                    alumniSinceDate,
                    userId: id,
                  }) => ({
                    firstLine: displayName,
                    secondLine: role,
                    avatarUrl,
                    firstName,
                    lastName,
                    alumniSinceDate,
                    id,
                  }),
                )}
                userRoute={gp2Routing.users({}).user}
                overrideNameStyles={css({ overflowWrap: 'anywhere' })}
              />
            </div>
          )}
        </TabbedContent>
        <div css={{ marginTop: rem(-24) }}>
          <TabbedContent
            description={
              <Paragraph noMargin styles={tabDescriptionStyles}>
                Members
              </Paragraph>
            }
            tabs={[
              {
                tabTitle: `Active Members (${activeMembers.length})`,
                items: activeMembers,
                truncateFrom: 8,
                empty: (
                  <Paragraph accent="lead">
                    There are no active members.
                  </Paragraph>
                ),
              },
              {
                tabTitle: `Past Members (${pastMembers.length})`,
                items: pastMembers,
                truncateFrom: 8,
                empty: (
                  <div css={{ marginBottom: rem(8) }}>
                    <Paragraph accent="lead" noMargin>
                      There are no past members.
                    </Paragraph>
                  </div>
                ),
              },
            ]}
            getShowMoreText={(showMore: boolean) =>
              `View ${showMore ? 'Less' : 'More'} Members`
            }
          >
            {({ data }: MemberListProps) => (
              <div css={memberListStyles}>
                <MembersList
                  members={data.map(
                    ({
                      role,
                      firstName,
                      lastName,
                      displayName,
                      avatarUrl,
                      alumniSinceDate,
                      userId: id,
                    }) => ({
                      firstLine: displayName,
                      secondLine: role,
                      avatarUrl,
                      firstName,
                      lastName,
                      alumniSinceDate,
                      id,
                    }),
                  )}
                  userRoute={gp2Routing.users({}).user}
                  overrideNameStyles={css({ overflowWrap: 'anywhere' })}
                />
              </div>
            )}
          </TabbedContent>
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
};

export default WorkingGroupOverview;
