import { ResearchOutputResponse } from '@asap-hub/model';
import { sharedResearch } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';

import { Card, Link } from '../atoms';
import { formatDateToTimezone } from '../date';
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

export const getIconForDocumentType = (
  documentType: string,
): EmotionJSX.Element => {
  switch (documentType) {
    case 'Protocol':
      return protocol;
    case 'Article':
      return article;
    case 'Dataset':
      return dataset;
    case 'Bioinformatics':
      return bioinformatics;
    case 'Lab Resource':
      return labResource;
    case 'Grant Document':
      return grantDocument;
    default:
      return protocol;
  }
};

const container = css({
  display: 'grid',
  color: lead.rgb,
});

const gridTitleStyles = css({
  display: 'none',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    display: 'inherit',
    borderBottom: 0,
    marginBottom: 0,
    paddingBottom: `${15 / perRem}em`,
  },
});

const rowTitleStyles = css({
  paddingTop: `${33 / perRem}em`,
  paddingBottom: `${15 / perRem}em`,
  ':first-of-type': { paddingTop: 0 },
  [`@media (min-width: ${tabletScreen.min}px)`]: { display: 'none' },
});

const rowStyles = css({
  display: 'grid',
  borderBottom: `1px solid ${steel.rgb}`,
  paddingBottom: `${21 / perRem}em`,
  marginBottom: `${21 / perRem}em`,
  ':last-child': {
    borderBottom: 'none',
    marginBottom: 0,
    paddingBottom: 0,
  },
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridTemplateColumns: '3fr 2fr 2fr',
    columnGap: `${15 / perRem}em`,
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

type RecentSharedOutputProp = {
  outputs?: ResearchOutputResponse[];
};

const RecentSharedOutputs: React.FC<RecentSharedOutputProp> = ({ outputs }) => (
  <Card>
    <div css={container}>
      <div css={[rowStyles, gridTitleStyles]}>
        <span css={titleStyles}>Shared Output</span>
        <span css={titleStyles}>Type of Output</span>
        <span css={titleStyles}>Date</span>
      </div>
      {outputs &&
        outputs.map(({ id, documentType, addedDate, title }) => (
          <div key={id} css={[rowStyles]}>
            <span css={[titleStyles, rowTitleStyles]}>Event</span>
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
            <span css={[titleStyles, rowTitleStyles]}>Meeting Materials</span>
            <p css={paragraphStyle}>
              {getIconForDocumentType(documentType)} {documentType}
            </p>
            <span css={[titleStyles, rowTitleStyles]}>Date</span>
            <span>
              {formatDateToTimezone(addedDate, 'E, d MMM y').toUpperCase()}
            </span>
          </div>
        ))}
    </div>
  </Card>
);

export default RecentSharedOutputs;
