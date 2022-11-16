import {
  Caption,
  Divider,
  Headline2,
  Link,
  Paragraph,
  Subtitle,
  pixels,
} from '@asap-hub/react-components';
import { gp2, logout } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { mobileQuery, nonMobileQuery } from '../layout';
import CardWithOffsetBackground from '../molecules/CardWithOffsetBackground';

const { onboarding } = gp2;
const { rem } = pixels;

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'left',
});

const footerStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column-reverse',
  [nonMobileQuery]: {
    display: 'flex',
    flexDirection: 'row',
  },
});
const signOutStyles = css({
  [mobileQuery]: {
    paddingTop: rem(12),
  },
});
const continueStyles = css({
  [mobileQuery]: {
    paddingBottom: rem(12),
  },
});

const OnboardingWelcome: React.FC<Record<string, never>> = () => (
  <div css={containerStyles}>
    <header>
      <Headline2 noMargin>Welcome to the GP2 Hub</Headline2>
      <Subtitle accent="lead" hasMargin>
        The closed private network for the Global Parkinson's Genetics Program.
      </Subtitle>
    </header>
    <CardWithOffsetBackground>
      As one of the program's valuable members, you have been invited to this
      network to:
      <ul>
        <li>
          <i>Learn and connect</i> with like minded members
        </li>
        <li>
          <i>Track and manage group activities</i> within both your projects and
          working groups
        </li>
        <li>
          <i>Keep informed and updated</i> with what's happening all around the
          GP2 program
        </li>
      </ul>
      <Divider />
      <Paragraph hasMargin={false}>
        Before you begin exploring, please take a small amount of time to fill
        in your profile so that others have a good idea about who you are and
        what to do.
      </Paragraph>
    </CardWithOffsetBackground>
    <Caption accent="lead">
      <b>Please note,</b> all information provided can only be viewed by other
      GP2 members that have also registered.
    </Caption>
    <footer css={footerStyles}>
      <div css={signOutStyles}>
        <Link tabletFullWidth noMargin buttonStyle href={logout({}).$}>
          Sign Out
        </Link>
      </div>
      <div css={continueStyles}>
        <Link
          tabletFullWidth
          noMargin
          buttonStyle
          primary
          href={onboarding({}).coreDetails({}).$}
        >
          Get Started
        </Link>
      </div>
    </footer>
  </div>
);

export default OnboardingWelcome;
