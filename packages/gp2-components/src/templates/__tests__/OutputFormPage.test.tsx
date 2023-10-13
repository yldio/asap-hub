import { render, screen } from '@testing-library/react';

import OutputFormPage from '../OutputFormPage';

const defaultProps = {
  firstName: 'Tony',
};

it('renders the children', () => {
  render(<OutputFormPage {...defaultProps}>Content</OutputFormPage>);
  expect(screen.getByText('Content')).toBeVisible();
});
