import {
  Caption,
  Divider,
  Headline2,
  Link,
  Paragraph,
  pixels,
  Subtitle,
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
  gap: rem(24),
  [nonMobileQuery]: {
    display: 'flex',
    flexDirection: 'row',
  },
});
const buttonWrapperStyle = css({
  width: 'fit-content',
  [mobileQuery]: {
    width: '100%',
  },
});

const OnboardingWelcome: React.FC<Record<string, never>> = () => (
  <div css={containerStyles}>
    <header>
      <Headline2 noMargin>Welcome to the GP2 Hub</Headline2>
      <Subtitle accent="lead" margin>
        The closed private network for the Global Parkinson's Genetics Program.
      </Subtitle>
    </header>
    <CardWithOffsetBackground>
      <Paragraph margin={false}>
        As one of the program's valuable members, you have been invited to this
        network to:
      </Paragraph>
      <ul>
        <li>
          <em>Learn and connect</em> with like minded members
        </li>
        <li>
          <em>Track and manage group activities</em> within both your projects
          and working groups
        </li>
        <li>
          <em>Keep informed and updated</em> with what's happening all around
          the GP2 program
        </li>
      </ul>
      <Divider />
      <Paragraph margin={false}>
        Before you begin exploring, please take a small amount of time to fill
        in your profile so that others have a good idea about who you are and
        what to do.
      </Paragraph>
    </CardWithOffsetBackground>
    <Caption accent="lead">
      <strong>Please note,</strong> all information provided can only be viewed
      by other GP2 members that have also registered.
    </Caption>
    <footer css={footerStyles}>
      <div css={buttonWrapperStyle}>
        <Link fullWidth noMargin buttonStyle href={logout({}).$}>
          Sign Out
        </Link>
      </div>
      <div css={buttonWrapperStyle}>
        <Link
          fullWidth
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
