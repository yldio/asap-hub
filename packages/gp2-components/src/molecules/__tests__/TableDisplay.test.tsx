import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import TableDisplay from '../TableDisplay';

describe('TableDisplay', () => {
  type TableDisplayProps = ComponentProps<typeof TableDisplay>;
  const renderTableDisplay = (overrides: Partial<TableDisplayProps>) => {
    const props: TableDisplayProps = {
      paragraph: 'a paragraph',
      headings: ['a heading'],
      rows: [
        {
          id: '42',
          values: ['a value'],
        },
      ],
    };
    render(<TableDisplay {...props} {...overrides} />);
  };
  it('displays the paragraph', () => {
    const paragraph = 'some paragraph to display';
    renderTableDisplay({ paragraph });
    expect(screen.getByText(paragraph)).toBeVisible();
  });
  it('displays the headings', () => {
    const heading = 'some heading to display';
    renderTableDisplay({ headings: [heading] });
    expect(screen.getByRole('heading', { name: `${heading}:` })).toBeVisible();
  });
  it('displays the row', () => {
    const value = 'some row to display';
    renderTableDisplay({ rows: [{ id: '42', values: [value] }] });
    expect(screen.getByText(value)).toBeVisible();
  });
  it.todo('multiple rows');
  it.todo('multiple columns');
  it.todo('optional field');
  it.todo('pass in a component');
  it.todo('show more');
});
