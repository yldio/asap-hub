import { researchOutputLabels, ResearchOutputResponse } from '@asap-hub/model';
import { css } from '@emotion/react';

import { perRem } from '../pixels';
import { TagLabel } from '../atoms';
import { ExternalLink } from '../molecules';

const styles = css({
  flex: 1,

  display: 'flex',
  justifyContent: 'space-between',
  columnGap: `${12 / perRem}em`,
  maxWidth: '100%',
  overflow: 'hidden',
});

const ROW_GAP_OFFSET = 12;

const typeListStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  columnGap: `${12 / perRem}em`,
  maxWidth: '100%',
  overflow: 'hidden',

  listStyle: 'none',
  margin: 0,
  marginTop: `${ROW_GAP_OFFSET / perRem}em`,
  padding: 0,

  textTransform: 'capitalize',
});

const typeStyles = css({
  maxWidth: '100%',
  overflow: 'hidden',

  marginTop: `-${ROW_GAP_OFFSET / perRem}em`,
});

type SharedResearchMetadataProps = Pick<
  ResearchOutputResponse,
  'type' | 'subTypes' | 'link'
>;
const SharedResearchMetadata: React.FC<SharedResearchMetadataProps> = ({
  type,
  subTypes,
  link,
}) => (
  <div css={styles}>
    <ul css={typeListStyles}>
      <li css={typeStyles}>
        <TagLabel>{type}</TagLabel>
      </li>
      {subTypes.map((subType, i) => (
        <li css={typeStyles} key={`subtype-${i}`}>
          <TagLabel>{subType}</TagLabel>
        </li>
      ))}
    </ul>
    {link ? (
      <ExternalLink label={researchOutputLabels[type]} href={link} />
    ) : null}
  </div>
);

export default SharedResearchMetadata;
