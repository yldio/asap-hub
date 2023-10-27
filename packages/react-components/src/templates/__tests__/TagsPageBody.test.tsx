import {
  createEventResponse,
  createResearchOutputResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import TagsPageBody from '../TagsPageBody';

const props: ComponentProps<typeof TagsPageBody> = {
  currentPage: 0,
  numberOfItems: 1,
  numberOfPages: 1,
  renderPageHref: () => '',
  results: [],
};

it('renders no results page', () => {
  render(
    <TagsPageBody
      {...props}
      numberOfItems={0}
      numberOfPages={0}
      results={[]}
    />,
  );
  expect(screen.getByText(/Explore any tags/i)).toBeVisible();
});
it('renders a list of cards', () => {
  render(
    <TagsPageBody
      {...props}
      numberOfItems={2}
      results={[
        {
          ...createResearchOutputResponse(),
          title: 'Research about CRISPR/Cas9',
        },
        { ...createUserResponse(), displayName: 'John Doe', degree: 'PhD' },
        { ...createEventResponse(), title: 'ASAP Collaborative Meeting' },
      ]}
    />,
  );
  expect(screen.getByText('Research about CRISPR/Cas9')).toBeVisible();
  expect(screen.getByText('Working Group')).toBeVisible();

  expect(screen.getByText('John Doe, PhD')).toBeVisible();

  // events will be implemented in the future
  expect(
    screen.queryByText('ASAP Collaborative Meeting'),
  ).not.toBeInTheDocument();
});
