import { gp2 } from '@asap-hub/model';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import {
  Card,
  crossQuery,
  Headline3,
  MembersList,
  pixels,
  TagList,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import ExpandableText from '../molecules/ExpandableText';
import { ProjectMilestones } from '../organisms';
import EmailSection from '../organisms/EmailSection';
import Events from '../organisms/Events';

type ProjectOverviewProps = Pick<
  gp2.ProjectResponse,
  | 'pmEmail'
  | 'leadEmail'
  | 'description'
  | 'keywords'
  | 'milestones'
  | 'members'
  | 'calendar'
>;

const { rem } = pixels;

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(32),
  padding: `${rem(32)} 0 ${rem(48)}`,
});

const contentStyles = css({
  paddingTop: rem(32),
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
const cardStyles = css({ padding: `${rem(32)} ${rem(24)}` });
const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  description,
  pmEmail,
  leadEmail,
  keywords,
  milestones,
  members,
  calendar,
}) => (
  <div css={containerStyles}>
    {!!description && (
      <Card overrideStyles={cardStyles}>
        <Headline3 noMargin>Description</Headline3>
        <div css={contentStyles}>
          <ExpandableText>{description}</ExpandableText>
        </div>
      </Card>
    )}
    <div css={columnStyles}>
      <Card overrideStyles={cardStyles}>
        <Headline3 noMargin>Contact</Headline3>
        <div css={contentStyles}>
          <EmailSection
            contactEmails={[
              { email: pmEmail, contact: 'PM Email' },
              { email: leadEmail, contact: 'Lead Email' },
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
              'Subscribe this project calendar to stay always updated with the latest events.'
            }
          />
        </Card>
      ) : undefined}
    </div>

    <Card overrideStyles={cardStyles}>
      <Headline3 noMargin>Keywords</Headline3>
      <div css={contentStyles}>
        <TagList tags={keywords} />
      </div>
    </Card>
    <Card>
      <Headline3 noMargin>{`Project Members (${members.length})`}</Headline3>
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
        />
      </div>
    </Card>
    <Card padding={false} overrideStyles={cardStyles}>
      <ProjectMilestones milestones={milestones} />
    </Card>
  </div>
);

export default ProjectOverview;
