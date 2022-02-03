import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TeamCreateOutputForm from '../TeamCreateOutputForm';
import { ENTER_KEYCODE } from '../../atoms/Dropdown';

const clickShare = () => {
  const button = screen.getByRole('button', { name: /Share/i });
  userEvent.click(button);
};

it('click on button calls callback method (keywords are optional)', () => {
  const spyOnCreate = jest.fn();
  render(<TeamCreateOutputForm onCreate={spyOnCreate} />);
  clickShare();
  expect(spyOnCreate).toHaveBeenCalledWith({ keywords: [] });
});

it('will pass keywords added to onCreate', () => {
  const spyOnCreate = jest.fn();
  const { getByText } = render(<TeamCreateOutputForm onCreate={spyOnCreate} />);
  userEvent.type(getByText(/add a keyword/i), 'Western');
  fireEvent.keyDown(getByText('Western Blot'), {
    keyCode: ENTER_KEYCODE,
  });
  clickShare();
  expect(spyOnCreate).toHaveBeenCalledWith({ keywords: ['Western Blot'] });
});
