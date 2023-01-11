import { ResearchOutputResponse } from '@asap-hub/model';
import { css } from '@emotion/react';

import { perRem } from '../pixels';
import { ExternalLink, PillList } from '../molecules';

const styles = css({
  flex: 1,

  display: 'flex',
  justifyContent: 'space-between',
  columnGap: `${12 / perRem}em`,
});

type SharedResearchMetadataProps = Pick<
  ResearchOutputResponse,
  'documentType' | 'type' | 'link' | 'publishingEntity'
>;

const SharedResearchMetadata: React.FC<SharedResearchMetadataProps> = ({
  documentType,
  type,
  link,
  publishingEntity,
}) => {
  const pills: string[] = [
    ...(publishingEntity === 'Working Group' ? [publishingEntity] : []),
    ...(type ? [type] : []),
    ...(documentType ? [documentType] : []),
  ];

  return (
    <div css={styles}>
      <PillList pills={pills} />
      {link ? <ExternalLink href={link} label="Open External Link" /> : null}
    </div>
  );
};

export default SharedResearchMetadata;
