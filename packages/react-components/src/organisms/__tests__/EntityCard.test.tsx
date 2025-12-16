import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import EntityCard from '../EntityCard';

const props: ComponentProps<typeof EntityCard> = {
  active: true,
  footer: <span>footer</span>,
  googleDrive: 'https://www.googledrive.com',
  href: 'ref',
  inactiveBadge: <span>inactive</span>,
  tags: ['Tag 1', 'Tag 2'],
  text: 'Text',
  title: 'Title',
};

it('renders the title linking to the href value when textHref is not provided and isTeamCard is undefined', () => {
  const { getByText } = render(<EntityCard {...props} />);
  expect(getByText('Text').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/ref$/),
  );
});

it('renders the state tag when active is false', () => {
  const { getByText, rerender, queryByText } = render(
    <EntityCard {...props} active={false} />,
  );
  expect(getByText(/inactive/i, { selector: 'span' })).toBeVisible();

  rerender(<EntityCard {...props} active={true} />);
  expect(queryByText(/inactive/i)).not.toBeInTheDocument();

  rerender(<EntityCard {...props} active={undefined} />);
  expect(queryByText(/inactive/i)).not.toBeInTheDocument();
});

it('renders the link to google drive if present', () => {
  const { rerender, queryByRole } = render(
    <EntityCard {...props} googleDrive={undefined} />,
  );
  expect(
    queryByRole('link', { name: /access drive/i }),
  ).not.toBeInTheDocument();
  rerender(<EntityCard {...props} googleDrive="http://drive.google.com/123" />);
  expect(queryByRole('link', { name: /access drive/i })).toBeVisible();
});

it('renders the title, text, tags and footer', () => {
  const { getByText } = render(<EntityCard {...props} />);
  expect(getByText('Title')).toBeVisible();
  expect(getByText('Text')).toBeVisible();
  expect(getByText('Tag 1')).toBeVisible();
  expect(getByText('Tag 2')).toBeVisible();
  expect(getByText(/footer/i)).toBeVisible();
});

describe('textHref and isTeamCard behavior', () => {
  it('renders text as clickable link when textHref is provided and isTeamCard is true', () => {
    const { getByText } = render(
      <EntityCard {...props} isTeamCard={true} textHref="https://example.com/text" />,
    );
    const link = getByText('Text').closest('a');
    expect(link).toHaveAttribute('href', 'https://example.com/text');
  });

  it('renders text as plain text (not clickable) when textHref is not provided and isTeamCard is true', () => {
    const { getByText, queryByRole } = render(
      <EntityCard {...props} isTeamCard={true} textHref={undefined} />,
    );
    const textElement = getByText('Text');
    expect(textElement.closest('a')).not.toBeInTheDocument();
    expect(textElement.closest('span')).toBeInTheDocument();
    expect(queryByRole('link', { name: 'Text' })).not.toBeInTheDocument();
  });

  it('renders text as clickable link when textHref is not provided, isTeamCard is false, and href exists', () => {
    const { getByText } = render(
      <EntityCard {...props} isTeamCard={false} textHref={undefined} href="https://example.com" />,
    );
    const link = getByText('Text').closest('a');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('renders text as plain text when textHref is not provided, isTeamCard is false, and href is empty string', () => {
    const { getByText, queryByRole } = render(
      <EntityCard {...props} isTeamCard={false} textHref={undefined} href="" />,
    );
    const textElement = getByText('Text');
    expect(textElement.closest('a')).not.toBeInTheDocument();
    expect(textElement.closest('span')).toBeInTheDocument();
    expect(queryByRole('link', { name: 'Text' })).not.toBeInTheDocument();
  });

  it('renders text as clickable link when textHref is not provided and isTeamCard is undefined (default behavior)', () => {
    const { getByText } = render(
      <EntityCard {...props} textHref={undefined} href="https://example.com/default" />,
    );
    const link = getByText('Text').closest('a');
    expect(link).toHaveAttribute('href', 'https://example.com/default');
  });
});
