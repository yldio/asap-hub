import {
  Display,
  lead,
  paper,
  Paragraph,
  pixels,
  steel,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';

const { rem } = pixels;

const containerStyles = css({
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
  marginBottom: '2px',
  paddingBottom: `${rem(48)}`,
});

const textStyles = css({
  maxWidth: rem(610),
  color: lead.rgb,
});

type DashboardPageHeaderProps = {
  readonly firstName?: string;
};

const DashboardPageHeader: React.FC<DashboardPageHeaderProps> = ({
  firstName,
}) => (
  <header css={containerStyles}>
    <Display styleAsHeading={2}>{`Welcome to the GP2 Hub${
      firstName ? `, ${firstName}` : ''
    }!`}</Display>
    <div css={textStyles}>
      <Paragraph>
        The is a network for the Global Parkinson’s Genetics Program.
      </Paragraph>
      <Paragraph>
        As one of the program’s valuable members, you have been invited to this
        network to:
      </Paragraph>
      <ul>
        <li>
          <i>Learn and connect</i> with like minded members
        </li>
        <li>
          <i>Track and manage</i> group activities within both your projects and
          working groups
        </li>
      </ul>
      <Paragraph>
        <i>Keep informed and updated</i> with what’s happening all around the
        GP2 program.
      </Paragraph>
    </div>
  </header>
);

export default DashboardPageHeader;
