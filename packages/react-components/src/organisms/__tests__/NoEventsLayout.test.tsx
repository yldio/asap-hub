import { render, screen } from '@testing-library/react';
import NoEventsLayout from '../NoEventsLayout';

it('renders the children of the main container', () => {
  render(<NoEventsLayout>mock value</NoEventsLayout>);

  expect(screen.getByText('mock value')).toBeInTheDocument();
});

it('renders the children of the title container', () => {
  render(
    <NoEventsLayout>
      <NoEventsLayout.Title>mock title</NoEventsLayout.Title>
    </NoEventsLayout>,
  );

  expect(screen.getByText('mock title')).toBeInTheDocument();
});

it('renders the children of the description container', () => {
  render(
    <NoEventsLayout>
      <NoEventsLayout.Description>mock description</NoEventsLayout.Description>
    </NoEventsLayout>,
  );

  expect(screen.getByText('mock description')).toBeInTheDocument();
});

it('renders the children of the link container', () => {
  render(
    <NoEventsLayout>
      <NoEventsLayout.Link link="mock-link">mock link</NoEventsLayout.Link>
    </NoEventsLayout>,
  );

  expect(screen.getByText('mock link')).toBeInTheDocument();
  expect(screen.getByRole('link')).toHaveAttribute('href', 'mock-link');
});
