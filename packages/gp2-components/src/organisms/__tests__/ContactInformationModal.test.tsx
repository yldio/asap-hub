import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import ContactInformationModal from '../ContactInformationModal';

describe('ContactInformationModal', () => {
  const getSaveButton = () => screen.getByRole('button', { name: 'Save' });

  beforeEach(jest.resetAllMocks);
  type ContactInformationModalProps = ComponentProps<
    typeof ContactInformationModal
  >;
  const defaultProps: ContactInformationModalProps = {
    ...gp2Fixtures.createUserResponse(),
    backHref: '',
    onSave: jest.fn(),
  };

  const renderContactInformation = (
    overrides: Partial<ContactInformationModalProps> = {},
  ) =>
    render(<ContactInformationModal {...defaultProps} {...overrides} />, {
      wrapper: MemoryRouter,
    });

  it('renders a dialog with the right title', () => {
    renderContactInformation();
    expect(screen.getByRole('dialog')).toContainElement(
      screen.getByRole('heading', { name: 'Contact Information' }),
    );
  });

  it('renders email, secondary email and telephone country code and number', () => {
    renderContactInformation();
    expect(
      screen.getByRole('textbox', {
        name: /institutional email/i,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', {
        name: /institutional email/i,
      }),
    ).toBeDisabled();
    expect(
      screen.getByRole('textbox', {
        name: /alternative email/i,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: /country code \(optional\)/i }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', {
        name: /telephone number \(optional\)/i,
      }),
    ).toBeVisible();
  });

  it('calls onSave with the right arguments', async () => {
    const onSave = jest.fn();
    const email = 'goncalo.ramos@fpf.pt';
    const secondaryEmail = '';
    const telephone = {
      countryCode: '',
      number: '',
    };
    renderContactInformation({
      email,
      secondaryEmail,
      telephone,
      onSave,
    });
    userEvent.click(getSaveButton());
    expect(onSave).toHaveBeenCalledWith({
      secondaryEmail: undefined,
      telephone: {
        countryCode: undefined,
        number: undefined,
      },
    });
    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });

  it('calls onSave with the updated fields', async () => {
    const onSave = jest.fn();
    const email = 'goncalo.ramos@fpf.pt';
    const secondaryEmail = 'ramos.goncalo@fpf.pt';
    const countryCode = '+351';
    const number = '912345678';
    renderContactInformation({
      email,
      secondaryEmail: '',
      telephone: undefined,
      onSave,
    });

    userEvent.type(
      screen.getByRole('textbox', {
        name: /alternative email \(optional\)/i,
      }),
      secondaryEmail,
    );

    userEvent.type(
      screen.getByRole('textbox', {
        name: /country code \(optional\)/i,
      }),
      countryCode,
    );

    userEvent.type(
      screen.getByRole('textbox', {
        name: /telephone number \(optional\)/i,
      }),
      number,
    );

    userEvent.click(getSaveButton());
    expect(onSave).toHaveBeenCalledWith({
      secondaryEmail,
      telephone: {
        countryCode,
        number,
      },
    });
    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });
  it('does not allow invalid secondary email', async () => {
    const onSave = jest.fn();
    const email = 'goncalo.ramos@fpf.pt';
    const secondaryEmail = 'not-an-email-address';
    renderContactInformation({
      email,
      secondaryEmail: '',
      telephone: undefined,
      onSave,
    });

    userEvent.type(
      screen.getByRole('textbox', {
        name: /alternative email \(optional\)/i,
      }),
      secondaryEmail,
    );

    userEvent.click(getSaveButton());
    expect(
      screen.getByText(/please enter a valid email address/i),
    ).toBeVisible();
    expect(onSave).not.toHaveBeenCalled();
    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });
  it('does not allow invalid telephone country code', async () => {
    const onSave = jest.fn();
    const email = 'goncalo.ramos@fpf.pt';
    const countryCode = 'invalid-code';
    renderContactInformation({
      email,
      secondaryEmail: '',
      telephone: undefined,
      onSave,
    });

    userEvent.type(
      screen.getByRole('textbox', {
        name: /country code \(optional\)/i,
      }),
      countryCode,
    );

    userEvent.click(getSaveButton());
    expect(
      screen.getByText(/please enter a valid telephone country code/i),
    ).toBeVisible();
    expect(onSave).not.toHaveBeenCalled();
    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });
  it('does not allow invalid telephone number', async () => {
    const onSave = jest.fn();
    const email = 'goncalo.ramos@fpf.pt';
    const number = 'invalid-number';
    renderContactInformation({
      email,
      secondaryEmail: '',
      telephone: undefined,
      onSave,
    });

    userEvent.type(
      screen.getByRole('textbox', {
        name: /telephone number \(optional\)/i,
      }),
      number,
    );

    userEvent.click(getSaveButton());
    expect(
      screen.getByText(/please enter a valid telephone number/i),
    ).toBeVisible();
    expect(onSave).not.toHaveBeenCalled();
    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });
});
