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
import { UserDetailHeader } from '../organisms';
import EmailSection from '../organisms/EmailSection';

const { onboarding } = gp2Routing;
type OnboardingCoreDetailProps = Pick<gp2Model.UserResponse, 'email'> &
  ComponentProps<typeof UserDetailHeader>;
const { rem } = pixels;

const contentStyles = css({
  paddingTop: rem(32),
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

const buttonStyles = css({
  [mobileQuery]: {
    flexDirection: 'column-reverse',
    gap: rem(24),
  },
});

const rowStyles = css({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  [nonMobileQuery]: {
    flexDirection: 'row',
    gap: rem(24),
  },
});
const editButtonStyles = css({
  [nonMobileQuery]: {
    marginLeft: 'auto',
  },
});
const descriptionStyles = css({ paddingBottom: rem(32) });
const cardStyles = css({ padding: `${rem(32)} 0` });
const OnboardingCoreDetails: React.FC<OnboardingCoreDetailProps> = ({
  email,
  ...headerProps
}) => (
  <div css={contentStyles}>
    <div css={descriptionStyles}>
      In order to join the platform, we need to capture some core information
      before you start exploring.
    </div>
    <UserDetailHeader {...headerProps} edit={'/edit'} />
    <div css={cardStyles}>
      <Card>
        <div css={[rowStyles, buttonStyles]}>
          <Headline3 noMargin>Contact Information</Headline3>
          <div css={editButtonStyles}>
            <Link tabletFullWidth href={''} buttonStyle noMargin small>
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
            contactEmails={[{ email, contact: 'Institutional Email' }]}
          />
        </div>
      </Card>
    </div>
    <footer>
      <div css={footerStyles}>
        <div css={signOutStyles}>
          <Link tabletFullWidth buttonStyle noMargin href={logout({}).$}>
            Sign Out
          </Link>
        </div>
        <div css={css(footerEditStyles)}>
          <Link
            enabled={false}
            tabletFullWidth
            buttonStyle
            noMargin
            href={onboarding({}).$}
          >
            Previous
          </Link>
          <Link
            tabletFullWidth
            buttonStyle
            enabled={false}
            noMargin
            href={onboarding({}).coreDetails({}).$}
          >
            Continue
          </Link>
        </div>
      </div>
    </footer>
  </div>
);

export default OnboardingCoreDetails;
