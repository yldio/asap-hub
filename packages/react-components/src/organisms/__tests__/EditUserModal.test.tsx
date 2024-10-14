import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import EditUserModal from '../EditUserModal';

const renderModal = (children: ReactNode) =>
  render(<MemoryRouter>{children}</MemoryRouter>);

describe('EditUserModal', () => {
  const defaultProps = {
    title: 'Title',
    description: 'description',
    backHref: '',
    dirty: false,
  };
  it('renders a dialog with the given title and description', () => {
    renderModal(
      <EditUserModal
        {...defaultProps}
        title="Modal Title"
        description="Modal Description"
      />,
    );

    expect(screen.getByRole('dialog')).toContainElement(
      screen.getByRole('heading', { name: 'Modal Title' }),
    );
    expect(screen.getByRole('dialog')).toContainElement(
      screen.getByText('Modal Description'),
    );
  });

  it('renders buttonText if provided', () => {
    const { rerender, getByRole, queryByRole } = renderModal(
      <EditUserModal
        {...defaultProps}
        title="Modal Title"
        description="Modal Description"
      />,
    );

    expect(getByRole('dialog')).toContainElement(
      getByRole('button', { name: 'Save' }),
    );

    rerender(<EditUserModal {...defaultProps} buttonText="Publish" />);

    expect(getByRole('dialog')).toContainElement(
      getByRole('button', { name: 'Publish' }),
    );

    expect(getByRole('dialog')).not.toContainElement(
      queryByRole('button', { name: 'Save' }),
    );
  });
  it('renders a dialog with given children', () => {
    renderModal(
      <EditUserModal {...defaultProps}>{() => 'Content'}</EditUserModal>,
    );
    expect(screen.getByRole('dialog')).toContainElement(
      screen.getByText('Content'),
    );
  });
  it('calls the onSave function when the save button is pressed', async () => {
    const handleSave = jest.fn();
    renderModal(
      <EditUserModal {...defaultProps} onSave={handleSave}>
        {() => 'content'}
      </EditUserModal>,
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });
    userEvent.click(saveButton);
    expect(handleSave).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(saveButton).toBeEnabled());
  });
});
