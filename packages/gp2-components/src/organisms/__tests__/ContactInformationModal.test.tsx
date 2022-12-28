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
        name: 'Intitutional Email Need to change something? Contact techsupport@gp2.org',
      }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', {
        name: 'Intitutional Email Need to change something? Contact techsupport@gp2.org',
      }),
    ).toBeDisabled();
    expect(
      screen.getByRole('textbox', {
        name: 'Alternative Email (optional) An alternative way for members to contact you. This will not affect the way that you login.',
      }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: 'Country Code (optional)' }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', {
        name: 'Telephone Number (optional) Please note: this will only be visible to admins.',
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
      secondaryEmail,
      telephone,
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
        name: 'Alternative Email (optional) An alternative way for members to contact you. This will not affect the way that you login.',
      }),
      secondaryEmail,
    );

    userEvent.type(
      screen.getByRole('textbox', {
        name: 'Country Code (optional)',
      }),
      countryCode,
    );

    userEvent.type(
      screen.getByRole('textbox', {
        name: 'Telephone Number (optional) Please note: this will only be visible to admins.',
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
});
