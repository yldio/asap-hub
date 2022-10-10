import { ProjectResponse } from '@asap-hub/model/src/gp2';
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

type ProjectOverviewProps = Pick<
  ProjectResponse,
  | 'pmEmail'
  | 'leadEmail'
  | 'description'
  | 'keywords'
  | 'milestones'
  | 'members'
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
        <Headline3 noMargin>Contact Information</Headline3>
        <div css={contentStyles}>
          <EmailSection
            contactEmails={[
              { email: pmEmail, contact: 'PM Email' },
              { email: leadEmail, contact: 'Lead Email' },
            ]}
          />
        </div>
      </Card>
      <Card overrideStyles={cardStyles}>
        <Headline3 noMargin>Keywords</Headline3>
        <div css={contentStyles}>
          <TagList tags={keywords} />
        </div>
      </Card>
    </div>
    {!!members.length && (
      <Card>
        <Headline3
          noMargin
        >{`Working Group Members (${members.length})`}</Headline3>
        <div css={contentStyles}>
          <MembersList
            members={members.map(
              ({ firstName, lastName, avatarUrl, userId: id }) => ({
                firstLine: `${firstName} ${lastName}`,
                avatarUrl,
                firstName,
                lastName,
                id,
              }),
            )}
          />
        </div>
      </Card>
    )}
    <Card padding={false} overrideStyles={cardStyles}>
      <ProjectMilestones milestones={milestones} />
    </Card>
  </div>
);

export default ProjectOverview;
