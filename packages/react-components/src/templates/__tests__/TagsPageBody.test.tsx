import {
  createEventResponse,
  createResearchOutputResponse,
  createTeamResponse,
  createUserResponse,
  createWorkingGroupResponse,
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
      numberOfItems={4}
      results={[
        {
          ...createResearchOutputResponse(),
          title: 'Research about CRISPR/Cas9',
        },
        { ...createUserResponse(), displayName: 'John Doe', degree: 'PhD' },
        { ...createEventResponse(), title: 'ASAP Collaborative Meeting' },
        { ...createTeamResponse(), displayName: 'Team ASAP' },
        {
          ...createWorkingGroupResponse(),
          title: 'Comparative Neuroanatomy Working Group',
        },
      ]}
    />,
  );
  expect(screen.getByText('Research about CRISPR/Cas9')).toBeVisible();
  expect(screen.getByText('Working Group')).toBeVisible();

  expect(screen.getByText('John Doe, PhD')).toBeVisible();

  expect(screen.getByText('ASAP Collaborative Meeting')).toBeInTheDocument();

  expect(screen.getByText(/Team ASAP/i)).toBeInTheDocument();

  expect(
    screen.getByText(/Comparative Neuroanatomy Working Group/i),
  ).toBeInTheDocument();
});
