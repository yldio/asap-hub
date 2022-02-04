import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router-dom';

import TeamCreateOutputForm from '../TeamCreateOutputForm';
import { ENTER_KEYCODE } from '../../atoms/Dropdown';

const clickShare = () => {
  const button = screen.getByRole('button', { name: /Share/i });
  userEvent.click(button);
};

it('click on button calls callback method (keywords are optional)', async () => {
  const fn = jest.fn();
  render(
    <StaticRouter>
      <TeamCreateOutputForm onSave={fn} tagSuggestions={[]} />
    </StaticRouter>,
  );
  clickShare();
  waitFor(() => expect(fn).toHaveBeenCalledWith({ tags: [] }));
});

it('will pass tags added to onSave', () => {
  const fn = jest.fn();
  const { getByText } = render(
    <StaticRouter>
      <TeamCreateOutputForm onSave={fn} tagSuggestions={['Western Blot']} />
    </StaticRouter>,
  );
  userEvent.type(getByText(/add a keyword/i), 'Western');
  fireEvent.keyDown(getByText('Western Blot'), {
    keyCode: ENTER_KEYCODE,
  });
  clickShare();
  waitFor(() => expect(fn).toHaveBeenCalledWith({ tags: ['Western Blot'] }));
});
