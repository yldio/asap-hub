import { gp2 } from '@asap-hub/model';
import {
  Card,
  crossQuery,
  Headline3,
  pixels,
  TagList,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import ExpandableText from '../molecules/ExpandableText';
import EmailSection from '../organisms/EmailSection';

type UserOverviewProps = Pick<
  gp2.UserResponse,
  'email' | 'secondaryEmail' | 'biography' | 'keywords'
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
const UserOverview: React.FC<UserOverviewProps> = ({
  biography,
  email,
  secondaryEmail,
  keywords,
}) => (
  <div css={containerStyles}>
    <Card overrideStyles={cardStyles}>
      <Headline3 noMargin>Biography</Headline3>
      <div css={contentStyles}>
        <ExpandableText>{biography}</ExpandableText>
      </div>
    </Card>
    <div css={columnStyles}>
      <Card overrideStyles={cardStyles}>
        <Headline3 noMargin>Contact Information</Headline3>
        <div css={contentStyles}>
          <EmailSection
            contactEmails={[
              { email, contact: 'Institutional email' },
              { email: secondaryEmail, contact: 'Alternative email' },
            ]}
          />
        </div>
      </Card>
      <Card overrideStyles={cardStyles}>
        <Headline3 noMargin>Expertise and Interests</Headline3>
        <div css={contentStyles}>
          <TagList tags={keywords} />
        </div>
      </Card>
    </div>
  </div>
);

export default UserOverview;
