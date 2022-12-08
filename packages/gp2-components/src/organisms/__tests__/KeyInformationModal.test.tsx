import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import KeyInformationModal from '../KeyInformationModal';

describe('KeyInformatiomModal', () => {
  const defaultProps = {
    firstName: 'Tony',
    lastName: 'Stark',
    backHref: '',
    onSave: jest.fn(),
  };
  it('renders a dialog with the right title', () => {
    render(<KeyInformationModal {...defaultProps} />, {
      wrapper: MemoryRouter,
    });
    expect(screen.getByRole('dialog')).toContainElement(
      screen.getByRole('heading', { name: 'Key Information' }),
    );
  });
  it('renders the firstName and lastName fields', () => {
    render(<KeyInformationModal {...defaultProps} />, {
      wrapper: MemoryRouter,
    });
    expect(
      screen.getByRole('textbox', { name: 'First Name (Required)' }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: 'Last Name (Required)' }),
    ).toBeVisible();
  });
  it('calls onSave with the right arguments', async () => {
    const onSave = jest.fn();
    render(
      <KeyInformationModal
        {...defaultProps}
        firstName="Gonçalo"
        lastName="Ramos"
        onSave={onSave}
      />,
      {
        wrapper: MemoryRouter,
      },
    );
    userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSave).toHaveBeenCalledWith({
      firstName: 'Gonçalo',
      lastName: 'Ramos',
    });
  });
  it('calls onSave with the updated fields', async () => {
    const onSave = jest.fn();
    render(
      <KeyInformationModal
        {...defaultProps}
        firstName="Gonçalo"
        lastName="Ramos"
        onSave={onSave}
      />,
      {
        wrapper: MemoryRouter,
      },
    );
    await userEvent.type(
      screen.getByRole('textbox', { name: 'First Name (Required)' }),
      's',
    );
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Last Name (Required)' }),
      's',
    );
    userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSave).toHaveBeenCalledWith({
      firstName: 'Gonçalos',
      lastName: 'Ramoss',
    });
  });
});
