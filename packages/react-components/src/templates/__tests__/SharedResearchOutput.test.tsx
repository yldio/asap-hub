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

it('renders an output with an external link', () => {
  const { queryByTitle, getByTitle, rerender } = render(
    <SharedResearchOutput {...props} link={undefined} />,
  );
  expect(queryByTitle(/external link/i)).not.toBeInTheDocument();
  rerender(<SharedResearchOutput {...props} link={'http://example.com'} />);
  expect(getByTitle(/external link/i).closest('a')).toHaveAttribute(
    'href',
    'http://example.com',
  );
});

it('falls back to created date when published date omitted', () => {
  const { getByText, rerender } = render(
    <SharedResearchOutput
      {...props}
      created={new Date(2019, 1, 1, 1).toISOString()}
      publishDate={new Date(2020, 1, 1, 1).toISOString()}
      lastModifiedDate={undefined}
    />,
  );
  expect(getByText(/2020/)).toBeVisible();
  rerender(
    <SharedResearchOutput
      {...props}
      created={new Date(2019, 1, 1, 1).toISOString()}
      publishDate={undefined}
      lastModifiedDate={undefined}
    />,
  );
  expect(getByText(/2019/)).toBeVisible();
});

it('renders an output with a modified date', () => {
  const { queryByText, getByText, rerender } = render(
    <SharedResearchOutput
      {...props}
      publishDate={new Date(2019, 1, 1, 1).toISOString()}
      lastModifiedDate={undefined}
    />,
  );
  expect(getByText(/2019/)).toBeVisible();
  expect(queryByText(/·/i)).not.toBeInTheDocument();
  rerender(
    <SharedResearchOutput
      {...props}
      publishDate={new Date(2019, 1, 1, 1).toISOString()}
      lastModifiedDate={new Date(2020, 1, 1, 1).toISOString()}
    />,
  );
  expect(getByText(/2019/)).toBeVisible();
  expect(queryByText(/2020/)).toBeVisible();
  expect(queryByText(/·/i)).toBeInTheDocument();
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
