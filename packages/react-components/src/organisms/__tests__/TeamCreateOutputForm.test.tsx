import { render, screen, fireEvent } from '@testing-library/react';
import TeamCreateOutputForm from '../TeamCreateOutputForm';

describe('TeamCreateOutputForm', () => {
  test('click on button calls callback method', () => {
    const spyOnCreate = jest.fn();
    render(<TeamCreateOutputForm onCreate={spyOnCreate} />);
    fireEvent.click(screen.getByText('Share'));

    expect(spyOnCreate).toHaveBeenCalled();
  });
});
