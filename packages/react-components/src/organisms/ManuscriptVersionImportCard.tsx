import { ManuscriptVersionResponse } from '@asap-hub/model';
import { css, SerializedStyles } from '@emotion/react';

import { Card, Headline2, Paragraph, Pill } from '../atoms';
import { mobileScreen, perRem, rem, tabletScreen } from '../pixels';
import { fern, lead, paper, pine } from '../colors';
import { ThemeVariant } from '../theme';

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
  color: lead.rgb,
});

// const paragraphStyle = css({
//   marginTop: 0,
//   marginBottom: 0,
//   display: 'flex',
//   alignItems: 'center',
//   flexDirection: 'row',
//   gap: `${6 / perRem}em`,
//   color: lead.rgb,
// });

// const titleStyles = css({ fontWeight: 'bold', color: charcoal.rgb });

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

// const mainStyles = css({
//   padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} 0`,
//   display: 'grid',
//   justifyContent: 'center',
// });

// const createVersionWrapperStyles = css({
//   maxWidth: `${800 / perRem}em`,
// });

// const createVersionCardStyles = css({
//   background: neutral200.rgb,
// });

// type Version = Omit<ResearchOutputVersion, 'documentType' | 'type'> & {
//   documentType?: string;
//   type?: string;
// };

export type ManuscriptVersionImportCardProps = {
  version: ManuscriptVersionResponse;
};

const ManuscriptVersionImportCard: React.FC<
  ManuscriptVersionImportCardProps
> = ({ version }) => (
  <Card padding={false}>
    <div css={container}>
      <Headline2 noMargin>Imported Manuscript Version</Headline2>
      <div css={descriptionStyles}>
        <Paragraph noMargin>
          The details in the form below have been imported from the manuscript
          below, which was previously sent for an open science compliance review
          through the Hub's Open Science Compliance Submission System.
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
);

export default ManuscriptVersionImportCard;
