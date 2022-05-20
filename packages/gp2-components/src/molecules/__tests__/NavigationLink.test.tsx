import { render } from '@testing-library/react';
import NavigationLink from '../NavigationLink';

describe('NavigationLink', () => {
  it('renders the icon', () => {
    const { getByRole } = render(<NavigationLink href="/" icon={<svg />} />);
    expect(getByRole('link')).toContainHTML('<svg');
  });
  it('renders the children', () => {
    const { getByText } = render(
      <NavigationLink href="/">Network</NavigationLink>,
    );
    expect(getByText('Network')).toBeInTheDocument();
  });
});
