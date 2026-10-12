import { mockActWarningsInConsole } from '@asap-hub/dom-test-utils';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { ServerValidationError } from '@asap-hub/model';
import { invalidEmailMessage } from '@asap-hub/react-components';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router';
import ContactInformationModal from '../ContactInformationModal';

describe('ContactInformationModal', () => {
  const getSaveButton = () => screen.getByRole('button', { name: 'Save' });

  beforeEach(jest.resetAllMocks);
  type ContactInformationModalProps = ComponentProps<
    typeof ContactInformationModal
  >;
  const defaultProps: ContactInformationModalProps = {
    ...gp2Fixtures.createUserResponse(),
    countryCodeSuggestions: [],
    backHref: '',
    onSave: jest.fn(),
  };

  const renderContactInformation = (
    overrides: Partial<ContactInformationModalProps> = {},
  ) =>
    render(
      <MemoryRouter>
        <ContactInformationModal {...defaultProps} {...overrides} />
      </MemoryRouter>,
    );

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
      screen.getByRole('combobox', { name: /country code \(optional\)/i }),
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
    const alternativeEmail = 'goncalo@fpf.pt';
    const telephone = {
      countryCode: '+351',
      number: '911111111',
    };
    renderContactInformation({
      email,
      alternativeEmail,
      telephone,
      onSave,
    });
    await userEvent.click(getSaveButton());
    expect(onSave).toHaveBeenCalledWith({
      alternativeEmail,
      telephone,
    });
    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });

  it('calls onSave with the updated fields', async () => {
    const onSave = jest.fn();
    const email = 'goncalo.ramos@fpf.pt';
    const alternativeEmail = 'ramos.goncalo@fpf.pt';
    const countryCode = '+351';
    const number = '912345678';
    renderContactInformation({
      email,
      alternativeEmail: '',
      telephone: undefined,
      onSave,
      countryCodeSuggestions: [{ dialCode: '+351', name: 'Portugal' }],
    });

    await userEvent.type(
      screen.getByRole('textbox', {
        name: /alternative email \(optional\)/i,
      }),
      alternativeEmail,
    );

    await userEvent.click(
      screen.getByRole('combobox', {
        name: /country code \(optional\)/i,
      }),
    );
    await userEvent.click(screen.getByText('Portugal (+351)'));

    await userEvent.type(
      screen.getByRole('textbox', {
        name: /telephone number \(optional\)/i,
      }),
      number,
    );

    await userEvent.click(getSaveButton());
    expect(onSave).toHaveBeenCalledWith({
      alternativeEmail,
      telephone: {
        countryCode,
        number,
      },
    });
    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });

  // test@test and the apostrophe satisfy the browser's own address check but not
  // the GP2 content model, so before the pattern they reached Contentful.
  it.each(['test@test', "o'brien@x.com"])(
    'does not allow %p as a secondary email',
    async (alternativeEmail) => {
      const consoleErrorSpy = mockActWarningsInConsole('error');
      const onSave = jest.fn();
      renderContactInformation({
        email: 'goncalo.ramos@fpf.pt',
        alternativeEmail: '',
        telephone: undefined,
        onSave,
      });

      await userEvent.type(
        screen.getByRole('textbox', {
          name: /alternative email \(optional\)/i,
        }),
        alternativeEmail,
      );

      await userEvent.click(getSaveButton());
      expect(screen.getByText(invalidEmailMessage)).toBeVisible();
      expect(onSave).not.toHaveBeenCalled();
      await waitFor(() => expect(getSaveButton()).toBeEnabled());
      consoleErrorSpy.mockRestore();
    },
  );

  // The API rejects what the browser cannot catch. Without this the save
  // reported only the generic toast, with nothing marking the field.
  // The browser's own messages name the actual fault, so `pattern` must not
  // swallow them by reporting everything as a generic malformed address.
  it('leaves the browser to explain the faults it catches itself', async () => {
    const consoleErrorSpy = mockActWarningsInConsole('error');
    const onSave = jest.fn();
    renderContactInformation({
      alternativeEmail: '',
      telephone: undefined,
      onSave,
    });

    const field = screen.getByRole('textbox', {
      name: /alternative email \(optional\)/i,
    }) as HTMLInputElement;
    await userEvent.type(field, 'not-an-email-address');
    await userEvent.click(getSaveButton());

    expect(field.validity.typeMismatch).toBe(true);
    expect(screen.queryByText(invalidEmailMessage)).not.toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('shows the message on the field when the API rejects it', async () => {
    const consoleErrorSpy = mockActWarningsInConsole('error');
    renderContactInformation({
      alternativeEmail: '',
      telephone: undefined,
      onSave: () =>
        Promise.reject(
          new ServerValidationError([
            {
              instancePath: '/alternativeEmail',
              keyword: 'pattern',
              params: {},
              schemaPath: '#/properties/alternativeEmail/pattern',
            },
          ]),
        ),
    });

    await userEvent.type(
      screen.getByRole('textbox', { name: /alternative email \(optional\)/i }),
      'a@b.com',
    );
    await userEvent.click(getSaveButton());

    expect(await screen.findByText(invalidEmailMessage)).toBeVisible();
    // The field message is the whole report; the toast would be a second,
    // vaguer message for the same problem.
    expect(
      screen.queryByText(/unable to save your changes/i),
    ).not.toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });

  // Anything the modal cannot pin to the field has to keep the toast, or the
  // save fails with no signal at all.
  // A rejection that is not a validation error at all — a network failure, say —
  // must pass straight through to EditModal's generic report.
  it('reports generically when the save fails for an unrelated reason', async () => {
    const consoleErrorSpy = mockActWarningsInConsole('error');
    renderContactInformation({
      alternativeEmail: '',
      telephone: undefined,
      onSave: () => Promise.reject(new Error('network down')),
    });

    await userEvent.type(
      screen.getByRole('textbox', { name: /alternative email \(optional\)/i }),
      'a@b.com',
    );
    await userEvent.click(getSaveButton());

    expect(
      await screen.findByText(/unable to save your changes/i),
    ).toBeVisible();
    consoleErrorSpy.mockRestore();
  });

  it('sends null when the field is cleared', async () => {
    const onSave = jest.fn().mockResolvedValue(undefined);
    renderContactInformation({
      alternativeEmail: 'previous@example.com',
      telephone: undefined,
      onSave,
    });

    await userEvent.clear(
      screen.getByRole('textbox', { name: /alternative email \(optional\)/i }),
    );
    await userEvent.click(getSaveButton());

    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ alternativeEmail: null }),
      ),
    );
  });

  it('reports generically when the rejection names another field', async () => {
    const consoleErrorSpy = mockActWarningsInConsole('error');
    renderContactInformation({
      alternativeEmail: '',
      telephone: undefined,
      onSave: () =>
        Promise.reject(
          new ServerValidationError([
            {
              instancePath: '/biography',
              keyword: 'pattern',
              params: {},
              schemaPath: '#/properties/biography/pattern',
            },
          ]),
        ),
    });

    await userEvent.type(
      screen.getByRole('textbox', { name: /alternative email \(optional\)/i }),
      'a@b.com',
    );
    await userEvent.click(getSaveButton());

    expect(
      await screen.findByText(/unable to save your changes/i),
    ).toBeVisible();
    consoleErrorSpy.mockRestore();
  });

  it('does not allow invalid telephone number', async () => {
    const consoleErrorSpy = mockActWarningsInConsole('error');
    const onSave = jest.fn();
    const email = 'goncalo.ramos@fpf.pt';
    const number = 'invalid-number';
    renderContactInformation({
      email,
      alternativeEmail: '',
      telephone: undefined,
      onSave,
    });

    await userEvent.type(
      screen.getByRole('textbox', {
        name: /telephone number \(optional\)/i,
      }),
      number,
    );

    await userEvent.click(getSaveButton());
    expect(
      screen.getByText(/please enter a valid telephone number/i),
    ).toBeVisible();
    expect(onSave).not.toHaveBeenCalled();
    await waitFor(() => expect(getSaveButton()).toBeEnabled());
    consoleErrorSpy.mockRestore();
  });
});
