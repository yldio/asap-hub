import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import BiographyModal from '../BiographyModal';

describe('BiographyModal', () => {
  const getSaveButton = () => screen.getByRole('button', { name: 'Save' });

  beforeEach(jest.resetAllMocks);
  type BiographyModalProps = ComponentProps<typeof BiographyModal>;
  const defaultProps: BiographyModalProps = {
    ...gp2Fixtures.createUserResponse(),
    backHref: '',
    onSave: jest.fn(),
  };

  const renderModal = (overrides: Partial<BiographyModalProps> = {}) =>
    render(
      <MemoryRouter>
        <BiographyModal {...defaultProps} {...overrides} />
      </MemoryRouter>,
    );

  it('renders a dialog with the right title', () => {
    renderModal();
    expect(screen.getByRole('dialog')).toContainElement(
      screen.getByRole('heading', { name: 'Biography' }),
    );
  });

  it('renders biography', () => {
    renderModal();
    expect(
      screen.getByRole('textbox', {
        name: 'Background (Required)',
      }),
    ).toBeVisible();
  });

  it('calls onSave with the right arguments', async () => {
    const onSave = jest.fn();
    const biography = 'this is a biography';
    renderModal({
      biography,
      onSave,
    });
    userEvent.click(getSaveButton());
    expect(onSave).toHaveBeenCalledWith({
      biography,
    });
    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });

  it('calls onSave with the updated fields', async () => {
    const onSave = jest.fn();
    const biography = 'this is a biography';
    renderModal({
      biography: '',
      onSave,
    });

    userEvent.type(
      screen.getByRole('textbox', {
        name: 'Background (Required)',
      }),
      biography,
    );

    userEvent.click(getSaveButton());
    expect(onSave).toHaveBeenCalledWith({
      biography,
    });
    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });
});
