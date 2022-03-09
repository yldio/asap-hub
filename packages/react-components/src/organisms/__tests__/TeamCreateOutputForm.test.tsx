import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router-dom';
import { ComponentProps } from 'react';
import { fireEvent, waitFor } from '@testing-library/dom';
import { createTeamResponse } from '@asap-hub/fixtures';

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
    { label: 'Author Two', value: '2' },
    { label: 'Author One', value: '1' },
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

  userEvent.click(screen.getByLabelText(/Labs/i));
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  userEvent.click(screen.getByText('One Lab'));

  userEvent.click(screen.getByLabelText(/Authors/i));
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  userEvent.click(screen.getByText('Author Two'));

  clickShare();

  await waitFor(() => {
    expect(saveFn).toHaveBeenCalledWith({
      tags: [],
      link: 'http://example.com',
      title: 'example title',
      description: 'example description',
      subTypes: ['Animal Model'],
      labs: ['1'],
      authors: ['2'],
      teams: ['TEAMID'],
    });
    expect(screen.getByRole('button', { name: /Share/i })).toBeEnabled();
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
