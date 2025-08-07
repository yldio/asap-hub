import { ManuscriptVersionResponse } from '@asap-hub/model';
import { css, SerializedStyles } from '@emotion/react';

import { Card, Headline2, Paragraph, Pill } from '../atoms';
import { mobileScreen, rem, tabletScreen } from '../pixels';
import { fern, lead, neutral200, paper, pine } from '../colors';
import { ThemeVariant } from '../theme';
import { contentSidePaddingWithNavigation } from '../layout';

const container = css({
  display: 'grid',
  padding: `${rem(32)} ${rem(24)}`,
});

const descriptionStyles = css({
  marginTop: rem(24),
  marginBottom: rem(12),
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    marginBottom: rem(32),
  },
  color: lead.rgb,
});

const pillContainerStyles = css({
  display: 'flex',
  gap: rem(8),
  marginTop: rem(8),
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    flexDirection: 'column',
  },
});

export const themeStyles: Record<ThemeVariant, SerializedStyles> = {
  light: css({
    stroke: fern.rgb,
  }),
  grey: css({ stroke: fern.rgb, ':active': { stroke: pine.rgb } }),
  dark: css({ stroke: paper.rgb, ':active': { stroke: paper.rgb } }),
};
const mainStyles = css({
  padding: `${rem(36)} ${contentSidePaddingWithNavigation(8)} 0`,
  display: 'grid',
  justifyContent: 'center',
});

const wrapperStyles = css({
  maxWidth: rem(800),
});

const cardStyles = css({
  background: neutral200.rgb,
});

export type ManuscriptVersionImportCardProps = {
  version: ManuscriptVersionResponse;
};

const ManuscriptVersionImportCard: React.FC<
  ManuscriptVersionImportCardProps
> = ({ version }) => (
  <div css={mainStyles}>
    <div css={wrapperStyles}>
      <Card padding={false} overrideStyles={cardStyles}>
        <div css={container}>
          <Headline2 noMargin>Imported Manuscript Version</Headline2>
          <div css={descriptionStyles}>
            <Paragraph noMargin>
              The details in the form below have been imported from the
              manuscript below, which was previously sent for an open science
              compliance review through the Hub's Open Science Compliance
              Submission System.
            </Paragraph>
          </div>
          <div css={pillContainerStyles}>
            <Pill accent="gray">{version.type}</Pill>
            <Pill accent="gray">{version.lifecycle}</Pill>
            <Pill accent="blue">{version.manuscriptId}</Pill>
          </div>
          <span>{version.title}</span>
        </div>
      </Card>
    </div>
  </div>
);

export default ManuscriptVersionImportCard;
