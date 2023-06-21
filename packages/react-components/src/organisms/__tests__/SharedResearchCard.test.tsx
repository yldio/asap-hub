import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

import SharedResearchCard from '../SharedResearchCard';

const sharedResearchCardProps: ComponentProps<typeof SharedResearchCard> =
  createResearchOutputResponse();
it('renders the title', () => {
  const { getByRole } = render(
    <SharedResearchCard {...sharedResearchCardProps} title="test123" />,
  );
  expect(getByRole('heading').textContent).toEqual('test123');
  expect(getByRole('heading').tagName).toEqual('H2');
});

it('displays addedDate when present', () => {
  const { getByText } = render(
    <SharedResearchCard
      {...sharedResearchCardProps}
      addedDate={new Date(2019, 3, 3, 14, 32).toISOString()}
      created={new Date(2020, 6, 12, 14, 32).toISOString()}
    />,
  );
  expect(getByText(/added/i).textContent).toMatchInlineSnapshot(
    `"Date Added: 3rd April 2019"`,
  );
});

it('displays created date when addedDate is undefined', () => {
  const { getByText } = render(
    <SharedResearchCard
      {...sharedResearchCardProps}
      addedDate={new Date(2020, 6, 12, 14, 32).toISOString()}
      created={new Date(2020, 6, 12, 14, 32).toISOString()}
    />,
  );
  expect(getByText(/added/i).textContent).toMatchInlineSnapshot(
    `"Date Added: 12th July 2020"`,
  );
});

it('displays team information when present', () => {
  const { getByText } = render(
    <SharedResearchCard
      {...sharedResearchCardProps}
      teams={[
        {
          id: '123',
          displayName: 'A',
        },
      ]}
    />,
  );
  expect(getByText('Team A').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/123$/),
  );
});
it('displays lab icon and name when present', () => {
  const { getByText, queryByTitle, rerender } = render(
    <SharedResearchCard {...sharedResearchCardProps} labs={[]} />,
  );
  expect(queryByTitle(/lab/i)).not.toBeInTheDocument();

  rerender(
    <SharedResearchCard
      {...sharedResearchCardProps}
      labs={[
        {
          id: '123',
          name: 'A',
        },
      ]}
    />,
  );
  expect(queryByTitle(/lab/i)).toBeInTheDocument();
  expect(getByText('A Lab')).toBeVisible();
});

it('displays link component when link property present', () => {
  const { getByTitle } = render(
    <SharedResearchCard
      {...sharedResearchCardProps}
      documentType={'Presentation'}
      link={'https://example.com'}
    />,
  );
  expect(getByTitle('External Link').closest('a')).toHaveAttribute(
    'href',
    'https://example.com',
  );
});

it('displays link component when protocol link property is present', () => {
  const { getByTitle } = render(
    <SharedResearchCard
      {...sharedResearchCardProps}
      documentType={'Protocol'}
      link={'https://example.com'}
    />,
  );
  expect(getByTitle('External Link').closest('a')).toHaveAttribute(
    'href',
    'https://example.com',
  );
});

it('displays link component when presentation link property is present', () => {
  const { getByTitle } = render(
    <SharedResearchCard
      {...sharedResearchCardProps}
      documentType={'Presentation'}
      link={'https://example.com'}
    />,
  );
  expect(getByTitle('External Link').closest('a')).toHaveAttribute(
    'href',
    'https://example.com',
  );
});

it('displays authors when present', () => {
  const { getByText } = render(
    <SharedResearchCard
      {...sharedResearchCardProps}
      authors={[{ id: 'external-author-1', displayName: 'ab' }]}
    />,
  );
  expect(getByText('ab')).toBeVisible();
});

it('displays draft tag when research output not published', () => {
  const { getByText, queryByText, rerender } = render(
    <SharedResearchCard {...sharedResearchCardProps} published={false} />,
  );
  expect(getByText('Draft')).toBeVisible();

  rerender(
    <SharedResearchCard {...sharedResearchCardProps} published={true} />,
  );
  expect(queryByText('Draft')).toBeNull();
});

it('displays in review tag when research output not published and someone requested a review', () => {
  const { getByText, queryByText, rerender } = render(
    <SharedResearchCard
      {...sharedResearchCardProps}
      published={false}
      reviewRequestedBy={{ id: 'user', firstName: 'John', lastName: 'Doe' }}
    />,
  );
  expect(getByText('In Review')).toBeVisible();

  rerender(
    <SharedResearchCard {...sharedResearchCardProps} published={true} />,
  );
  expect(queryByText('In Review')).toBeNull();
});
