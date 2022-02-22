import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router-dom';
import { ComponentProps } from 'react';
import { fireEvent, waitFor } from '@testing-library/dom';

import TeamCreateOutputForm from '../TeamCreateOutputForm';
import { ENTER_KEYCODE } from '../../atoms/Dropdown';

const props: ComponentProps<typeof TeamCreateOutputForm> = {
  tagSuggestions: [],
  type: 'Article',
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
  render(
    <StaticRouter>
      <TeamCreateOutputForm {...props} type="Lab Resource" onSave={saveFn} />
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
  clickShare();

  await waitFor(() => {
    expect(saveFn).toHaveBeenCalledWith({
      tags: [],
      link: 'http://example.com',
      title: 'example title',
      description: 'example description',
      subTypes: ['Animal Model'],
    });
    expect(screen.getByRole('button', { name: /Share/i })).toBeEnabled();
  });
});
