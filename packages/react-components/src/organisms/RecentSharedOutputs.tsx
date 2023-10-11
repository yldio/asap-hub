import { gp2, ResearchOutputResponse } from '@asap-hub/model';
import { sharedResearch } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';

import { Card, Link } from '../atoms';
import { formatDateToTimezone } from '../date';
import { perRem, tabletScreen } from '../pixels';
import { charcoal, lead, steel } from '../colors';
import { getIconForDocumentType as getIconForDocumentTypeCRN } from '../utils';
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

const getSharedOutputHrefCRN = (id: string) =>
  sharedResearch({}).researchOutput({
    researchOutputId: id,
  }).$;

type RecentSharedOutputProp = {
  outputs?: ResearchOutputResponse[] | gp2.OutputBaseResponse[];
  getIconForDocumentType?: (documentType: string) => EmotionJSX.Element;
  getSharedOutputHref?: (id: string) => string;
  tableTitles?: [string, string, string]; // ensuring it has exactly 3 elements
};

const RecentSharedOutputs: React.FC<RecentSharedOutputProp> = ({
  outputs,
  getIconForDocumentType = getIconForDocumentTypeCRN,
  getSharedOutputHref = getSharedOutputHrefCRN,
  tableTitles = ['Shared Output', 'Type of Output', 'Date Added'],
}) => (
  <Card>
    <div css={container}>
      <div css={[rowStyles, gridTitleStyles]}>
        {tableTitles.map((title) => (
          <span key={title} css={titleStyles}>
            {title}
          </span>
        ))}
      </div>
      {outputs &&
        outputs.map(({ id, documentType, addedDate, title, created }) => (
          <div key={id} css={[rowStyles]}>
            <span css={[titleStyles, rowTitleStyles]}>{tableTitles[0]}</span>
            <Link ellipsed href={getSharedOutputHref(id)}>
              {title}
            </Link>
            <span css={[titleStyles, rowTitleStyles]}>{tableTitles[1]}</span>
            <p css={paragraphStyle}>
              {getIconForDocumentType(documentType)} {documentType}
            </p>
            <span css={[titleStyles, rowTitleStyles]}>{tableTitles[2]}</span>
            <span>
              {formatDateToTimezone(
                addedDate || created,
                'E, d MMM y',
              ).toUpperCase()}
            </span>
          </div>
        ))}
    </div>
  </Card>
);

export default RecentSharedOutputs;
