import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import CollapsibleTable from '../CollapsibleTable';

describe('CollapsibleTable', () => {
  type TableDisplayProps = ComponentProps<typeof CollapsibleTable>;
  const renderTableDisplay = ({
    children = [
      {
        id: '42',
        values: ['a value'],
      },
    ],
    ...overrides
  }: Partial<TableDisplayProps>) => {
    const props: Omit<TableDisplayProps, 'children'> = {
      paragraph: 'a paragraph',
      headings: ['a heading'],
    };
    render(
      <CollapsibleTable {...props} {...overrides}>
        {children}
      </CollapsibleTable>,
    );
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
    renderTableDisplay({ children: [{ id: '42', values: [value] }] });
    expect(screen.getByText(value)).toBeVisible();
  });
  it('multiple rows', () => {
    const firstValue = 'first row to display';
    const secondValue = 'second row to display';
    renderTableDisplay({
      children: [
        { id: '42', values: [firstValue] },
        { id: '11', values: [secondValue] },
      ],
    });
    expect(screen.getByText(firstValue)).toBeVisible();
    expect(screen.getByText(secondValue)).toBeVisible();
  });
  it.todo('multiple columns');
  it.todo('optional field');
  it.todo('pass in a component');
  it.todo('show more');
});
