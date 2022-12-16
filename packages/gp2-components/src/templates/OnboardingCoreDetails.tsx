import { gp2 as gp2Model } from '@asap-hub/model';
import {
  Card,
  Headline3,
  Link,
  Paragraph,
  pixels,
} from '@asap-hub/react-components';
import { gp2 as gp2Routing, logout } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { addIcon } from '../icons';
import { mobileQuery, nonMobileQuery } from '../layout';
import { UserDetailHeaderCard } from '../organisms';
import EmailSection from '../organisms/EmailSection';

type OnboardingCoreDetailProps = Pick<
  gp2Model.UserResponse,
  'email' | 'secondaryEmail'
> &
  ComponentProps<typeof UserDetailHeaderCard>;

const { onboarding } = gp2Routing;
const { rem } = pixels;

const contentStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(24),
});

const footerStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column-reverse',
  [nonMobileQuery]: {
    flexDirection: 'row',
  },
});
const footerEditStyles = css({
  display: 'flex',
  gap: rem(32),
  [mobileQuery]: {
    flexDirection: 'column-reverse',
    gap: rem(24),
  },
});
const signOutStyles = css({
  [mobileQuery]: {
    paddingTop: rem(24),
  },
});
const rowStyles = css({
  display: 'flex',
  width: '100%',
  flexDirection: 'column-reverse',
  gap: rem(24),
  [nonMobileQuery]: {
    flexDirection: 'row',
  },
});
const editButtonStyles = css({
  [nonMobileQuery]: {
    marginLeft: 'auto',
  },
});
const cardStyles = css({ gap: rem(32) });
const buttonWrapperStyle = css({
  width: 'fit-content',
  [mobileQuery]: {
    width: '100%',
  },
});

const OnboardingCoreDetails: React.FC<OnboardingCoreDetailProps> = ({
  email,
  secondaryEmail,
  ...headerProps
}) => (
  <div css={contentStyles}>
    <Paragraph>
      In order to join the platform, we need to capture some core information
      before you start exploring.
    </Paragraph>
    <UserDetailHeaderCard
      {...headerProps}
      edit={onboarding({}).coreDetails({}).editKeyInfo({}).$}
    />
    <div css={cardStyles}>
      <Card>
        <div css={[rowStyles]}>
          <Headline3 noMargin>Contact Information</Headline3>
          <div css={editButtonStyles}>
            <Link
              fullWidth
              href={onboarding({}).coreDetails({}).editContactInfo({}).$}
              buttonStyle
              noMargin
              small
            >
              Optional {addIcon}
            </Link>
          </div>
        </div>
        <Paragraph accent="lead">
          Provide alternative contact details to your institutional email used
          to sign up.
        </Paragraph>
        <div css={contentStyles}>
          <EmailSection
            contactEmails={[
              { email, contact: 'Institutional Email' },
              { email: secondaryEmail, contact: 'Alternative Email' },
            ]}
          />
        </div>
      </Card>
    </div>
    <footer>
      <div css={footerStyles}>
        <div css={signOutStyles}>
          <Link fullWidth buttonStyle noMargin href={logout({}).$}>
            Sign Out
          </Link>
        </div>
        <div css={css(footerEditStyles)}>
          <div css={buttonWrapperStyle}>
            <Link
              enabled={false}
              fullWidth
              buttonStyle
              noMargin
              href={onboarding({}).$}
            >
              Previous
            </Link>
          </div>
          <div css={buttonWrapperStyle}>
            <Link
              fullWidth
              buttonStyle
              enabled={false}
              noMargin
              href={onboarding({}).coreDetails({}).$}
            >
              Continue
            </Link>
          </div>
        </div>
      </div>
    </footer>
  </div>
);

export default OnboardingCoreDetails;
