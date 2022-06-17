import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import EventsSection from '../EventsSection';

const props = ({
  searchQuery = '',
  onChangeSearchQuery = jest.fn(),
} = {}): ComponentProps<typeof EventsSection> => ({
  searchQuery,
  onChangeSearchQuery,
});

it('renders the search box', () => {
  const searchQuery = 'search query';
  render(<EventsSection {...props({ searchQuery })} />);
  expect(screen.getByRole('searchbox')).toHaveValue(searchQuery);
});
it('renders the children', () => {
  render(
    <EventsSection {...props()}>
      <h1>Child element</h1>
    </EventsSection>,
  );
  expect(screen.getByRole('heading', { name: /child element/i })).toBeVisible();
});

it('can search', () => {
  const onChangeSearchQuery = jest.fn();
  render(<EventsSection {...props({ onChangeSearchQuery })} />);
  userEvent.type(screen.getByRole('searchbox'), 's');
  expect(onChangeSearchQuery).toHaveBeenCalledWith('s');
});
