import { render } from '@testing-library/react';

import ExportTooltip from '../ExportTooltip';

describe('ExportTooltip', () => {
  it('renders bold labels with the provided descriptions', () => {
    const { getByText } = render(
      <ExportTooltip
        dataInTable="See the table data."
        fullDataset="See everything."
      />,
    );

    const dataInTableLabel = getByText('Data in Table:');
    expect(dataInTableLabel.tagName).toBe('STRONG');
    expect(dataInTableLabel.parentElement).toHaveTextContent(
      'Data in Table: See the table data.',
    );

    const fullDatasetLabel = getByText('Full Dataset:');
    expect(fullDatasetLabel.tagName).toBe('STRONG');
    expect(fullDatasetLabel.parentElement).toHaveTextContent(
      'Full Dataset: See everything.',
    );
  });
});
