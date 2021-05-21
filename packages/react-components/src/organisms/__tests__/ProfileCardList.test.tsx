import { render } from '@testing-library/react';

import ProfileCardList from '../ProfileCardList';

it('renders the passed cards', () => {
  const { getAllByText } = render(
    <ProfileCardList>
      {{ card: 'card1' }}
      {{ card: 'card2' }}
    </ProfileCardList>,
  );
  expect(
    getAllByText(/[a-z0-9]+/i).map(({ textContent }) => textContent),
  ).toEqual(['card1', 'card2']);
});

it('renders edit links for the corresponding cards', () => {
  const { getAllByText } = render(
    <ProfileCardList>
      {{ card: 'card1', editLink: { href: '/edit1', label: 'Edit card 1' } }}
      {{ card: 'card2', editLink: { href: '/edit2', label: 'Edit card 2' } }}
    </ProfileCardList>,
  );
  expect(
    getAllByText(/[a-z0-9]+/i).map(({ textContent }) => textContent),
  ).toEqual(['card1', 'Edit', 'card2', 'Edit']);
});

it('applies the href and label to the link', () => {
  const { getByLabelText } = render(
    <ProfileCardList>
      {[{ card: 'card1', editLink: { href: '/edit1', label: 'Edit card 1' } }]}
    </ProfileCardList>,
  );
  expect(getByLabelText('Edit card 1')).toHaveAttribute('href', '/edit1');
});

it('disables the link if requested', () => {
  const { getByLabelText } = render(
    <ProfileCardList>
      {[
        {
          card: 'card1',
          editLink: { href: '/edit1', label: 'Edit card 1', enabled: false },
        },
      ]}
    </ProfileCardList>,
  );
  expect(getByLabelText('Edit card 1')).not.toHaveAttribute('href');
});

it('filters falsy children', () => {
  const { container } = render(
    <ProfileCardList>
      {[
        {
          card: 'card1',
        },
        false,
        undefined,
        null,
        {
          card: 'card2',
        },
      ]}
    </ProfileCardList>,
  );
  expect(container.querySelectorAll('body > div > div > div')).toHaveLength(2);
});
