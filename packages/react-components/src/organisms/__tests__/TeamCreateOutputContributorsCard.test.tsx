import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router-dom';
import { ComponentProps } from 'react';
import { waitFor } from '@testing-library/dom';

import TeamCreateOutputContributorsCard from '../TeamCreateOutputContributorsCard';

const props: ComponentProps<typeof TeamCreateOutputContributorsCard> = {
  authorSuggestions: jest.fn(),
  labSuggestions: jest.fn(),
  authors: [],
  labs: [],
  isSaving: false,
};

it('renders the contributors card form', async () => {
  const { getByText } = render(
    <StaticRouter>
      <TeamCreateOutputContributorsCard {...props} />
    </StaticRouter>,
  );
  expect(getByText(/Who were the contributors/i)).toBeVisible();
});

it('calls onChangeLabs function', async () => {
  const onChangeLabs = jest.fn();
  const labSuggestions = jest.fn();
  labSuggestions.mockResolvedValue([
    { label: 'One Lab', value: '1' },
    { label: 'Two Lab', value: '2' },
  ]);

  render(
    <StaticRouter>
      <TeamCreateOutputContributorsCard
        {...props}
        onChangeLabs={onChangeLabs}
        labSuggestions={labSuggestions}
      />
    </StaticRouter>,
  );

  userEvent.click(screen.getByLabelText(/Labs/i));
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  userEvent.click(screen.getByText('One Lab'));

  expect(onChangeLabs).toBeCalled();
});

it('calls onChangeAuthors function', async () => {
  const onChangeAuthors = jest.fn();
  const authorSuggestions = jest.fn();
  authorSuggestions.mockResolvedValue([
    { label: 'Author Two', value: '2' },
    { label: 'Author One', value: '1' },
  ]);

  render(
    <StaticRouter>
      <TeamCreateOutputContributorsCard
        {...props}
        onChangeAuthors={onChangeAuthors}
        authorSuggestions={authorSuggestions}
      />
    </StaticRouter>,
  );

  userEvent.click(screen.getByLabelText(/Authors/i));
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  userEvent.click(screen.getByText('Author Two'));

  expect(onChangeAuthors).toBeCalled();
});
