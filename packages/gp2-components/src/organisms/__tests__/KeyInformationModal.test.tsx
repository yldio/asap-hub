import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 } from '@asap-hub/model';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import KeyInformationModal from '../KeyInformationModal';

describe('KeyInformationModal', () => {
  const getSaveButton = () => screen.getByRole('button', { name: 'Save' });
  const getAddButton = () =>
    screen.getByRole('button', {
      name: /add another position/i,
    });
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, 'error').mockImplementation();
  });
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
  ) => {
    const routes = [
      {
        path: '/',
        element: <KeyInformationModal {...defaultProps} {...overrides} />,
      },
    ];
    const router = createMemoryRouter(routes);
    render(<RouterProvider router={router} />);
  }

  it('renders a dialog with the right title', () => {
    renderKeyInformation();
    expect(screen.getByRole('dialog')).toContainElement(
      screen.getByRole('heading', { name: 'Key Information' }),
    );
  });

  it('renders the firstName and lastName fields', () => {
    renderKeyInformation();
    expect(
      screen.getByRole('textbox', { name: 'First Name (required)' }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: 'Last Name (required)' }),
    ).toBeVisible();
  });

  it('calls onSave with the right arguments', async () => {
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
    await userEvent.click(getSaveButton());
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
    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });

  it('shows validation message when city is not provided', async () => {
    const onSave = jest.fn();
    renderKeyInformation({
      city: '',
      onSave,
    });
    await userEvent.click(screen.getByRole('textbox', { name: /city/i }));
    await userEvent.tab();
    expect(screen.getByText(/Please add your city/i)).toBeVisible();
  });

  it('does not call onSave with orcid when orcid is not provided', async () => {
    const onSave = jest.fn();
    renderKeyInformation({
      onSave,
      social: {
        ...defaultProps.social,
        orcid: undefined,
      },
    });
    const saveButton = getSaveButton();
    await userEvent.click(saveButton);
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
    await waitFor(() => expect(saveButton).toBeEnabled());
  }, 60000);

  it('calls onSave with the updated fields', async () => {
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
    const orcid = '1111-2222-3333-4444';
    const social = {
      linkedIn: 'https://www.linkedin.com/1234',
      github: 'https://github.com/1234',
    };
    const onSave = jest.fn();
    renderKeyInformation({
      firstName: '',
      middleName: '',
      lastName: '',
      nickname: '',
      degrees: [],
      positions: [],
      country: '',
      stateOrProvince: '',
      city: '',
      region: 'Asia',
      social: {},
      onSave,
      locationSuggestions: ['Portugal'],
      loadInstitutionOptions: jest
        .fn()
        .mockResolvedValue([positions[0]!.institution]),
    });

    await userEvent.type(
      screen.getByRole('textbox', { name: 'First Name (required)' }),
      firstName,
    );
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Middle Name(s) (optional)' }),
      middleName,
    );
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Last Name (required)' }),
      lastName,
    );
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Nickname (optional)' }),
      nickname,
    );
    await userEvent.click(screen.getByRole('combobox', { name: 'Degree (required)' }));
    await userEvent.click(screen.getByText(degrees[0]!));
    await userEvent.click(
      screen.getByRole('combobox', {
        name: 'Region (required) Select the region you are based in.',
      }),
    );
    await userEvent.click(screen.getByText(region));
    await userEvent.click(
      screen.getByRole('combobox', {
        name: 'Location (required) Select the location you are based in.',
      }),
    );
    await userEvent.click(screen.getByText(country));
    await userEvent.type(
      screen.getByRole('textbox', { name: 'City (required)' }),
      city,
    );
    await userEvent.type(
      screen.getByRole('textbox', { name: 'State/Province (required)' }),
      stateOrProvince,
    );
    await userEvent.click(
      screen.getByRole('combobox', { name: 'Institution (required)' }),
    );
    const institution = await screen.findByText(positions[0]!.institution);
    await userEvent.click(institution);
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Department (required)' }),
      positions[0]!.department,
    );
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Role (required)' }),
      positions[0]!.role,
    );
    await userEvent.type(
      screen.getByRole('textbox', {
        name: 'ORCID (optional) Type your ORCID ID.',
      }),
      orcid,
    );
    await userEvent.type(
      screen.getByRole('textbox', {
        name: 'LinkedIn (optional) Type your LinkedIn profile URL.',
      }),
      social.linkedIn,
    );
    await userEvent.type(
      screen.getByRole('textbox', {
        name: 'Github (optional) Type your Github profile URL.',
      }),
      social.github,
    );
    const saveButton = getSaveButton();
    await userEvent.click(saveButton);
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
      orcid,
      social,
    });
    await waitFor(() => expect(saveButton).toBeEnabled());
  }, 180000);

  it('calls onSave with the updated social fields', async () => {
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
    const social = {
      blueSky: 'https://bsky.app/profile/1234',
      threads: 'https://www.threads.net/@1234',
      twitter: 'https://twitter.com/1234',
      linkedIn: 'https://www.linkedin.com/1234',
      github: 'https://github.com/1234',
      researcherId: 'E-1234-2024',
      googleScholar: 'https://scholar.google.com/citations?user=1234',
      researchGate: 'https://www.researchgate.net/profile/1234',
      blog: 'https://www.example.com',
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
      loadInstitutionOptions: jest
        .fn()
        .mockResolvedValue([positions[0]!.institution]),
    });

    await userEvent.type(
      screen.getByRole('textbox', {
        name: 'Google Scholar (optional) Type your Google Scholar profile URL.',
      }),
      social.googleScholar,
    );
    await userEvent.type(
      screen.getByRole('textbox', {
        name: 'ORCID (optional) Type your ORCID ID.',
      }),
      orcid,
    );
    await userEvent.type(
      screen.getByRole('textbox', {
        name: 'Research Gate (optional) Type your Research Gate profile URL.',
      }),
      social.researchGate,
    );
    await userEvent.type(
      screen.getByRole('textbox', {
        name: 'ResearcherID (optional) Type your Researcher ID.',
      }),
      social.researcherId,
    );
    await userEvent.type(
      screen.getByRole('textbox', {
        name: 'Blog (optional)',
      }),
      social.blog,
    );
    await userEvent.type(
      screen.getByRole('textbox', {
        name: 'BlueSky (optional) Type your BlueSky profile URL.',
      }),
      social.blueSky,
    );
    await userEvent.type(
      screen.getByRole('textbox', {
        name: 'Threads (optional) Type your Threads profile URL.',
      }),
      social.threads,
    );
    await userEvent.type(
      screen.getByRole('textbox', {
        name: 'X (optional) Type your X (formerly twitter) profile URL.',
      }),
      social.twitter,
    );
    await userEvent.type(
      screen.getByRole('textbox', {
        name: 'LinkedIn (optional) Type your LinkedIn profile URL.',
      }),
      social.linkedIn,
    );
    await userEvent.type(
      screen.getByRole('textbox', {
        name: 'Github (optional) Type your Github profile URL.',
      }),
      social.github,
    );
    const saveButton = getSaveButton();
    await userEvent.click(saveButton);
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
    await waitFor(() => expect(saveButton).toBeEnabled());
  }, 300000);

  it('can click add an extra position', async () => {
    renderKeyInformation();
    const addButton = getAddButton();
    await userEvent.click(addButton);
    const secondary = screen.getByRole('heading', {
      name: /Secondary Position/i,
    }).parentElement?.parentElement as HTMLElement;
    expect(
      within(secondary).getByRole('combobox', {
        name: /Institution/i,
      }),
    ).toBeVisible();
    await userEvent.click(addButton);
    const tertiary = screen.getByRole('heading', {
      name: /Tertiary Position/i,
    }).parentElement?.parentElement as HTMLElement;
    expect(
      within(tertiary).getByRole('combobox', {
        name: /Institution/i,
      }),
    ).toBeVisible();
  });

  it('there can be only 3 positions', () => {
    const positions = [
      { institution: 'FPF', department: "Men's Team", role: 'Striker' },
      { institution: 'Benfica', department: 'First Team', role: 'Forward' },
      { institution: 'Olhanense', department: 'Youth Team', role: 'Attacker' },
    ];
    renderKeyInformation({
      positions,
    });
    expect(
      screen.queryByRole('button', {
        name: /add another position/i,
      }),
    ).not.toBeInTheDocument();
  });

  it('can save an extra position', async () => {
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
    await userEvent.click(getAddButton());

    const tertiary = screen.getByRole('heading', {
      name: /Tertiary Position/i,
    }).parentElement?.parentElement as HTMLElement;

    await userEvent.click(
      within(tertiary).getByRole('combobox', { name: /Institution/i }),
    );
    const institution = await screen.findByText(position.institution);
    await userEvent.click(institution);
    await userEvent.type(
      within(tertiary).getByRole('textbox', { name: /Department/i }),
      position.department,
    );
    await userEvent.type(
      within(tertiary).getByRole('textbox', { name: /Role/i }),
      position.role,
    );
    const saveButton = getSaveButton();
    await userEvent.click(saveButton);
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ positions: [...positions, position] }),
    );
    await waitFor(() => expect(saveButton).toBeEnabled());
  }, 30000);
});
