import { researchOutputLabels, ResearchOutputResponse } from '@asap-hub/model';
import { css } from '@emotion/react';

import { perRem } from '../pixels';
import { ExternalLink, PillList } from '../molecules';

const styles = css({
  flex: 1,

  display: 'flex',
  justifyContent: 'space-between',
  columnGap: `${12 / perRem}em`,
  maxWidth: '100%',
  overflow: 'hidden',
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
    <PillList pills={[type, ...subTypes]} />
    {link ? (
      <ExternalLink label={researchOutputLabels[type]} href={link} />
    ) : null}
  </div>
);

export default SharedResearchMetadata;
