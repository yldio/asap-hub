import { render, screen } from '@testing-library/react';

import OutputFormPage from '../OutputFormPage';

const defaultProps = {
  firstName: 'Tony',
};

it('renders the children', () => {
  render(<OutputFormPage {...defaultProps}>Content</OutputFormPage>);
  expect(screen.getByText('Content')).toBeVisible();
});

it('renders the message when present', () => {
  render(
    <OutputFormPage {...defaultProps} message="Test message">
      Content
    </OutputFormPage>,
  );
  expect(screen.getByText('Test message')).toBeVisible();
});
