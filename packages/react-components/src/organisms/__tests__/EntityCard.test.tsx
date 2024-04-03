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

it('renders the title linking to the href value', () => {
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
