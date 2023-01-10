import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  it('displays the headings', () => {
    const heading = 'some heading to display';
    renderTableDisplay({ headings: [heading] });
    expect(screen.getByRole('heading', { name: `${heading}:` })).toBeVisible();
  });
  it('displays multiple headings', () => {
    const firstHeading = 'first heading to display';
    const secondHeading = 'second heading to display';
    renderTableDisplay({
      headings: [firstHeading, secondHeading],
      children: [{ id: '42', values: ['1', '2'] }],
    });
    expect(
      screen.getByRole('heading', { name: `${firstHeading}:` }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: `${secondHeading}:` }),
    ).toBeVisible();
  });
  it('multiple columns in a row', () => {
    const firstValue = 'first value in a row to display';
    const secondValue = 'second value in a row to display';
    renderTableDisplay({
      children: [{ id: '42', values: [firstValue, secondValue] }],
    });
    expect(screen.getByText(firstValue)).toBeVisible();
    expect(screen.getByText(secondValue)).toBeVisible();
  });
  it('does not display the optional field', () => {
    const heading = 'first heading to display';
    renderTableDisplay({
      headings: [heading],

      children: [{ id: '42', values: [] }],
    });
    expect(
      screen.queryByRole('heading', { name: `${heading}:` }),
    ).not.toBeInTheDocument();
  });
  it('pass in a component', () => {
    const value = 'some row to display';
    renderTableDisplay({
      children: [{ id: '42', values: [<div>{value}</div>] }],
    });
    expect(screen.getByText(value)).toBeVisible();
  });
  describe('show more', () => {
    type Row = TableDisplayProps['children'][number];
    const getRows = (length = 1): Row[] =>
      Array.from(
        { length },
        (_, itemIndex): Row => ({
          id: `id-${itemIndex}`,
          values: [`a name ${itemIndex}`],
        }),
      );
    it('does not show the show more button for 3 or less', () => {
      renderTableDisplay({ children: getRows(3) });
      expect(
        screen.queryByRole('button', { name: /Show more/i }),
      ).not.toBeInTheDocument();
    });
    it('does render the show more than 3', () => {
      renderTableDisplay({ children: getRows(4) });
      expect(screen.getByRole('button', { name: /Show more/i })).toBeVisible();
    });
    it('renders show less button when the show more button is clicked', async () => {
      renderTableDisplay({ children: getRows(4) });
      const button = screen.getByRole('button', { name: /Show more/i });
      userEvent.click(button);
      expect(screen.getByRole('button', { name: /Show less/i })).toBeVisible();
    });
    it('displays the hidden cohorts if the show more button is clicked', () => {
      renderTableDisplay({ children: getRows(4) });
      const button = screen.getByRole('button', { name: /Show more/i });
      userEvent.click(button);
      expect(screen.getByText('a name 3')).toBeVisible();
    });
    it('hides the hidden cohorts if the show less button is clicked', () => {
      renderTableDisplay({ children: getRows(4) });
      const moreButton = screen.getByRole('button', { name: /Show more/i });
      userEvent.click(moreButton);
      expect(screen.getByText('a name 3')).toBeVisible();
      const lessButton = screen.getByRole('button', { name: /Show less/i });
      userEvent.click(lessButton);
      expect(screen.getByText('a name 3')).not.toBeVisible();
      expect(moreButton).toBeVisible();
    });
  });
});
