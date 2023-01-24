import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { StaticRouter } from 'react-router-dom';
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
      <StaticRouter>
        <BiographyModal {...defaultProps} {...overrides} />
      </StaticRouter>,
    );

  it('renders a dialog with the right title', () => {
    renderModal();
    expect(screen.getByRole('dialog')).toContainElement(
      screen.getByRole('heading', { name: 'Biography' }),
    );
  });

  it.each`
    biography     | expected
    ${undefined}  | ${''}
    ${'some bio'} | ${'some bio'}
  `('renders biography with value "$expected"', ({ biography, expected }) => {
    renderModal({ biography });
    const textbox = screen.getByRole('textbox', {
      name: /Background/i,
    });
    expect(textbox).toBeVisible();
    expect(textbox).toHaveValue(expected);
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
        name: /Background/i,
      }),
      biography,
    );

    userEvent.click(getSaveButton());
    expect(onSave).toHaveBeenCalledWith({
      biography,
    });
    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });
  it('shows validation message', async () => {
    const onSave = jest.fn();
    renderModal({
      biography: '',
      onSave,
    });

    userEvent.click(getSaveButton());
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByText('Please add your biography')).toBeVisible();
    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });
});
