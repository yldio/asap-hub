import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import NavigationHeader from '../NavigationHeader';

describe('NavigationHeader', () => {
  const props: ComponentProps<typeof NavigationHeader> = {
    userId: '1',
    projects: [],
    workingGroups: [],
    menuShown: false,
    onToggleMenu: jest.fn(),
  };
  it('renders the gp2 logo', () => {
    render(
      <MemoryRouter>
        <NavigationHeader {...props} />
      </MemoryRouter>,
    );
    expect(screen.getAllByRole('link')[0]?.firstChild).toHaveTextContent(
      /GP2 Logo/,
    );
  });

  it('renders a menu button if menuShown prop is false', () => {
    render(
      <MemoryRouter>
        <NavigationHeader {...props} />
      </MemoryRouter>,
    );
    expect(screen.getByTitle(/menu/i)).toBeInTheDocument();
  });
  it('renders a close button if menuShown prop is true', () => {
    render(
      <MemoryRouter>
        <NavigationHeader {...props} menuShown={true} />
      </MemoryRouter>,
    );
    expect(screen.getByTitle(/close/i)).toBeInTheDocument();
  });
  it('calls onMenuToggle when the menu toggle button is clicked', async () => {
    const onMenuToggle = jest.fn();
    render(
      <MemoryRouter>
        <NavigationHeader {...props} onToggleMenu={onMenuToggle} />
      </MemoryRouter>,
    );
    await userEvent.click(screen.getByLabelText(/toggle menu/i));
    expect(onMenuToggle).toHaveBeenCalledTimes(1);
  });
});
