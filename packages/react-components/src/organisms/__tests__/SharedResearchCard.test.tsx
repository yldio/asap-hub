import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

import SharedResearchCard from '../SharedResearchCard';

const sharedResearchCardProps: ComponentProps<typeof SharedResearchCard> = createResearchOutputResponse();

it('renders the title', () => {
  const { getByRole } = render(
    <SharedResearchCard {...sharedResearchCardProps} title="test123" />,
  );
  expect(getByRole('heading').textContent).toEqual('test123');
  expect(getByRole('heading').tagName).toEqual('H2');
});

it('displays published date is undefined', () => {
  const { getByText } = render(
    <SharedResearchCard
      {...sharedResearchCardProps}
      publishDate={new Date(2019, 3, 3, 14, 32).toISOString()}
      created={new Date(2020, 6, 12, 14, 32).toISOString()}
    />,
  );
  expect(getByText(/added/i).textContent).toMatchInlineSnapshot(
    `"Date Added: 3rd April 2019"`,
  );
});

it('displays created date when published date is undefined', () => {
  const { getByText } = render(
    <SharedResearchCard
      {...sharedResearchCardProps}
      publishDate={undefined}
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
      team={{
        id: '123',
        displayName: 'A',
      }}
    />,
  );
  expect(getByText('Team A').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/123$/),
  );
});

it('displays link component when link property present', () => {
  const { getByText } = render(
    <SharedResearchCard
      {...sharedResearchCardProps}
      type={'Presentation'}
      link={'https://example.com'}
    />,
  );
  const link = getByText(/google/i).closest('a');
  expect(link).toHaveAttribute('href', 'https://example.com');
});

it('displays link component when protocol link property is present', () => {
  const { getByText } = render(
    <SharedResearchCard
      {...sharedResearchCardProps}
      type={'Protocol'}
      link={'https://example.com'}
    />,
  );
  const link = getByText(/protocols.io/i).closest('a');
  expect(link).toHaveAttribute('href', 'https://example.com');
});

it('displays link component when presentation link property is present', () => {
  const { getByText } = render(
    <SharedResearchCard
      {...sharedResearchCardProps}
      type={'Presentation'}
      link={'https://example.com'}
    />,
  );
  const link = getByText(/view\son\sgoogle/i).closest('a');
  expect(link).toHaveAttribute('href', 'https://example.com');
});
