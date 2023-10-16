import { css } from '@emotion/react';

import { rem } from '../pixels';
import { ExternalLink, PillList } from '../molecules';

const styles = css({
  flex: 1,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  columnGap: rem(12),
});

type SharedResearchMetadataProps = {
  pills: string[];
  link?: string;
  small?: boolean;
};

const SharedResearchMetadata: React.FC<SharedResearchMetadataProps> = ({
  pills,
  link,
  small = true,
}) => (
  <div css={styles}>
    <div css={css({ padding: `${rem(4)} 0` })}>
      <PillList small={small} pills={pills} />
    </div>
    {link ? <ExternalLink href={link} label="Access Output" /> : null}
  </div>
);

export default SharedResearchMetadata;
