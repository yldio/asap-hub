import { css } from '@emotion/react';

import { perRem } from '../pixels';
import { ExternalLink, PillList } from '../molecules';

const styles = css({
  flex: 1,
  display: 'flex',
  justifyContent: 'space-between',
  columnGap: `${12 / perRem}em`,
});

type SharedResearchMetadataProps = {
  pills: string[];
  link?: string;
};

const SharedResearchMetadata: React.FC<SharedResearchMetadataProps> = ({
  pills,
  link,
}) => (
  <div css={styles}>
    <PillList pills={pills} />
    {link ? <ExternalLink noMargin href={link} label="Access Output" /> : null}
  </div>
);

export default SharedResearchMetadata;
