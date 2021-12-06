import { render } from '@testing-library/react';

import NoOutputsPage from '../NoOutputsPage';

it('renders the signin page', () => {
  const { getByText } = render(
    <NoOutputsPage title="Example Title" description="Example Description" />,
  );
  expect(getByText(/example title/i)).toBeVisible();
});

it('supports react components in the description', () => {
  const { getByText } = render(
    <NoOutputsPage
      title="Example Title"
      description={
        <>
          <a href="http://example.com">abc213</a>
        </>
      }
    />,
  );
  expect(getByText('abc213').closest('a')).toHaveAttribute(
    'href',
    'http://example.com',
  );
});
