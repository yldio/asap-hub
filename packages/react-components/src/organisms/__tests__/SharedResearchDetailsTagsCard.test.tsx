import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import SharedResearchDetailsTagsCard from '../SharedResearchDetailsTagsCard';

const sharedResearchDetailsTagsCardProps: ComponentProps<
  typeof SharedResearchDetailsTagsCard
> = {
  displayDescription: true,
  tags: [],
};
it('renders only description section if there are no tags', () => {
  const { getByText, queryByRole } = render(
    <SharedResearchDetailsTagsCard
      {...sharedResearchDetailsTagsCardProps}
      descriptionMD={'Test description'}
    />,
  );

  expect(queryByRole('heading', { name: /description/i })).toBeInTheDocument();
  expect(queryByRole('heading', { name: /tags/i })).not.toBeInTheDocument();
  expect(getByText('Test description')).toBeVisible();
  expect(queryByRole('separator')).not.toBeInTheDocument();
});

it('renders only tags section if displayDescription prop is false', () => {
  const { getByText, queryByRole } = render(
    <SharedResearchDetailsTagsCard
      {...sharedResearchDetailsTagsCardProps}
      tags={['TestTag']}
      displayDescription={false}
    />,
  );

  expect(
    queryByRole('heading', { name: /description/i }),
  ).not.toBeInTheDocument();
  expect(queryByRole('heading', { name: /tags/i })).toBeInTheDocument();
  expect(getByText('TestTag')).toBeVisible();
  expect(queryByRole('separator')).not.toBeInTheDocument();
});

it('renders a divider between description and tags sections if both are present', () => {
  const { getByText, queryByRole } = render(
    <SharedResearchDetailsTagsCard
      {...sharedResearchDetailsTagsCardProps}
      tags={['TestTag']}
      descriptionMD={'Test description'}
    />,
  );
  expect(queryByRole('heading', { name: /description/i })).toBeInTheDocument();
  expect(queryByRole('heading', { name: /tags/i })).toBeInTheDocument();
  expect(getByText('TestTag')).toBeVisible();
  expect(getByText('Test description')).toBeVisible();
  expect(queryByRole('separator')).toBeInTheDocument();
});

it('renders tags with links if provided', () => {
  const { getByRole } = render(
    <SharedResearchDetailsTagsCard
      {...sharedResearchDetailsTagsCardProps}
      tags={['TestTag']}
    />,
  );
  expect(getByRole('link', { name: /TestTag/i })).toHaveAttribute(
    'href',
    '/tags?tag=TestTag',
  );
});
