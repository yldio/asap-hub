import { css } from '@emotion/react';
import { ReactNode } from 'react';

import { rem } from '../pixels';

type ExportTooltipProps = {
  /** Description shown next to the bold "Data in Table:" label. */
  readonly dataInTable: ReactNode;
  /** Description shown next to the bold "Full Dataset:" label. */
  readonly fullDataset: ReactNode;
};

const paragraphStyles = css({
  display: 'block',
  margin: 0,
  lineHeight: rem(32),
  textAlign: 'left',
});

const groupStyles = css({
  display: 'grid',
  gap: rem(24),
});

/**
 * Shared tooltip body for export controls that offer both a "Data in Table"
 * and a "Full Dataset" download.
 */
const ExportTooltip: React.FC<ExportTooltipProps> = ({
  dataInTable,
  fullDataset,
}) => (
  <span css={groupStyles}>
    <span css={paragraphStyles}>
      <strong>Data in Table:</strong> {dataInTable}
    </span>
    <span css={paragraphStyles}>
      <strong>Full Dataset:</strong> {fullDataset}
    </span>
  </span>
);

export default ExportTooltip;
