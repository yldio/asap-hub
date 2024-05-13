import { act, render, screen, waitFor } from '@testing-library/react';
import { ComponentProps } from 'react';
import { StaticRouter } from 'react-router-dom';

import userEvent from '@testing-library/user-event';
import ManuscriptForm from '../ManuscriptForm';

const defaultProps: ComponentProps<typeof ManuscriptForm> = {
  onSave: jest.fn(() => Promise.resolve()),
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

it('title submission', async () => {
  const onSave = jest.fn();
  await act(async () => {
    render(
      <StaticRouter>
        <ManuscriptForm onSave={onSave} />
      </StaticRouter>,
    );
  });

  userEvent.type(
    screen.getByRole('textbox', { name: /Title of Manuscript/i }),
    'manuscript title',
  );
  userEvent.click(screen.getByRole('button', { name: /Submit/i }));
  await waitFor(() => {
    expect(onSave).toHaveBeenCalledWith({ title: 'manuscript title' });
  });
});
