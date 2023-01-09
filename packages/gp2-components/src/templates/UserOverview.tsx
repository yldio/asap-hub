import { gp2 } from '@asap-hub/model';
import {
  Card,
  crossQuery,
  Headline3,
  pixels,
  TagList,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import ExpandableText from '../molecules/ExpandableText';
import EmailSection from '../organisms/EmailSection';
import UserQuestions from '../organisms/UserQuestions';
import UserProjects from '../organisms/UserProjects';
import UserWorkingGroups from '../organisms/UserWorkingGroups';
import { UserContributingCohorts } from '../organisms';

type UserOverviewProps = Pick<
  gp2.UserResponse,
  | 'id'
  | 'email'
  | 'secondaryEmail'
  | 'biography'
  | 'keywords'
  | 'fundingStreams'
  | 'projects'
  | 'workingGroups'
  | 'firstName'
  | 'contributingCohorts'
> &
  ComponentProps<typeof UserQuestions>;

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
  gap: rem(32),
  [crossQuery]: {
    gridTemplateColumns: '1fr 1fr',
    rowGap: rem(32),
  },
});
const cardStyles = css({ padding: `${rem(32)} ${rem(24)}` });
const UserOverview: React.FC<UserOverviewProps> = ({
  id,
  biography,
  email,
  secondaryEmail,
  keywords,
  fundingStreams,
  questions,
  projects,
  workingGroups,
  firstName,
  contributingCohorts,
}) => (
  <div css={containerStyles}>
    <div css={[columnStyles]}>
      <Card padding={false}>
        <div css={cardStyles}>
          <Headline3 noMargin>Contact Information</Headline3>
          <div css={contentStyles}>
            <EmailSection
              contactEmails={[
                { email, contact: 'Institutional email' },
                { email: secondaryEmail, contact: 'Alternative email' },
              ]}
            />
          </div>
        </div>
      </Card>
      <Card padding={false}>
        <div css={cardStyles}>
          <Headline3 noMargin>Keywords</Headline3>
          <div css={contentStyles}>
            <TagList tags={keywords} />
          </div>
        </div>
      </Card>
    </div>
    <Card padding={false}>
      <div css={cardStyles}>
        <Headline3 noMargin>Biography</Headline3>
        <div css={contentStyles}>
          <ExpandableText>{biography}</ExpandableText>
        </div>
      </div>
    </Card>
    {projects.length > 0 && (
      <Card padding={false}>
        <div css={cardStyles}>
          <Headline3 noMargin>Projects</Headline3>
          <UserProjects projects={projects} firstName={firstName} id={id} />
        </div>
      </Card>
    )}
    {workingGroups.length > 0 && (
      <Card padding={false}>
        <div css={cardStyles}>
          <Headline3 noMargin>Working Groups</Headline3>
          <UserWorkingGroups
            workingGroups={workingGroups}
            firstName={firstName}
            id={id}
          />
        </div>
      </Card>
    )}
    {questions.length > 0 && (
      <Card padding={false}>
        <div css={cardStyles}>
          <Headline3 noMargin>Open Questions</Headline3>
          <UserQuestions questions={questions} firstName={firstName} />
        </div>
      </Card>
    )}
    {fundingStreams && (
      <Card padding={false}>
        <div css={cardStyles}>
          <Headline3 noMargin>Funding Streams</Headline3>
          <div css={contentStyles}>
            <ExpandableText>{fundingStreams}</ExpandableText>
          </div>
        </div>
      </Card>
    )}
    {contributingCohorts.length > 0 && (
      <Card padding={false}>
        <div css={cardStyles}>
          <Headline3 noMargin>Contributing Cohort Studies</Headline3>
          <UserContributingCohorts
            contributingCohorts={contributingCohorts}
            firstName={firstName}
          />
        </div>
      </Card>
    )}
  </div>
);

export default UserOverview;
