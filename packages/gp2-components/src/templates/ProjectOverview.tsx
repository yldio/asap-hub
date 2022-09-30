import { ProjectResponse } from '@asap-hub/model/src/gp2';
import { Card, Headline3, pixels, TagList } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import ExpandableText from '../molecules/ExpandableText';
import EmailSection from '../organisms/EmailSection';

type ProjectOverviewProps = Pick<
  ProjectResponse,
  'pmEmail' | 'leadEmail' | 'description' | 'keywords'
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

const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  description,
  pmEmail,
  leadEmail,
  keywords,
}) => (
  <div css={containerStyles}>
    <Card>
      <Headline3 noMargin>Description</Headline3>
      <div css={contentStyles}>
        <ExpandableText>{description}</ExpandableText>
      </div>
    </Card>
    <Card>
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
    <Card>
      <Headline3 noMargin>Keywords</Headline3>
      <TagList tags={keywords} />
    </Card>
  </div>
);

export default ProjectOverview;
