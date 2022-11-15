import { gp2 } from '@asap-hub/model';
import {
  Card,
  crossQuery,
  Headline3,
  pixels,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import EmailSection from '../organisms/EmailSection';

type OnboardingCoreDetailProps = Pick<
  gp2.UserResponse,
  'avatarUrl' | 'displayName' | 'email' | 'country' | 'city' | 'positions'
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
const OnboardingCoreDetails: React.FC<OnboardingCoreDetailProps> = ({
  displayName,
  email,
}) => (
  <div css={containerStyles}>
    <div>{displayName}</div>
    <div css={columnStyles}>
      <Card overrideStyles={cardStyles}>
        <Headline3 noMargin>Contact Information</Headline3>
        <div css={contentStyles}>
          <EmailSection contactEmails={[{ email, contact: 'PM Email' }]} />
        </div>
      </Card>
    </div>
  </div>
);

export default OnboardingCoreDetails;
