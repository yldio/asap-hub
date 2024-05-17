import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ComponentProps } from 'react';
import { MemoryRouter, Route, Router, StaticRouter } from 'react-router-dom';
import { createMemoryHistory, History } from 'history';

import userEvent from '@testing-library/user-event';
import ManuscriptForm from '../ManuscriptForm';

let history!: History;

beforeEach(() => {
  history = createMemoryHistory();
});

const teamId = '42';

const defaultProps: ComponentProps<typeof ManuscriptForm> = {
  onSave: jest.fn(() => Promise.resolve()),
  onSuccess: jest.fn(),
  teamId,
};

it('renders the form', async () => {
  render(
    <StaticRouter>
      <ManuscriptForm {...defaultProps} />
    </StaticRouter>,
  );
  expect(
    screen.getByRole('heading', { name: /What are you sharing/i }),
  ).toBeVisible();
  expect(screen.getByRole('button', { name: /Submit/i })).toBeVisible();
});

it('title is sent on form submission', async () => {
  const onSave = jest.fn();
  render(
    <StaticRouter>
      <ManuscriptForm {...defaultProps} onSave={onSave} />
    </StaticRouter>,
  );

  userEvent.type(
    screen.getByRole('textbox', { name: /Title of Manuscript/i }),
    'manuscript title',
  );
  userEvent.click(screen.getByRole('button', { name: /Submit/i }));
  await waitFor(() => {
    expect(onSave).toHaveBeenCalledWith({ title: 'manuscript title', teamId });
  });
});

it('displays error message when manuscript title is missing', async () => {
  render(
    <StaticRouter>
      <ManuscriptForm {...defaultProps} />
    </StaticRouter>,
  );

  const input = screen.getByRole('textbox', { name: /Title of Manuscript/i });
  fireEvent.focusOut(input);
  expect(screen.getByText(/Please enter a title/i)).toBeVisible();

  userEvent.type(input, 'title');
  fireEvent.focusOut(input);
  expect(screen.queryByText(/Please enter a title/i)).toBeNull();
});

it('does not submit when required values are missing', async () => {
  const onSave = jest.fn();
  render(
    <StaticRouter>
      <ManuscriptForm {...defaultProps} onSave={onSave} />
    </StaticRouter>,
  );

  const submitButton = screen.getByRole('button', { name: /Submit/i });

  userEvent.click(submitButton);

  await waitFor(() => {
    expect(submitButton).toBeEnabled();
  });

  expect(
    screen.getByRole('textbox', { name: /Title of Manuscript/i }),
  ).toBeInvalid();
  expect(onSave).not.toHaveBeenCalled();
});

it('should go back when cancel button is clicked', () => {
  const { getByText } = render(
    <Router history={history}>
      <Route path="/form">
        <ManuscriptForm {...defaultProps} />
      </Route>
    </Router>,
    { wrapper: MemoryRouter },
  );

  history.push('/another-url');
  history.push('/form');

  const cancelButton = getByText(/cancel/i);
  expect(cancelButton).toBeInTheDocument();
  userEvent.click(cancelButton);

  expect(history.location.pathname).toBe('/another-url');
});
