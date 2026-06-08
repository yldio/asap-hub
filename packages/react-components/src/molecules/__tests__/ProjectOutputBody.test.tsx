import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

import ProjectOutputBody from '../ProjectOutputBody';

const baseProps: ComponentProps<typeof ProjectOutputBody> = {
  ...createResearchOutputResponse(),
  variant: 'card',
  source: 'team',
};

it('defaults showTags to true when omitted', () => {
  const { getByText } = render(
    <ProjectOutputBody {...baseProps} keywords={['Etag']} />,
  );
  expect(getByText('Etag')).toBeVisible();
});

it('renders external author display name', () => {
  const { getByText } = render(
    <ProjectOutputBody
      {...baseProps}
      authors={[{ id: 'ext-1', displayName: 'External Author' }]}
    />,
  );
  expect(getByText('External Author')).toBeVisible();
});

it('renders alumni badge for internal authors with alumniSinceDate', () => {
  const { getByTitle } = render(
    <ProjectOutputBody
      {...baseProps}
      authors={[
        {
          id: 'u1',
          firstName: 'John',
          lastName: 'Doe',
          displayName: 'John Doe',
          avatarUrl: undefined,
          alumniSinceDate: '2020-01-01',
        },
      ]}
    />,
  );
  expect(getByTitle('Alumni Member')).toBeInTheDocument();
});

it('renders author overflow counter when authors exceed max', () => {
  const authors = Array.from({ length: 5 }, (_, i) => ({
    id: `u${i}`,
    firstName: `First${i}`,
    lastName: `Last${i}`,
    displayName: `First${i} Last${i}`,
    avatarUrl: undefined,
  }));
  const { getByText } = render(
    <ProjectOutputBody {...baseProps} authors={authors} />,
  );
  expect(getByText('+2')).toBeVisible();
  expect(getByText('Authors')).toBeVisible();
});

it('renders list variant with headline style 5', () => {
  const { getByRole } = render(
    <ProjectOutputBody {...baseProps} variant="list" />,
  );
  expect(getByRole('heading', { level: 2 })).toBeVisible();
});

it('renders Draft state tag when not published', () => {
  const { getByText } = render(
    <ProjectOutputBody {...baseProps} published={false} isInReview={false} />,
  );
  expect(getByText('Draft')).toBeVisible();
});

it('renders In Review state tag when in review', () => {
  const { getByText } = render(
    <ProjectOutputBody {...baseProps} published={false} isInReview={true} />,
  );
  expect(getByText('In Review')).toBeVisible();
});

it('renders external link when link is provided', () => {
  const { getAllByText } = render(
    <ProjectOutputBody {...baseProps} link="https://example.com" />,
  );
  expect(getAllByText('Access Output').length).toBeGreaterThanOrEqual(1);
});

it('hides mobile pill list when documentType and type are absent', () => {
  const { queryAllByText } = render(
    <ProjectOutputBody
      {...baseProps}
      documentType={undefined as never}
      type={undefined as never}
    />,
  );
  expect(queryAllByText('Project Output')).toHaveLength(2);
});

it('renders teams section when teams present and source is project', () => {
  const { getAllByText } = render(
    <ProjectOutputBody {...baseProps} source="project" />,
  );
  expect(getAllByText(/Team Jakobsson/).length).toBeGreaterThanOrEqual(1);
});

it('renders multiple teams count on mobile layout', () => {
  const { getByText } = render(
    <ProjectOutputBody
      {...baseProps}
      teams={[
        { id: 't1', displayName: 'Alpha', teamType: 'Discovery Team' },
        { id: 't2', displayName: 'Beta', teamType: 'Discovery Team' },
      ]}
    />,
  );
  expect(getByText('2 Teams')).toBeInTheDocument();
});

it('renders project association row', () => {
  const { getByText } = render(
    <ProjectOutputBody
      {...baseProps}
      project={{
        id: 'p1',
        title: 'My Project',
        projectType: 'Discovery Project',
        href: '/projects/p1',
      }}
    />,
  );
  expect(getByText('My Project')).toBeVisible();
});

it('renders first team project as primary when output has no project', () => {
  const { getByRole, getByText, queryByText } = render(
    <ProjectOutputBody
      {...baseProps}
      teams={[
        {
          id: 't1',
          displayName: 'Alpha',
          teamType: 'Discovery Team',
          project: {
            id: 'p1',
            title: 'First Team Project',
            projectType: 'Discovery Project',
          },
        },
        {
          id: 't2',
          displayName: 'Beta',
          teamType: 'Discovery Team',
          project: {
            id: 'p2',
            title: 'Second Team Project',
            projectType: 'Resource Project',
          },
        },
      ]}
    />,
  );

  expect(getByRole('link', { name: 'First Team Project' })).toHaveAttribute(
    'href',
    expect.stringContaining('p1'),
  );
  expect(queryByText('Second Team Project')).toBeNull();
  expect(getByText('+1')).toBeVisible();
  expect(getByText('Projects')).toBeVisible();
});

it('renders primary project with team-linked projects in the projects row', () => {
  const { getByRole, getByText, queryByText } = render(
    <ProjectOutputBody
      {...baseProps}
      teams={[
        {
          id: 't1',
          displayName: 'Alpha',
          teamType: 'Discovery Team',
          project: {
            id: 'p2',
            title: 'Linked Project A',
            projectType: 'Discovery Project',
          },
        },
        {
          id: 't2',
          displayName: 'Beta',
          teamType: 'Discovery Team',
          project: {
            id: 'p3',
            title: 'Linked Project B',
            projectType: 'Resource Project',
          },
        },
      ]}
      project={{
        id: 'p1',
        title: 'Primary Project',
        projectType: 'Discovery Project',
        href: '/projects/p1',
      }}
    />,
  );

  expect(getByRole('link', { name: 'Primary Project' })).toHaveAttribute(
    'href',
    '/projects/p1',
  );
  expect(queryByText('Linked Project A')).toBeNull();
  expect(queryByText('Linked Project B')).toBeNull();
  expect(getByText('+2')).toBeVisible();
  expect(getByText('Projects')).toBeVisible();
});

it('hides tags when showTags is false', () => {
  const { queryByText } = render(
    <ProjectOutputBody {...baseProps} showTags={false} />,
  );
  expect(queryByText('Etag')).toBeNull();
});
