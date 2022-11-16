import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Routing, logout } from '@asap-hub/routing';
import {
  Card,
  crossQuery,
  drawerQuery,
  Headline3,
  Link,
  Paragraph,
  pixels,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { UserDetailHeader } from '../organisms';
import EmailSection from '../organisms/EmailSection';
import { addIcon } from '../icons';

const { onboarding } = gp2Routing;
type OnboardingCoreDetailProps = Pick<gp2Model.UserResponse, 'email'> &
  ComponentProps<typeof UserDetailHeader>;
const { rem } = pixels;

const contentStyles = css({
  paddingTop: rem(32),
});

const footerStyles = css({
  justifyContent: 'space-between',
  [crossQuery]: {
    display: 'flex',
    flexDirection: 'row-reverse',
    button: {
      maxWidth: 'fit-content',
    },
    a: {
      maxWidth: 'fit-content',
    },
  },
});
const footerEditStyles = css({
  display: 'flex',
  gap: rem(32),
  [drawerQuery]: {
    flexDirection: 'column-reverse',
    gap: rem(24),
    paddingBottom: rem(24),
  },
});

const buttonStyles = css({
  [drawerQuery]: {
    flexDirection: 'column-reverse',
    gap: rem(24),
  },
});

const rowStyles = css({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  [crossQuery]: {
    flexDirection: 'row',
    gap: rem(24),
  },
});
const editButtonStyles = css({
  [crossQuery]: {
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
            <Link href={''} buttonStyle noMargin small>
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
    <footer css={footerStyles}>
      <div css={css(footerEditStyles)}>
        <Link buttonStyle noMargin href={onboarding({}).$}>
          Previous
        </Link>
        <Link
          buttonStyle
          enabled={false}
          noMargin
          href={onboarding({}).coreDetails({}).$}
        >
          Continue
        </Link>
      </div>
      <Link buttonStyle noMargin href={logout({}).$}>
        Sign Out
      </Link>
    </footer>
  </div>
);

export default OnboardingCoreDetails;
