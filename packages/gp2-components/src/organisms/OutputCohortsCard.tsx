import { gp2 } from '@asap-hub/model';
import { css } from '@emotion/react';
import React from 'react';

import {
  ExternalLink,
  Card,
  Headline2,
  Paragraph,
  pixels,
  colors,
} from '@asap-hub/react-components';

const { perRem, tabletScreen } = pixels;
const { charcoal, lead } = colors;

const container = css({
  display: 'grid',
  padding: `${32 / perRem}em ${24 / perRem}em`,
});

const descriptionStyles = css({
  marginTop: `${24 / perRem}em`,
  marginBottom: `${12 / perRem}em`,
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    marginBottom: `${32 / perRem}em`,
  },
});

const gridTitleStyles = css({
  display: 'none',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'inherit',
    paddingBottom: `${16 / perRem}em`,
  },
});

const rowTitleStyles = css({
  paddingTop: `${16 / perRem}em`,
  paddingBottom: `${16 / perRem}em`,
  ':first-of-type': { paddingTop: 0 },
  [`@media (min-width: ${tabletScreen.min}px)`]: { display: 'none' },
});

const gridStyles = css({
  display: 'grid',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: 'auto max-content',
    columnGap: `${15 / perRem}em`,
    rowGap: `${16 / perRem}em`,
  },
});

const paragraphStyle = css({
  marginTop: 0,
  marginBottom: 0,
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  gap: `${6 / perRem}em`,
  color: lead.rgb,
});

const titleStyles = css({ fontWeight: 'bold', color: charcoal.rgb });

type OutputCohortsCardProps = Pick<
  gp2.OutputBaseResponse,
  'contributingCohorts'
>;

const OutputCohortsCard: React.FC<OutputCohortsCardProps> = ({
  contributingCohorts,
}) => (
  <Card padding={false}>
    <div css={[container]}>
      <Headline2 noMargin>Contributing Cohort Studies</Headline2>
      <div css={descriptionStyles}>
        <Paragraph noMargin accent="lead">
          Find out all cohort studies that contributed to this output.
        </Paragraph>
      </div>
      {contributingCohorts.length === 0 ? (
        <Paragraph noMargin accent="lead">
          <b>No contributing cohorts available.</b>
        </Paragraph>
      ) : (
        <div css={gridStyles}>
          <span css={[titleStyles, gridTitleStyles]}>Name</span>
          <span css={[titleStyles, gridTitleStyles]}>Link</span>
          {contributingCohorts
            .slice(0, 3)
            .map(({ id, name, studyLink }, index) => (
              <React.Fragment key={`${index}-${id}`}>
                <span css={[titleStyles, rowTitleStyles]}>Name</span>
                <p css={paragraphStyle}>
                  <span>{name}</span>
                </p>
                <span css={[titleStyles, rowTitleStyles]}>Link</span>
                <span css={[paragraphStyle]}>
                  {studyLink ? (
                    <ExternalLink href={studyLink} label="Visit Study" />
                  ) : (
                    'No Link available'
                  )}
                </span>
              </React.Fragment>
            ))}
        </div>
      )}
    </div>
  </Card>
);

export default OutputCohortsCard;
