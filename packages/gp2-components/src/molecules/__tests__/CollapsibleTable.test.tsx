import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import CollapsibleTable from '../CollapsibleTable';

describe('CollapsibleTable', () => {
  type TableDisplayProps = ComponentProps<typeof CollapsibleTable>;
  const renderTableDisplay = ({
    children = [<span key="child-1">A value</span>],
    ...overrides
  }: Partial<TableDisplayProps>) => {
    const props: Omit<TableDisplayProps, 'children'> = {
      headings: (
        <div>
          <span>heading 1</span>
        </div>
      ),
    };
    render(
      <CollapsibleTable {...props} {...overrides}>
        {children}
      </CollapsibleTable>,
    );
  };
  it('displays the row', () => {
    const value = 'some row to display';
    renderTableDisplay({
      children: [<span key="child-1">{value}</span>],
    });
    expect(screen.getByText(value)).toBeVisible();
  });
  it('multiple rows', () => {
    const firstValue = 'first row to display';
    const secondValue = 'second row to display';
    renderTableDisplay({
      children: [
        <span key="child-1">{firstValue}</span>,
        <span key="child-2">{secondValue}</span>,
      ],
    });
    expect(screen.getByText(firstValue)).toBeVisible();
    expect(screen.getByText(secondValue)).toBeVisible();
  });
  it('displays the headings', () => {
    const heading = 'some heading to display';
    renderTableDisplay({ headings: <div>{heading}</div> });
    expect(screen.getByText(heading)).toBeVisible();
  });
  it('displays multiple headings', () => {
    const firstHeading = 'first heading to display';
    const secondHeading = 'second heading to display';
    renderTableDisplay({
      headings: (
        <div>
          <h4>{firstHeading}</h4>
          <h4>{secondHeading}</h4>
        </div>
      ),
      children: [<span key="child-1">1</span>, <span key="child-2">2</span>],
    });
    expect(
      screen.getByRole('heading', { name: `${firstHeading}` }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: `${secondHeading}` }),
    ).toBeVisible();
  });
  it('multiple columns in a row', () => {
    const firstValue = 'first value in a row to display';
    const secondValue = 'second value in a row to display';
    renderTableDisplay({
      children: [
        <span key="child-1">{firstValue}</span>,
        <span key="child-2">{secondValue}</span>,
      ],
    });
    expect(screen.getByText(firstValue)).toBeVisible();
    expect(screen.getByText(secondValue)).toBeVisible();
  });

  describe('show more', () => {
    type Row = TableDisplayProps['children'][number];
    const getRows = (length = 1): Row[] =>
      Array.from(
        { length },
        (_, itemIndex): Row => (
          <span key={`child-${itemIndex}`}>a name {itemIndex}</span>
        ),
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
    it('displays the hidden rows if the show more button is clicked', () => {
      renderTableDisplay({ children: getRows(4) });
      const button = screen.getByRole('button', { name: /Show more/i });
      userEvent.click(button);
      expect(screen.getByText('a name 3')).toBeVisible();
    });
    it('hides the hidden rows if the show less button is clicked', () => {
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
