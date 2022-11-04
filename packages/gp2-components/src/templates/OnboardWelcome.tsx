import {
  Caption,
  Divider,
  Headline2,
  Subtitle,
  Paragraph,
  Link,
  pixels,
  Button,
} from '@asap-hub/react-components';
import { logout } from '@asap-hub/routing';
import { css } from '@emotion/react';
import CardWithCornerBackground from '../molecules/CardWithCornerBackground';
import BasicLayout from './BasicLayout';

const { mobileScreen } = pixels;

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'left',
});

const footerStyles = css({
  justifyContent: 'space-between',
  [`@media (min-width: ${mobileScreen.max}px)`]: {
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

const OnboardWelcome: React.FC<Record<string, never>> = () => (
  <BasicLayout>
    <div css={containerStyles}>
      <header>
        <Headline2 noMargin>Welcome to the GP2 Hub</Headline2>
        <Subtitle accent="lead" hasMargin>
          The closed private network for the Global Parkinson's Genetics
          Program.
        </Subtitle>
      </header>

      <CardWithCornerBackground>
        As one of the program's valuable members, you have been invited to this
        network to:
        <ul>
          <li>
            <i>Learn and connect</i> with like minded members
          </li>
          <li>
            <i>Track and manage group activities</i> within both your projects
            and working groups
          </li>
          <li>
            <i>Keep informed and updated</i> with what's happening all around
            the GP2 program
          </li>
        </ul>
        <Divider />
        <Paragraph hasMargin={false}>
          Before you begin exploring, please take a small amount of time to fill
          in your profile so that others have a good idea about who you are and
          what to do.
        </Paragraph>
      </CardWithCornerBackground>

      <Caption accent="lead">
        <b>Please note,</b> all information provided can only be viewed by other
        GP2 members that have also registered.
      </Caption>
      <footer css={footerStyles}>
        <Button primary>Get Started</Button>
        <Link buttonStyle href={logout({}).$}>
          Sign Out
        </Link>
      </footer>
    </div>
  </BasicLayout>
);

export default OnboardWelcome;
