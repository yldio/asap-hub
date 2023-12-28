import { ResearchOutputVersion } from '@asap-hub/model';
import { css, SerializedStyles, Theme } from '@emotion/react';
import { useState } from 'react';

import { Button, Card, Headline2, Link, Paragraph, Pill } from '../atoms';
import { perRem, tabletScreen } from '../pixels';
import {
  charcoal,
  fern,
  lead,
  neutral200,
  paper,
  pine,
  steel,
} from '../colors';
import { formatDateToTimezone } from '../date';
import { externalLinkIcon } from '../icons';
import { contentSidePaddingWithNavigation } from '../layout';
import { mailToSupport, TECH_SUPPORT_EMAIL } from '../mail';
import { defaultThemeVariant, ThemeVariant } from '../theme';

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

const gridTitleStyles = css({
  display: 'none',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'inherit',
    paddingBottom: `${16 / perRem}em`,
  },
});

const rowTitleStyles = css({
  paddingTop: `${32 / perRem}em`,
  paddingBottom: `${16 / perRem}em`,
  ':first-of-type': { paddingTop: 0 },
  [`@media (min-width: ${tabletScreen.min}px)`]: { display: 'none' },
});

const rowStyles = css({
  display: 'grid',
  paddingTop: `${20 / perRem}em`,
  paddingBottom: `${20 / perRem}em`,
  borderBottom: `1px solid ${steel.rgb}`,
  ':last-child': {
    borderBottom: 'none',
    marginBottom: 0,
    paddingBottom: 0,
  },
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: '0.2fr 0.5fr 1fr 1fr 1fr',
    columnGap: `${15 / perRem}em`,
    paddingTop: `${0 / perRem}em`,
    paddingBottom: `${16 / perRem}em`,
    borderBottom: 'none',
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

const showMoreStyles = css({
  display: 'flex',
  justifyContent: 'center',
  marginTop: `${32 / perRem}em`,
  paddingTop: `${16 / perRem}em`,
  paddingBottom: `${16 / perRem}em`,
  borderTop: `1px solid ${steel.rgb}`,
});

const titleStyles = css({ fontWeight: 'bold', color: charcoal.rgb });

export const themeStyles: Record<ThemeVariant, SerializedStyles> = {
  light: css({
    stroke: fern.rgb,
  }),
  grey: css({ stroke: fern.rgb, ':active': { stroke: pine.rgb } }),
  dark: css({ stroke: paper.rgb, ':active': { stroke: paper.rgb } }),
};

const getSvgColors = (
  colors: Theme['colors'],
  themeVariant: ThemeVariant,
): SerializedStyles =>
  colors?.primary500
    ? css({ stroke: colors.primary500.rgba })
    : themeStyles[themeVariant];

const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} 0`,
  display: 'grid',
  justifyContent: 'center',
});

const createVersionWrapperStyles = css({
  maxWidth: `${800 / perRem}em`,
});

const createVersionCardStyles = css({
  background: neutral200.rgb,
});

type Version = Omit<ResearchOutputVersion, 'documentType' | 'type'> & {
  documentType?: string;
  type?: string;
};

export type OutputVersionsProps = {
  readonly themeVariant?: ThemeVariant;
  versions: Version[];
  versionAction?: 'create' | 'edit';
  app?: 'crn' | 'gp2';
};

const OutputVersions: React.FC<OutputVersionsProps> = ({
  themeVariant = defaultThemeVariant,
  versions,
  versionAction,
  app,
}) => {
  const truncateFrom = 5;
  const [showMore, setShowMore] = useState(false);
  const displayShowMoreButton = versions.length > 5;

  const iconsStyles = ({ colors }: Theme) =>
    css({
      position: 'relative',
      top: '6px',
      display: 'inline-flex',
      alignSelf: 'center',
      svg: getSvgColors(colors, themeVariant),
    });

  return (
    <main css={versionAction && app === 'crn' ? [mainStyles] : []}>
      <div css={versionAction ? [createVersionWrapperStyles] : []}>
        <Card
          padding={false}
          overrideStyles={versionAction ? createVersionCardStyles : undefined}
        >
          <div
            css={[
              container,
              ...(displayShowMoreButton ? [{ paddingBottom: 0 }] : []),
            ]}
          >
            <Headline2 noMargin>Version History</Headline2>
            <div css={descriptionStyles}>
              {versionAction ? (
                <Paragraph noMargin>
                  List with all previous output versions that contributed to
                  this one. In case you want to add or edit older versions,
                  please contact{' '}
                  <Link href={mailToSupport()}> {TECH_SUPPORT_EMAIL}</Link>.
                </Paragraph>
              ) : (
                <Paragraph noMargin>
                  Find all previous output versions that contributed to this
                  one.
                </Paragraph>
              )}
            </div>
            <div css={[rowStyles, gridTitleStyles]}>
              <span css={titleStyles}>Ver.</span>
              <span css={titleStyles}>Type</span>
              <span css={titleStyles}>Shared Output Name</span>
              <span css={titleStyles}>Date Posted</span>
              <span css={titleStyles}>Link</span>
            </div>
            {versions
              .slice(0, showMore ? undefined : truncateFrom)
              .map(
                ({ id, documentType, title, type, addedDate, link }, index) => (
                  <div key={id} css={[rowStyles]}>
                    <span css={[titleStyles, rowTitleStyles]}>Ver.</span>
                    <p css={paragraphStyle}>#{index + 1}</p>
                    <span css={[titleStyles, rowTitleStyles]}>Type</span>
                    <p css={paragraphStyle}>
                      {documentType === 'Report' ? (
                        <Pill accent="gray">Report</Pill>
                      ) : (
                        type && <Pill accent="gray">{type}</Pill>
                      )}
                    </p>
                    <span css={[titleStyles, rowTitleStyles]}>
                      Shared Output Name
                    </span>
                    <p css={paragraphStyle}>{title}</p>
                    <span css={[titleStyles, rowTitleStyles]}>Date Posted</span>
                    <p css={paragraphStyle}>
                      {addedDate &&
                        formatDateToTimezone(
                          addedDate,
                          'EEE, dd MMM yyyy',
                        ).toUpperCase()}
                    </p>
                    <span css={[titleStyles, rowTitleStyles]}>Link</span>
                    <p css={paragraphStyle}>
                      <Link ellipsed href={link}>
                        Output{' '}
                        <span css={(theme) => iconsStyles(theme)}>
                          {externalLinkIcon}
                        </span>
                      </Link>
                    </p>
                  </div>
                ),
              )}
          </div>
          {displayShowMoreButton && (
            <div css={showMoreStyles}>
              <Button linkStyle onClick={() => setShowMore(!showMore)}>
                View {showMore ? 'Less' : 'More'} Versions
              </Button>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
};

export default OutputVersions;
