import { render, screen } from '@testing-library/react';

import DiscoverGuides from '../DiscoverGuides';

it('renders all the sections', () => {
  render(<DiscoverGuides />);

  expect(screen.getByText('Grant Welcome Packet')).toBeVisible();
  expect(screen.getByText('Grants Management Portal')).toBeVisible();
  expect(screen.getByText('Budget Reallocation Request Form')).toBeVisible();
  expect(
    screen.getByText('Template Annual Progress and Expense Team Reports'),
  ).toBeVisible();
  expect(screen.getByText('Open Access Policy')).toBeVisible();
  expect(
    screen.getByText(
      'Sharing your ASAP supported articles on ASAP social media channels',
    ),
  ).toBeVisible();
  expect(screen.getByText('Coverage of Article Processing Fees')).toBeVisible();
  expect(screen.getByText('ASAP Tools Program')).toBeVisible();
});
