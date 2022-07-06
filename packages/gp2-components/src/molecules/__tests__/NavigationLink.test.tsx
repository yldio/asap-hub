import { render, screen } from '@testing-library/react';
import NavigationLink from '../NavigationLink';

describe('NavigationLink', () => {
  it('renders the icon', () => {
    render(<NavigationLink href="/" icon={<svg />} />);
    expect(screen.getByRole('link')).toContainHTML('<svg');
  });
  it('renders the children', () => {
    render(<NavigationLink href="/">Network</NavigationLink>);
    expect(screen.getByRole('link')).toHaveTextContent('Network');
  });
});
