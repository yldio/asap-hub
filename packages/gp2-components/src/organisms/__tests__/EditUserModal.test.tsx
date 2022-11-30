import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import EditUserModal from '../EditUserModal';

describe('EditUserModal', () => {
  const defaultProps = {
    title: 'Title',
    description: 'description',
    backHref: '',
    dirty: false,
    onSave: jest.fn(),
    children: () => null,
  };
  it('renders a dialog with the given title and description', () => {
    render(
      <EditUserModal
        {...defaultProps}
        title="Modal Title"
        description="Modal Description"
      />,
      { wrapper: MemoryRouter },
    );

    expect(screen.getByRole('dialog')).toContainElement(
      screen.getByRole('heading', { name: 'Modal Title' }),
    );
    expect(screen.getByRole('dialog')).toContainElement(
      screen.getByText('Modal Description'),
    );
  });
  it('renders a dialog with given children', () => {
    render(<EditUserModal {...defaultProps}>{() => 'Content'}</EditUserModal>, {
      wrapper: MemoryRouter,
    });
    expect(screen.getByRole('dialog')).toContainElement(
      screen.getByText('Content'),
    );
  });
  it('calls the onSave function when the save button is pressed', () => {
    const handleSave = jest.fn();
    render(
      <EditUserModal {...defaultProps} onSave={handleSave}>
        {() => 'content'}
      </EditUserModal>,
      {
        wrapper: MemoryRouter,
      },
    );
    userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(handleSave).toBeCalledTimes(1);
  });
});
