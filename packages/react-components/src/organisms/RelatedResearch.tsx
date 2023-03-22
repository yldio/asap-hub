import {
  ResearchOutputDocumentType,
  ResearchOutputResponse,
} from '@asap-hub/model';
import { sharedResearch, network } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { useState } from 'react';

import { Button, Card, Headline2, Link, Paragraph, Pill } from '../atoms';
import { perRem, tabletScreen } from '../pixels';
import { charcoal, lead, steel } from '../colors';
import {
  protocol,
  article,
  dataset,
  bioinformatics,
  labResource,
  grantDocument,
} from '../icons';

const icons: Record<ResearchOutputDocumentType, EmotionJSX.Element> = {
  Protocol: protocol,
  Article: article,
  Dataset: dataset,
  Bioinformatics: bioinformatics,
  'Lab Resource': labResource,
  'Grant Document': grantDocument,
  Presentation: protocol,
  Report: protocol,
};

export const getIconForDocumentType = (
  documentType: ResearchOutputDocumentType,
): EmotionJSX.Element => icons[documentType];

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
    gridTemplateColumns: '1fr 1.2fr 0.8fr',
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

type RecentSharedOutputProp = {
  relatedResearch: Pick<
    ResearchOutputResponse,
    'documentType' | 'type' | 'title' | 'teams' | 'id'
  >[];
};

const RelatedResearch: React.FC<RecentSharedOutputProp> = ({
  relatedResearch,
}) => {
  const truncateFrom = 5;
  const [showMore, setShowMore] = useState(false);
  const displayShowMoreButton = relatedResearch.length > 5;

  return (
    <Card padding={false}>
      <div
        css={[
          container,
          ...(displayShowMoreButton ? [{ paddingBottom: 0 }] : []),
        ]}
      >
        <Headline2 noMargin>Related Research</Headline2>
        <div css={descriptionStyles}>
          <Paragraph noMargin>
            Find out all shared research outputs that contributed to this one.
          </Paragraph>
        </div>
        <div css={[rowStyles, gridTitleStyles]}>
          <span css={titleStyles}>Document Type</span>
          <span css={titleStyles}>Shared Output Name</span>
          <span css={titleStyles}>Team</span>
        </div>
        {relatedResearch
          .slice(0, showMore ? undefined : truncateFrom)
          .map(({ id, documentType, teams, title, type }) => (
            <div key={id} css={[rowStyles]}>
              <span css={[titleStyles, rowTitleStyles]}>Document Type</span>
              <p css={paragraphStyle}>
                {getIconForDocumentType(documentType)} {documentType}{' '}
                {documentType === 'Article' && (
                  <Pill accent="gray">{type}</Pill>
                )}
              </p>
              <span css={[titleStyles, rowTitleStyles]}>Title</span>
              <p css={paragraphStyle}>
                <Link
                  ellipsed
                  href={
                    sharedResearch({}).researchOutput({
                      researchOutputId: id,
                    }).$
                  }
                >
                  {title}
                </Link>
              </p>
              <span css={[titleStyles, rowTitleStyles]}>Team</span>

              {teams.length > 1 ? (
                <p css={paragraphStyle}>Multiple teams</p>
              ) : (
                teams[0] && (
                  <p css={paragraphStyle}>
                    <Link
                      ellipsed
                      href={
                        network({}).teams({}).team({
                          teamId: teams[0].id,
                        }).$
                      }
                    >
                      {teams[0].displayName}
                    </Link>
                  </p>
                )
              )}
            </div>
          ))}
      </div>
      {displayShowMoreButton && (
        <div css={showMoreStyles}>
          <Button linkStyle onClick={() => setShowMore(!showMore)}>
            View {showMore ? 'Less' : 'More'} Outputs
          </Button>
        </div>
      )}
    </Card>
  );
};

export default RelatedResearch;
