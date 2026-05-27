import { ReactNode } from 'react';

type ExportTooltipProps = {
  /** Description shown next to the bold "Data in Table:" label. */
  readonly dataInTable: ReactNode;
  /** Description shown next to the bold "Full Dataset:" label. */
  readonly fullDataset: ReactNode;
};

/**
 * Shared tooltip body for export controls that offer both a "Data in Table"
 * and a "Full Dataset" download. Renders bold labels separated by a blank
 * line so the two options read clearly inside a TooltipInfo / ExportButton.
 */
const ExportTooltip: React.FC<ExportTooltipProps> = ({
  dataInTable,
  fullDataset,
}) => (
  <>
    <strong>Data in Table:</strong> {dataInTable}
    <br />
    <br />
    <strong>Full Dataset:</strong> {fullDataset}
  </>
);

export default ExportTooltip;
