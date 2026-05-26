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
  expect(queryAllByText('Project')).toHaveLength(2);
});

it('hides teams section when source is project', () => {
  const { queryByText } = render(
    <ProjectOutputBody {...baseProps} source="project" />,
  );
  expect(queryByText(/Team Jakobsson/)).toBeNull();
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
  expect(getByText('My Project')).toBeVisible();
});

it('hides tags when showTags is false', () => {
  const { queryByText } = render(
    <ProjectOutputBody {...baseProps} showTags={false} />,
  );
  expect(queryByText('Etag')).toBeNull();
});
