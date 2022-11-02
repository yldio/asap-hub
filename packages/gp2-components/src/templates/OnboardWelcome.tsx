import {
  Button,
  Caption,
  Card,
  Divider,
  pixels,
  informationInfo500,
  Headline2,
  Subtitle,
  Paragraph,
  Link,
} from '@asap-hub/react-components';
import { logout } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { projectsImage } from '../images';
import BasicLayout from './BasicLayout';

const { rem } = pixels;

const imageContainerStyle = css({
  borderRadius: rem(8),
  objectFit: 'cover',
  height: '242px',
  width: '696px',
  // backgroundSize: 'cover',
  // border: `1px solid ${colors.neutral500.rgb}`,
  // filter: `drop-shadow(0px 2px 4px ${colors.neutral500.rgb})`,
});

const OnboardWelcome: React.FC<Record<string, never>> = () => (
  <BasicLayout>
    <div
      css={css({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'left',
      })}
    >
      <header>
        <Headline2 noMargin>Welcome to the GP2 Hub</Headline2>
        <Subtitle accent="lead" hasMargin>
          The closed private network for the Global Parkinson's Genetics
          Program.
        </Subtitle>
      </header>

      <div
        css={css({
          position: 'relative',
          width: '748px',
          height: '374px',
          paddingTop: '32px',
        })}
      >
        <div
          css={css({
            position: 'absolute',
            left: '52px',
            top: '52px',
          })}
        >
          <img alt={''} css={imageContainerStyle} src={projectsImage} />
        </div>
        <div
          css={css({
            position: 'absolute',
            right: '26px',
            width: '720px',
            height: '263px',
          })}
        >
          <Card>
            As one of the program's valuable members, you have been invited to
            this network to:
            <ul>
              <li>
                <i>Learn and connect</i> with like minded members
              </li>
              <li>
                <i>Track and manage group activities</i> within both your
                projects and working groups
              </li>
              <li>
                <i>Keep informed and updated</i> with what's happening all
                around the GP2 program
              </li>
            </ul>
            <Divider />
            <Paragraph hasMargin={false}>
              Before you begin exploring, please take a small amount of time to
              fill in your profile so that others have a good idea about who you
              are and what to do.
            </Paragraph>
          </Card>
        </div>
      </div>
      <Caption accent="lead">
        <b>Please note,</b> all information provided can only be viewed by other
        GP2 members that have also registered.
      </Caption>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div
          css={css({
            maxWidth: 'fit-content',
            blockSize: 'fit-content',
          })}
        >
          <Link
            buttonStyle
            href={logout({}).$}
            // overrideStyles={css({
            //   maxWidth: 'fit-content',
            //   blockSize: 'fit-content',
            // })}
          >
            Sign Out
          </Link>
        </div>
        <Button
          primary
          overrideStyles={css({
            background: informationInfo500.rgb,
            maxWidth: 'fit-content',
            blockSize: 'fit-content',
          })}
        >
          Get Started
        </Button>
      </div>
    </div>
  </BasicLayout>
);

export default OnboardWelcome;
