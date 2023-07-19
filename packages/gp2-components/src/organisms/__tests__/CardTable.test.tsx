import { render, screen } from '@testing-library/react';

import { CardTable } from '..';

describe('CardTable', () => {
  it('renders the card table', () => {
    render(
      <CardTable headings={['Heading 1', 'Heading 2', 'Heading 3']}>
        {[
          {
            id: '1',
            values: ['val1', 'val2', 'val3'],
          },
        ]}
      </CardTable>,
    );
    expect(screen.getByTestId('heading-desktop-0')).toBeVisible();
    expect(screen.getByTestId('heading-desktop-1')).toBeVisible();
    expect(screen.getByTestId('heading-desktop-2')).toBeVisible();
    expect(screen.getByText('val1')).toBeVisible();
    expect(screen.getByText('val2')).toBeVisible();
    expect(screen.getByText('val3')).toBeVisible();
  });
});
