import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

import ProjectOutputCard from '../ProjectOutputCard';

const baseProps: ComponentProps<typeof ProjectOutputCard> = {
  ...createResearchOutputResponse(),
  source: 'team',
};

it('renders the title', () => {
  const { getByRole } = render(
    <ProjectOutputCard {...baseProps} title="output title" />,
  );
  expect(getByRole('heading').textContent).toEqual('output title');
  expect(getByRole('heading').tagName).toEqual('H2');
});

it('renders Project pill', () => {
  const { getByText } = render(<ProjectOutputCard {...baseProps} />);
  expect(getByText('Project')).toBeVisible();
});

it('renders projects with clickable link when href present', () => {
  const { getByRole } = render(
    <ProjectOutputCard
      {...baseProps}
      projects={[
        {
          id: 'p1',
          title: 'My Project',
          projectType: 'discovery',
          href: '/projects/p1',
        },
      ]}
    />,
  );
  const link = getByRole('link', { name: 'My Project' });
  expect(link).toHaveAttribute('href', '/projects/p1');
});

it('renders projects as plain text when href absent', () => {
  const { getByText, queryByRole } = render(
    <ProjectOutputCard
      {...baseProps}
      projects={[
        { id: 'p1', title: 'No-link Project', projectType: 'discovery' },
      ]}
    />,
  );
  expect(getByText('No-link Project')).toBeVisible();
  expect(queryByRole('link', { name: 'No-link Project' })).toBeNull();
});

it('renders Team association when teams present', () => {
  const { getByText } = render(
    <ProjectOutputCard
      {...baseProps}
      teams={[{ id: 't1', displayName: 'Alpha', teamType: 'Discovery Team' }]}
    />,
  );
  expect(getByText('Team Alpha').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/t1$/),
  );
});

it('omits Team association when teams empty (team-based output)', () => {
  const { queryByText } = render(
    <ProjectOutputCard {...baseProps} teams={[]} />,
  );
  expect(queryByText(/^Team\s/)).toBeNull();
});

it('omits Team association for project-based output even when teams present', () => {
  const { queryByText } = render(
    <ProjectOutputCard
      {...baseProps}
      source="project"
      teams={[{ id: 't1', displayName: 'Alpha', teamType: 'Discovery Team' }]}
    />,
  );
  expect(queryByText('Team Alpha')).toBeNull();
});

it('defaults source to project when not provided', () => {
  const { source: _unused, ...propsWithoutSource } = baseProps;
  const { queryByText } = render(
    <ProjectOutputCard
      {...propsWithoutSource}
      teams={[{ id: 't1', displayName: 'Alpha', teamType: 'Discovery Team' }]}
    />,
  );
  expect(queryByText('Team Alpha')).toBeNull();
});

it('displays Draft tag when not published', () => {
  const { getByText, queryByText, rerender } = render(
    <ProjectOutputCard {...baseProps} published={false} />,
  );
  expect(getByText('Draft')).toBeVisible();

  rerender(<ProjectOutputCard {...baseProps} published={true} />);
  expect(queryByText('Draft')).toBeNull();
});

it('displays In Review tag when not published and is in review', () => {
  const { getByText } = render(
    <ProjectOutputCard {...baseProps} published={false} isInReview={true} />,
  );
  expect(getByText('In Review')).toBeVisible();
});

it('renders external link when link property present', () => {
  const { getByTitle } = render(
    <ProjectOutputCard {...baseProps} link={'https://example.com'} />,
  );
  expect(getByTitle('External Link').closest('a')).toHaveAttribute(
    'href',
    'https://example.com',
  );
});

it('displays Date Added and Last Updated using lastModifiedDate', () => {
  const { getByText } = render(
    <ProjectOutputCard
      {...baseProps}
      addedDate={new Date(2020, 3, 3).toISOString()}
      lastModifiedDate={new Date(2021, 5, 10).toISOString()}
      created={new Date(2019, 0, 1).toISOString()}
    />,
  );
  expect(getByText(/Date Added/).textContent).toContain('3rd April 2020');
  expect(getByText(/Last Updated/).textContent).toContain('10th June 2021');
});

it('falls back Last Updated to addedDate then created when lastModifiedDate absent', () => {
  const { getByText, rerender } = render(
    <ProjectOutputCard
      {...baseProps}
      addedDate={new Date(2020, 3, 3).toISOString()}
      lastModifiedDate={undefined}
      created={new Date(2019, 0, 1).toISOString()}
    />,
  );
  expect(getByText(/Last Updated/).textContent).toContain('3rd April 2020');

  rerender(
    <ProjectOutputCard
      {...baseProps}
      addedDate={undefined}
      lastModifiedDate={undefined}
      created={new Date(2019, 0, 1).toISOString()}
    />,
  );
  expect(getByText(/Last Updated/).textContent).toContain('1st January 2019');
});

it('renders tags when showTags', () => {
  const { getByText, queryByText, rerender } = render(
    <ProjectOutputCard {...baseProps} keywords={['Etag']} showTags />,
  );
  expect(getByText('Etag')).toBeVisible();

  rerender(
    <ProjectOutputCard {...baseProps} keywords={['Etag']} showTags={false} />,
  );
  expect(queryByText('Etag')).toBeNull();
});

it('omits the tags block when keywords are empty', () => {
  const { queryByText } = render(
    <ProjectOutputCard {...baseProps} keywords={[]} showTags />,
  );
  expect(queryByText('Etag')).toBeNull();
});

it('renders +N counter when teams exceed the visible limit', () => {
  const { getByText } = render(
    <ProjectOutputCard
      {...baseProps}
      teams={[
        { id: 't1', displayName: 'A', teamType: 'Discovery Team' },
        { id: 't2', displayName: 'B', teamType: 'Discovery Team' },
        { id: 't3', displayName: 'C', teamType: 'Discovery Team' },
        { id: 't4', displayName: 'D', teamType: 'Resource Team' },
      ]}
    />,
  );
  expect(getByText('+1')).toBeVisible();
  expect(getByText('Teams')).toBeVisible();
});
