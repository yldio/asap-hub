import { render } from '@testing-library/react';

import UtilityBar from '../UtilityBar';

it('displays children', () => {
  const { getByText } = render(
    <UtilityBar>
      <div>CHILDREN</div>
    </UtilityBar>,
  );
  expect(getByText('CHILDREN')).toBeVisible();
});
it('displays Logos and links to external partner sites', () => {
  const { getByTitle } = render(<UtilityBar />);
  const asapLogo = getByTitle(/asap/i);
  expect(asapLogo).toBeInTheDocument();
  expect(asapLogo.closest('a')).toHaveAttribute(
    'href',
    'https://parkinsonsroadmap.org/',
  );

  const gp2Logo = getByTitle(/gp2/i);
  expect(gp2Logo).toBeInTheDocument();
  expect(gp2Logo.closest('a')).toHaveAttribute('href', 'http://gp2.org/');
});
