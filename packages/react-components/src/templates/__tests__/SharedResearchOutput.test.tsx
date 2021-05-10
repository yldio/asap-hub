import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

import SharedResearchOutput from '../SharedResearchOutput';

const props: ComponentProps<typeof SharedResearchOutput> = {
  ...createResearchOutputResponse(),
  type: 'Protocol',
  backHref: '#',
};
it('renders an output with title and content', () => {
  const { getByText } = render(
    <SharedResearchOutput
      {...props}
      type="Protocol"
      title="title"
      description="content"
    />,
  );
  expect(getByText(/protocol/i)).toBeVisible();
  expect(getByText(/title/i, { selector: 'h1' })).toBeVisible();
  expect(getByText(/content/i)).toBeVisible();
});

describe('tags and description', () => {
  it('handles tags and description omitted', () => {
    const { queryByText, queryByRole } = render(
      <SharedResearchOutput {...props} tags={[]} description="" />,
    );
    expect(queryByText(/tags/i, { selector: 'h2' })).not.toBeInTheDocument();
    expect(
      queryByText(/description/i, { selector: 'h2' }),
    ).not.toBeInTheDocument();
    expect(queryByRole('separator')).not.toBeInTheDocument();
  });

  it('handles just a description', () => {
    const { queryByText, getByText, queryByRole } = render(
      <SharedResearchOutput {...props} tags={[]} description="text" />,
    );
    expect(queryByText(/tags/i, { selector: 'h2' })).not.toBeInTheDocument();
    expect(queryByText(/description/i, { selector: 'h2' })).toBeInTheDocument();
    expect(getByText('text')).toBeVisible();
    expect(queryByRole('separator')).not.toBeInTheDocument();
  });

  it('handles just tags', () => {
    const { queryByText, getByText, queryByRole } = render(
      <SharedResearchOutput {...props} tags={['tag1']} description="" />,
    );
    expect(queryByText(/tags/i, { selector: 'h2' })).toBeInTheDocument();
    expect(
      queryByText(/description/i, { selector: 'h2' }),
    ).not.toBeInTheDocument();
    expect(getByText('tag1')).toBeVisible();
    expect(queryByRole('separator')).not.toBeInTheDocument();
  });
  it('handles tags and description', () => {
    const { queryByText, getByText, queryByRole } = render(
      <SharedResearchOutput {...props} tags={['tag1']} description="text  " />,
    );
    expect(queryByText(/tags/i, { selector: 'h2' })).toBeInTheDocument();
    expect(queryByText(/description/i, { selector: 'h2' })).toBeInTheDocument();
    expect(getByText('tag1')).toBeVisible();
    expect(getByText('text')).toBeVisible();
    expect(queryByRole('separator')).toBeVisible();
  });
});
