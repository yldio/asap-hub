import {
  createEventResponse,
  createResearchOutputResponse,
  createTeamResponse,
  createUserResponse,
  createWorkingGroupResponse,
  createTutorialsResponse,
  createNewsResponse,
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
          __meta: { type: 'research-output' },
          title: 'Research about CRISPR/Cas9',
        },
        {
          ...createUserResponse(),
          __meta: { type: 'user' },
          displayName: 'John Doe',
          degree: 'PhD',
        },
        {
          ...createEventResponse(),
          __meta: { type: 'event' },
          title: 'ASAP Collaborative Meeting',
        },
        {
          ...createTeamResponse(),
          __meta: { type: 'team' },
          displayName: 'Team ASAP',
        },
        {
          ...createWorkingGroupResponse(),
          __meta: { type: 'working-group' },
          title: 'Comparative Neuroanatomy Working Group',
        },
        {
          ...createTutorialsResponse({ key: '1' }),
          __meta: { type: 'tutorial' },
          title: 'Tutorial 1',
        },
        {
          ...createNewsResponse({ key: 'id-1' }),
          __meta: { type: 'news' },
          title: 'News Title',
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

  expect(screen.getByText(/Tutorial 1/i)).toBeInTheDocument();

  expect(screen.getByText(/News Title/i)).toBeInTheDocument();
});
