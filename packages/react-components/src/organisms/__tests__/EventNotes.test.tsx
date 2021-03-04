import React from 'react';
import { render } from '@testing-library/react';
import EventNotes from '../EventNotes';

it('renders a heading at level 2', () => {
  const { getByRole } = render(<EventNotes notes="Notes" />);
  expect(getByRole('heading').tagName).toBe('H2');
});
it('does not render a heading if there are no notes', () => {
  const { queryByRole } = render(<EventNotes notes={undefined} />);
  expect(queryByRole('heading')).not.toBeInTheDocument();
});

it('renders the rich text notes', () => {
  const { getByText } = render(
    <EventNotes notes={`<a href="https://google.com">Google</a>`} />,
  );
  expect(getByText('Google').tagName).toBe('A');
});
