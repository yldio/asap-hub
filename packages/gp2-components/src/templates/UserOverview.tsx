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
import UserExternalProfiles from '../organisms/UserExternalProfiles';

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
  | 'social'
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
  social,
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
          <Headline3 noMargin>Expertise and Interests</Headline3>
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
          <div css={contentStyles}>
            <UserProjects projects={projects} firstName={firstName} id={id} />
          </div>
        </div>
      </Card>
    )}
    {workingGroups.length > 0 && (
      <Card padding={false}>
        <div css={cardStyles}>
          <Headline3 noMargin>Working Groups</Headline3>
          <div css={contentStyles}>
            <UserWorkingGroups
              workingGroups={workingGroups}
              firstName={firstName}
              id={id}
            ></UserWorkingGroups>
          </div>
        </div>
      </Card>
    )}
    <Card padding={false}>
      <div css={cardStyles}>
        <UserQuestions questions={questions} firstName={firstName} />
      </div>
    </Card>
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
    {social && Object.values(social).filter((value) => !!value) && (
      <Card padding={false}>
        <div css={cardStyles}>
          <Headline3 noMargin>External Profiles</Headline3>
          <div css={contentStyles}>
            <UserExternalProfiles social={social} />
          </div>
        </div>
      </Card>
    )}
  </div>
);

export default UserOverview;
