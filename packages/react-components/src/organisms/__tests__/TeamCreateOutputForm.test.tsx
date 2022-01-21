import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TeamCreateOutputForm from '../TeamCreateOutputForm';

describe('TeamCreateOutputForm', () => {
  test('click on button calls callback method', () => {
    const spyOnCreate = jest.fn();
    render(<TeamCreateOutputForm onCreate={spyOnCreate} />);
    const button = screen.getByRole('button', { name: /Share/i });
    userEvent.click(button);
    expect(spyOnCreate).toHaveBeenCalled();
  });
});
