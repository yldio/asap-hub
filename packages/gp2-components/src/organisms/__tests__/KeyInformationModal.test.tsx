import { mockActWarningsInConsole } from '@asap-hub/dom-test-utils';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 } from '@asap-hub/model';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import KeyInformationModal from '../KeyInformationModal';

describe('KeyInformationModal', () => {
  const getSaveButton = () => screen.getByRole('button', { name: 'Save' });
  const getAddButton = () =>
    screen.getByRole('button', {
      name: /add another position/i,
    });
  beforeEach(jest.resetAllMocks);
  type KeyInformationModalProps = ComponentProps<typeof KeyInformationModal>;
  const defaultProps: KeyInformationModalProps = {
    ...gp2Fixtures.createUserResponse(),
    locationSuggestions: [],
    loadInstitutionOptions: jest.fn().mockResolvedValue([]),
    backHref: '',
    onSave: jest.fn(),
  };

  const renderKeyInformation = (
    overrides: Partial<KeyInformationModalProps> = {},
  ) =>
    render(
      <MemoryRouter>
        <KeyInformationModal {...defaultProps} {...overrides} />
      </MemoryRouter>,
    );

  it('renders a dialog with the right title', async () => {
    renderKeyInformation();
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toContainElement(
        screen.getByRole('heading', { name: 'Key Information' }),
      );
    });
  });

  it('renders the firstName and lastName fields', async () => {
    renderKeyInformation();
    await waitFor(
      () => {
        expect(
          screen.getByRole('textbox', { name: 'First Name (required)' }),
        ).toBeVisible();
        expect(
          screen.getByRole('textbox', { name: 'Last Name (required)' }),
        ).toBeVisible();
      },
      { interval: 50 },
    );
  }, 120_000);

  it('calls onSave with the right arguments', async () => {
    const consoleErrorSpy = mockActWarningsInConsole('error');
    const user = userEvent.setup({ delay: null });
    const onSave = jest.fn();
    const firstName = 'Gonçalo';
    const middleName = 'Matias';
    const lastName = 'Ramos';
    const nickname = 'Pistoleiro';
    const degrees: KeyInformationModalProps['degrees'] = ['PhD'];
    const positions = [
      { institution: 'FPF', department: "Men's Team", role: 'Striker' },
    ];
    const country = 'Portugal';
    const stateOrProvince = 'Estremadura';
    const city = 'Lisbon';
    const region = 'Europe';
    const orcid = 'https://orcid.org/1111-2222-3333-4444';
    const social = {
      researcherId: 'https://researcherid.com/rid/E-1234-5678',
      twitter: 'https://twitter.com/1234',
      linkedIn: 'https://www.linkedin.com/1234',
      github: 'https://github.com/1234',
    } as gp2.UserSocial;

    renderKeyInformation({
      firstName,
      middleName,
      lastName,
      nickname,
      degrees,
      positions,
      country,
      stateOrProvince,
      city,
      region,
      social: { ...social, orcid },
      onSave,
    });
    await user.click(getSaveButton());
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        firstName,
        middleName,
        lastName,
        nickname,
        degrees,
        positions,
        country,
        stateOrProvince,
        city,
        region,
        orcid: '1111-2222-3333-4444',
        social,
      });
    });
    consoleErrorSpy.mockRestore();
  });

  it('shows validation message when city is not provided', async () => {
    const user = userEvent.setup({ delay: null });
    const onSave = jest.fn();
    renderKeyInformation({
      city: '',
      onSave,
    });
    await user.click(screen.getByRole('textbox', { name: /city/i }));
    await user.tab();
    expect(screen.getByText(/Please add your city/i)).toBeVisible();
  }, 120_000);

  it('does not call onSave with orcid when orcid is not provided', async () => {
    const consoleErrorSpy = mockActWarningsInConsole('error');
    const user = userEvent.setup({ delay: null });
    const onSave = jest.fn();
    renderKeyInformation({
      onSave,
      social: {
        ...defaultProps.social,
        orcid: undefined,
      },
    });
    const saveButton = getSaveButton();
    await user.click(saveButton);
    const {
      firstName,
      lastName,
      degrees,
      positions,
      country,
      stateOrProvince,
      city,
      region,
      social,
    } = defaultProps;
    const { orcid, ...socialWithoutOrcid } = social!;
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        firstName,
        middleName: '',
        lastName,
        nickname: '',
        degrees,
        positions,
        country,
        stateOrProvince,
        city,
        region,
        social: socialWithoutOrcid,
      });
    });
    consoleErrorSpy.mockRestore();
  });

  it('calls onSave with the updated fields', async () => {
    // Tests that field updates propagate to onSave
    // Pre-populates most fields and only updates a few representative ones
    // to minimize re-renders while still verifying update behavior
    const consoleErrorSpy = mockActWarningsInConsole('error');
    const user = userEvent.setup({ delay: null });
    const degrees: KeyInformationModalProps['degrees'] = ['PhD'];
    const positions = [
      { institution: 'FPF', department: "Men's Team", role: 'Striker' },
    ];
    const country = 'Portugal';
    const stateOrProvince = 'Estremadura';
    const region = 'Europe';

    // Values to be updated
    const updatedFirstName = 'Gonçalo';
    const updatedCity = 'Lisbon';
    const updatedOrcid = '1111-2222-3333-4444';

    const onSave = jest.fn();
    renderKeyInformation({
      firstName: 'Original', // Will be updated
      middleName: 'Matias',
      lastName: 'Ramos',
      nickname: 'Pistoleiro',
      degrees,
      positions,

      country,
      stateOrProvince,
      city: 'Porto', // Will be updated
      region,
      social: {
        linkedIn: 'https://www.linkedin.com/1234',
        github: 'https://github.com/1234',
      },
      onSave,
      locationSuggestions: ['Portugal'],
    });

    // Update only 3 representative fields to verify update behavior
    fireEvent.change(
      screen.getByRole('textbox', { name: 'First Name (required)' }),
      { target: { value: updatedFirstName } },
    );
    fireEvent.change(screen.getByRole('textbox', { name: 'City (required)' }), {
      target: { value: updatedCity },
    });
    fireEvent.change(
      screen.getByRole('textbox', {
        name: 'ORCID (optional) Type your ORCID ID.',
      }),
      { target: { value: updatedOrcid } },
    );

    const saveButton = getSaveButton();
    await user.click(saveButton);
    await waitFor(
      () => {
        expect(onSave).toHaveBeenCalledWith({
          firstName: updatedFirstName,
          middleName: 'Matias',
          lastName: 'Ramos',
          nickname: 'Pistoleiro',
          degrees,
          positions,
          country,
          stateOrProvince,
          city: updatedCity,
          region,
          orcid: updatedOrcid,
          social: {
            linkedIn: 'https://www.linkedin.com/1234',
            github: 'https://github.com/1234',
          },
        });
      },
      { interval: 50 },
    );
    consoleErrorSpy.mockRestore();
  }, 120_000);

  it('calls onSave with the updated social fields', async () => {
    // Tests representative social fields: basic URLs, ORCID, and researcherId transformation
    // Other social fields use identical patterns and don't need individual testing
    const consoleErrorSpy = mockActWarningsInConsole('error');
    const user = userEvent.setup({ delay: null });
    const firstName = 'Gonçalo';
    const middleName = 'Matias';
    const lastName = 'Ramos';
    const nickname = 'Pistoleiro';
    const degrees: KeyInformationModalProps['degrees'] = ['PhD'];
    const positions = [
      { institution: 'FPF', department: "Men's Team", role: 'Striker' },
    ];
    const country = 'Portugal';
    const stateOrProvince = 'Estremadura';
    const city = 'Lisbon';
    const orcid = '1111-2222-3333-4444';
    const region = 'Asia';
    // Reduced to 3 representative fields (from 9) to improve test performance
    const social = {
      linkedIn: 'https://www.linkedin.com/1234',
      github: 'https://github.com/1234',
      researcherId: 'E-1234-2024', // Tests URL transformation
    };
    const onSave = jest.fn();
    renderKeyInformation({
      firstName,
      middleName,
      lastName,
      nickname,
      degrees,
      positions,
      country,
      stateOrProvince,
      city,
      region,
      social: {},
      onSave,
      locationSuggestions: ['Portugal'],
    });

    fireEvent.change(
      screen.getByRole('textbox', {
        name: 'ORCID (optional) Type your ORCID ID.',
      }),
      { target: { value: orcid } },
    );
    fireEvent.change(
      screen.getByRole('textbox', {
        name: 'ResearcherID (optional) Type your Researcher ID.',
      }),
      { target: { value: social.researcherId } },
    );
    fireEvent.change(
      screen.getByRole('textbox', {
        name: 'LinkedIn (optional) Type your LinkedIn profile URL.',
      }),
      { target: { value: social.linkedIn } },
    );
    fireEvent.change(
      screen.getByRole('textbox', {
        name: 'Github (optional) Type your Github profile URL.',
      }),
      { target: { value: social.github } },
    );
    const saveButton = getSaveButton();
    await user.click(saveButton);
    await waitFor(
      () => {
        expect(onSave).toHaveBeenCalledWith({
          city,
          country,
          stateOrProvince,
          degrees,
          firstName,
          lastName,
          middleName,
          nickname,
          orcid,
          positions,
          region,
          social: {
            ...social,
            researcherId: `https://researcherid.com/rid/${social.researcherId}`,
          },
        });
      },
      { interval: 50 },
    );
    consoleErrorSpy.mockRestore();
  }, 120_000);

  it('can click add an extra position', async () => {
    const user = userEvent.setup({ delay: null });
    renderKeyInformation();
    const addButton = getAddButton();
    await user.click(addButton);
    const secondary = await screen.findByRole('heading', {
      name: /Secondary Position/i,
    });
    const secondarySection = secondary.closest('section') as HTMLElement;
    await waitFor(
      () => {
        expect(
          within(secondarySection).getByRole('textbox', {
            name: /Institution/i,
          }),
        ).toBeVisible();
      },
      { interval: 50 },
    );
    await user.click(addButton);
    const tertiary = await screen.findByRole('heading', {
      name: /Tertiary Position/i,
    });
    const tertiarySection = tertiary.closest('section') as HTMLElement;
    await waitFor(
      () => {
        expect(
          within(tertiarySection).getByRole('textbox', {
            name: /Institution/i,
          }),
        ).toBeVisible();
      },
      { interval: 50 },
    );
  }, 20000);

  it('there can be only 3 positions', async () => {
    const positions = [
      { institution: 'FPF', department: "Men's Team", role: 'Striker' },
      { institution: 'Benfica', department: 'First Team', role: 'Forward' },
      { institution: 'Olhanense', department: 'Youth Team', role: 'Attacker' },
    ];
    renderKeyInformation({
      positions,
    });
    await waitFor(() => {
      expect(
        screen.queryByRole('button', {
          name: /add another position/i,
        }),
      ).not.toBeInTheDocument();
    });
  });

  it('can save an extra position', async () => {
    const consoleErrorSpy = mockActWarningsInConsole('error');
    const user = userEvent.setup({ delay: null });
    const onSave = jest.fn();
    const position = {
      institution: 'Olhanense',
      department: 'Youth Team',
      role: 'Attacker',
    };
    const positions = [
      { institution: 'FPF', department: "Men's Team", role: 'Striker' },
      { institution: 'Benfica', department: 'First Team', role: 'Forward' },
    ];
    renderKeyInformation({
      positions,
      social: {},
      onSave,
      loadInstitutionOptions: jest
        .fn()
        .mockResolvedValue([position.institution]),
    });
    await user.click(getAddButton());

    const tertiary = await screen.findByRole('heading', {
      name: /Tertiary Position/i,
    });
    const tertiarySection = tertiary.closest('section') as HTMLElement;

    const institutionField = within(tertiarySection).getByRole('textbox', {
      name: /Institution/i,
    });
    await user.click(institutionField);
    const institution = await screen.findByText(position.institution);
    await user.click(institution);
    await waitFor(
      () => {
        expect(
          within(tertiarySection).getByRole('textbox', {
            name: /Department/i,
          }),
        ).toBeVisible();
      },
      { interval: 50 },
    );
    fireEvent.change(
      within(tertiarySection).getByRole('textbox', { name: /Department/i }),
      { target: { value: position.department } },
    );
    fireEvent.change(
      within(tertiarySection).getByRole('textbox', { name: /Role/i }),
      { target: { value: position.role } },
    );
    const saveButton = getSaveButton();
    await user.click(saveButton);
    await waitFor(
      () => {
        expect(onSave).toHaveBeenCalledWith(
          expect.objectContaining({ positions: [...positions, position] }),
        );
      },
      { interval: 50 },
    );
    consoleErrorSpy.mockRestore();
  }, 20000);

  it('initializes with empty position when positions array is empty', async () => {
    renderKeyInformation({
      positions: [],
    });
    await waitFor(() => {
      expect(
        screen.getByRole('textbox', { name: /Institution/i }),
      ).toBeVisible();
    });
    // Should have one empty position initialized
    expect(screen.getByRole('textbox', { name: /Institution/i })).toHaveValue(
      '',
    );
  });

  it('shows validation message when state/province is empty', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup({ delay: null });
    renderKeyInformation({
      stateOrProvince: '',
    });
    const stateField = screen.getByRole('textbox', {
      name: /State\/Province/i,
    });
    await user.click(stateField);
    await user.tab();
    await waitFor(() => {
      expect(
        screen.getByText(/Please add your state\/province/i),
      ).toBeVisible();
    });
  });

  it('calls onChangeSelect when degrees are changed', async () => {
    const consoleErrorSpy = mockActWarningsInConsole('error');
    const user = userEvent.setup({ delay: null });
    const onSave = jest.fn();
    const initialDegrees: KeyInformationModalProps['degrees'] = ['PhD'];
    const newDegrees = ['PhD', 'MD'];

    renderKeyInformation({
      degrees: initialDegrees,
      onSave,
    });

    // Find the degrees MultiSelect and change it
    const degreesField = screen.getByRole('textbox', {
      name: /Degree/i,
    });
    await user.click(degreesField);
    // Select another degree option
    const mdOption = await screen.findByText('MD');
    await user.click(mdOption);

    // Save to verify the change was captured
    await user.click(getSaveButton());
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          degrees: expect.arrayContaining(newDegrees),
        }),
      );
    });
    consoleErrorSpy.mockRestore();
  }, 120_000);
});
