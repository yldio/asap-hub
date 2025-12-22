import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavigationLink from '../NavigationLink';

describe('NavigationLink', () => {
  it('renders the icon', () => {
    render(
      <MemoryRouter>
        <NavigationLink href="/" icon={<svg />} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link')).toContainHTML('<svg');
  });
  it('renders the children', () => {
    render(
      <MemoryRouter>
        <NavigationLink href="/">Network</NavigationLink>
      </MemoryRouter>,
    );
    expect(screen.getByRole('link')).toHaveTextContent('Network');
  });
});
