import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router-dom';
import { ComponentProps } from 'react';
import { fireEvent, waitFor } from '@testing-library/dom';
import { createTeamResponse, createUserResponse } from '@asap-hub/fixtures';

import TeamCreateOutputForm from '../TeamCreateOutputForm';
import { ENTER_KEYCODE } from '../../atoms/Dropdown';

const props: ComponentProps<typeof TeamCreateOutputForm> = {
  tagSuggestions: [],
  type: 'Article',
  team: createTeamResponse(),
};

const clickShare = () => {
  const button = screen.getByRole('button', { name: /Share/i });
  userEvent.click(button);
};

it('renders the form', async () => {
  const { getByText } = render(
    <StaticRouter>
      <TeamCreateOutputForm {...props} />
    </StaticRouter>,
  );
  expect(getByText(/What are you sharing/i)).toBeVisible();
});

it('displays current team within the form', async () => {
  const { getByText } = render(
    <StaticRouter>
      <TeamCreateOutputForm
        {...props}
        team={{ ...createTeamResponse(), displayName: 'example team' }}
      />
    </StaticRouter>,
  );
  expect(getByText('example team')).toBeVisible();
});

it('does not save when the form is missing data', async () => {
  const saveFn = jest.fn();
  render(
    <StaticRouter>
      <TeamCreateOutputForm {...props} onSave={saveFn} />
    </StaticRouter>,
  );
  clickShare();
  expect(saveFn).not.toHaveBeenCalled();
});

it('can submit a form when form data is valid', async () => {
  const saveFn = jest.fn();
  const getLabSuggestions = jest.fn();
  const getAuthorSuggestions = jest.fn();
  getLabSuggestions.mockResolvedValue([
    { label: 'One Lab', value: '1' },
    { label: 'Two Lab', value: '2' },
  ]);
  getAuthorSuggestions.mockResolvedValue([
    {
      user: { ...createUserResponse(), displayName: 'Author Two' },
      label: 'Author Two',
      value: '2',
    },
    {
      user: {
        ...createUserResponse(),
        email: undefined,
        displayName: 'Author One',
      },
      label: 'Author One (Non CRN)',
      value: '1',
    },
  ]);
  render(
    <StaticRouter>
      <TeamCreateOutputForm
        {...props}
        team={{ ...createTeamResponse(), id: 'TEAMID' }}
        type="Lab Resource"
        onSave={saveFn}
        getLabSuggestions={getLabSuggestions}
        getAuthorSuggestions={getAuthorSuggestions}
      />
    </StaticRouter>,
  );

  fireEvent.change(screen.getByLabelText(/url/i), {
    target: { value: 'http://example.com' },
  });
  fireEvent.change(screen.getByLabelText(/title/i), {
    target: { value: 'example title' },
  });
  fireEvent.change(screen.getByLabelText(/description/i), {
    target: { value: 'example description' },
  });
  userEvent.type(screen.getByLabelText(/type/i), 'Animal Model');
  fireEvent.keyDown(screen.getByLabelText(/type/i), {
    keyCode: ENTER_KEYCODE,
  });

  fireEvent.click(
    screen
      .getByRole('group', { name: /funded by ASAP/i })
      .querySelectorAll('input')[0]!,
  );

  fireEvent.click(
    screen
      .getByRole('group', { name: /used in a publication/i })
      .querySelectorAll('input')[0]!,
  );

  fireEvent.click(
    screen
      .getByRole('group', { name: /sharing status/i })
      .querySelectorAll('input')[1]!,
  );

  userEvent.type(screen.getByLabelText(/date published/i), '2022-03-24');

  userEvent.click(screen.getByLabelText(/Labs/i));
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  userEvent.click(screen.getByText('One Lab'));

  userEvent.click(screen.getByLabelText(/Authors/i));
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  userEvent.click(screen.getByText(/Author One/i));

  userEvent.click(screen.getByLabelText(/Authors/i));
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  userEvent.click(screen.getByText('Author Two'));

  clickShare();

  expect(screen.getByRole('button', { name: /Share/i })).not.toBeEnabled();
  expect(screen.getByRole('button', { name: /Cancel/i })).not.toBeEnabled();

  await waitFor(() => {
    expect(saveFn).toHaveBeenCalledWith({
      tags: [],
      link: 'http://example.com',
      title: 'example title',
      description: 'example description',
      subTypes: ['Animal Model'],
      labs: ['1'],
      authors: [
        {
          externalAuthorId: '1',
        },
        {
          userId: '2',
        },
      ],
      teams: ['TEAMID'],
      asapFunded: true,
      usedInPublication: true,
      sharingStatus: 'Public',
      publishDate: new Date('2022-03-24').toISOString(),
    });
    expect(screen.getByRole('button', { name: /Share/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeEnabled();
  });
});

it('displays proper message when no author is found', async () => {
  const getAuthorSuggestions = jest.fn();
  getAuthorSuggestions.mockResolvedValue([]);
  const { getByText } = render(
    <StaticRouter>
      <TeamCreateOutputForm
        {...props}
        getAuthorSuggestions={getAuthorSuggestions}
      />
    </StaticRouter>,
  );
  userEvent.click(screen.getByLabelText(/Authors/i));
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  expect(getByText(/Sorry, no authors match/i)).toBeVisible();
});

it('displays proper message when no lab is found', async () => {
  const getLabSuggestions = jest.fn();
  getLabSuggestions.mockResolvedValue([]);
  const { getByText } = render(
    <StaticRouter>
      <TeamCreateOutputForm {...props} getLabSuggestions={getLabSuggestions} />
    </StaticRouter>,
  );
  userEvent.click(screen.getByLabelText(/Labs/i));
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  expect(getByText(/Sorry, no labs match/i)).toBeVisible();
});
