import { css } from '@emotion/react';

import {
  Display,
  Paragraph,
  pixels,
  paper,
  steel,
  contentSidePaddingWithNavigation,
} from '@asap-hub/react-components';

const { perRem } = pixels;

const containerStyles = css({
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
  marginBottom: '2px',
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} ${
    48 / perRem
  }em `,
});

const textStyles = css({
  maxWidth: `${610 / perRem}em`,
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
      <Paragraph accent="lead">
        The Global Parkinson’s Genetics Program (GP2) is an ambitious program to
        genotype &gt 150,000 volunteers around the world to further understand
        the genetic architecture of Parkinson’s disease (PD). There is still
        much to learn about genetic risk factors and the path to further
        understanding requires working collaboratively and openly sharing data,
        processes, and results.
      </Paragraph>
    </div>
  </header>
);

export default DashboardPageHeader;
