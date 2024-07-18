import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import {
  createResearchOutputResponse,
  createUserResponse,
  researchTagEnvironmentResponse,
  researchTagMethodResponse,
  researchTagOrganismResponse,
  researchTagSubtypeResponse,
} from '@asap-hub/fixtures';
import {
  researchOutputDocumentTypeToType,
  ResearchOutputIdentifierType,
  ResearchOutputPostRequest,
  ResearchOutputResponse,
  ResearchOutputType,
  ResearchTagResponse,
} from '@asap-hub/model';
import { fireEvent } from '@testing-library/dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import ResearchOutputForm from '../ResearchOutputForm';
import { ENTER_KEYCODE } from '../../atoms/Dropdown';
import { createIdentifierField } from '../../utils/research-output-form';
import { fern, paper } from '../../colors';

// TODO: fix
// global['Request'] = jest.fn().mockImplementation(() => ({
//   signal: {
//     removeEventListener: () => {},
//     addEventListener: () => {},
//   },
// }));

const defaultProps: ComponentProps<typeof ResearchOutputForm> = {
  onSave: jest.fn(() => Promise.resolve()),
  onSaveDraft: jest.fn(() => Promise.resolve()),
  published: false,
  tagSuggestions: [],
  researchTags: [],
  documentType: 'Article',
  selectedTeams: [],
  typeOptions: Array.from(researchOutputDocumentTypeToType.Article.values()),
  permissions: {
    canEditResearchOutput: true,
    canPublishResearchOutput: true,
    canShareResearchOutput: true,
  },
  getRelatedResearchSuggestions: jest.fn(),
  getRelatedEventSuggestions: jest.fn(),
  serverValidationErrors: [],
  clearServerValidationError: jest.fn(),
  urlRequired: false,
  getLabSuggestions: jest.fn(),
  getAuthorSuggestions: jest.fn(),
  getTeamSuggestions: jest.fn(),
  authorsRequired: false,
};

jest.setTimeout(60000);

const renderForm = (
  additionalProps: Partial<ComponentProps<typeof ResearchOutputForm>> = {},
) => {
  const routes = [
    {
      path: '/',
      element: <ResearchOutputForm {...defaultProps} {...additionalProps} />,
    },
  ];
  const router = createMemoryRouter(routes);
  render(<RouterProvider router={router} />);
};

it('sets authors to required', () => {
  renderForm({ authorsRequired: false });

  expect(
    screen.getByRole('combobox', { name: 'Authors (optional)' }),
  ).toBeVisible();
  renderForm({ authorsRequired: true });
  expect(
    screen.getByRole('combobox', { name: 'Authors (required)' }),
  ).toBeVisible();
});

describe('createIdentifierField', () => {
  it('maps the ResearchOutputIdentifierType to fields including the identifier', () => {
    expect(
      createIdentifierField(ResearchOutputIdentifierType.Empty, 'identifier'),
    ).toEqual({});
    expect(
      createIdentifierField(ResearchOutputIdentifierType.RRID, 'identifier'),
    ).toEqual({ rrid: 'identifier' });
    expect(
      createIdentifierField(ResearchOutputIdentifierType.DOI, 'identifier'),
    ).toEqual({ doi: 'identifier' });
    expect(
      createIdentifierField(
        ResearchOutputIdentifierType.AccessionNumber,
        'identifier',
      ),
    ).toEqual({ accession: 'identifier' });
  });
});

it('renders the form', async () => {
  renderForm();
  expect(
    screen.getByRole('heading', { name: /What are you sharing/i }),
  ).toBeVisible();
  expect(screen.getByRole('button', { name: /Publish/i })).toBeVisible();
});

it('renders the edit form button when research output data is present', async () => {
  renderForm({ researchOutputData: createResearchOutputResponse() });
  expect(screen.getByRole('button', { name: /Save/i })).toBeVisible();
});

it('pre populates the form with provided backend response', async () => {
  const researchOutputData = {
    ...createResearchOutputResponse(),
    title: 'test title',
    link: 'https://test.com',
    descriptionMD: 'test description',
    type: 'Genetic Data - DNA' as ResearchOutputType,
    keywords: ['testAddedTag'],
    labs: [
      {
        id: 'lab1',
        name: 'Lab 1',
      },
    ],
  };
  renderForm({
    documentType: 'Dataset',
    typeOptions: Array.from(researchOutputDocumentTypeToType.Dataset),
    researchOutputData: researchOutputData,
  });

  expect(screen.getByText(researchOutputData.descriptionMD)).toBeVisible();
  expect(screen.getByDisplayValue(researchOutputData.title)).toBeVisible();
  expect(screen.getByText(researchOutputData.type!)).toBeVisible();
  expect(screen.getByText(researchOutputData.sharingStatus)).toBeVisible();
  expect(
    screen.getByText(researchOutputData.authors[0]!.displayName),
  ).toBeVisible();

  expect(screen.getByText(researchOutputData.keywords[0]!)).toBeVisible();
  expect(screen.getByText(researchOutputData.labs[0]!.name)).toBeVisible();

  expect(screen.getByRole('button', { name: /Save/i })).toBeVisible();
});

it('pre populates the form with markdown value of usageNotes if it is defined', async () => {
  const researchOutputData = {
    ...createResearchOutputResponse(),
    usageNotes: 'rich text',
    usageNotesMD: 'markdown',
  };
  renderForm({
    documentType: 'Dataset',
    typeOptions: Array.from(researchOutputDocumentTypeToType.Dataset),
    researchOutputData: researchOutputData,
  });

  expect(screen.queryByText('rich text')).not.toBeInTheDocument();
  expect(screen.getByText('markdown')).toBeVisible();
});

it('displays keywords suggestions', async () => {
  renderForm({
    tagSuggestions: ['2D Cultures', 'Adenosine', 'Adrenal'],
  });

  await userEvent.click(
    screen.getByText(/Start typing\.\.\. \(E\.g\. Cell Biology\)/i),
  );
  expect(screen.getByText('2D Cultures')).toBeVisible();
  expect(screen.getByText('Adenosine')).toBeVisible();
  expect(screen.getByText('Adrenal')).toBeVisible();
});

it('displays selected teams', async () => {
  renderForm({
    selectedTeams: [{ label: 'Team 1', value: 'abc123' }],
  });
  expect(screen.getByText('Team 1')).toBeVisible();
});

it('displays error message when no author is found', async () => {
  const getAuthorSuggestions = jest.fn().mockResolvedValue([]);
  renderForm({ getAuthorSuggestions });
  await userEvent.click(
    screen.getByRole('combobox', { name: 'Authors (optional)' }),
  );

  expect(screen.getByText(/Sorry, no authors match/i)).toBeVisible();
});

it('displays error message when no lab is found', async () => {
  const getLabSuggestions = jest.fn().mockResolvedValue([]);
  renderForm({ getLabSuggestions });
  await userEvent.click(
    screen.getByRole('combobox', {
      name: 'Labs (optional) Add ASAP labs that contributed to this output. Only labs whose PI is part of the CRN will appear.',
    }),
  );

  expect(screen.getByText(/Sorry, no labs match/i)).toBeVisible();
});

it('displays error message when no related research is found', async () => {
  const getRelatedResearchSuggestions = jest.fn().mockResolvedValue([]);
  renderForm({ getRelatedResearchSuggestions });
  await userEvent.click(
    screen.getByRole('combobox', { name: 'Related Outputs (optional)' }),
  );
  expect(screen.getByText(/Sorry, no related outputs match/i)).toBeVisible();
});

it('displays current team within the form', async () => {
  renderForm({ selectedTeams: [{ label: 'example team', value: 'id' }] });
  expect(screen.getByText('example team')).toBeVisible();
});

describe('on submit', () => {
  const id = '42';
  const saveDraftFn = jest.fn();
  const saveFn = jest.fn();
  const getLabSuggestions = jest.fn();
  const getAuthorSuggestions = jest.fn();
  const getRelatedResearchSuggestions = jest.fn();

  beforeEach(() => {
    saveDraftFn.mockResolvedValue({ ...createResearchOutputResponse(), id });
    saveFn.mockResolvedValue({ ...createResearchOutputResponse(), id });
    getLabSuggestions.mockResolvedValue([]);
    getAuthorSuggestions.mockResolvedValue([]);
    getRelatedResearchSuggestions.mockResolvedValue([]);

    // TODO: fix and remove
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const expectedRequest: ResearchOutputPostRequest = {
    documentType: 'Article',
    doi: '10.1234',
    link: 'http://example.com',
    title: 'example title',
    description: '',
    descriptionMD: 'example description',
    type: 'Preprint',
    labs: [],
    authors: [],
    teams: ['TEAMID'],
    sharingStatus: 'Public',
    usedInPublication: true,
    methods: [],
    organisms: [],
    environments: [],
    usageNotes: '',
    workingGroups: [],
    relatedResearch: [],
    keywords: [],
    published: false,
    relatedEvents: [],
  };
  type Data = Pick<
    ResearchOutputPostRequest,
    'link' | 'title' | 'descriptionMD' | 'type'
  >;

  let router = createMemoryRouter([{ path: '/', element: <></> }]);

  const setupForm = async (
    {
      data = {
        descriptionMD: 'example description',
        title: 'example title',
        type: 'Preprint',
        link: 'http://example.com',
      },
      propOverride = {},
      documentType = 'Article',
      researchTags = [{ id: '1', name: 'research tag 1' }],
      researchOutputData = undefined,
    }: {
      data?: Data;
      propOverride?: Partial<ComponentProps<typeof ResearchOutputForm>>;
      documentType?: ComponentProps<typeof ResearchOutputForm>['documentType'];
      researchTags?: ResearchTagResponse[];
      researchOutputData?: ResearchOutputResponse;
    } = {
      data: {
        descriptionMD: 'example description',
        title: 'example title',
        type: 'Preprint',
        link: 'http://example.com',
      },
      documentType: 'Article',
      researchTags: [],
    },
  ) => {
    const routes = [
      {
        path: '/',
        element: (
          <ResearchOutputForm
            {...defaultProps}
            researchOutputData={researchOutputData}
            selectedTeams={[{ value: 'TEAMID', label: 'Example Team' }]}
            documentType={documentType}
            typeOptions={Array.from(
              researchOutputDocumentTypeToType[documentType],
            )}
            onSave={saveFn}
            onSaveDraft={saveDraftFn}
            getLabSuggestions={getLabSuggestions}
            getAuthorSuggestions={getAuthorSuggestions}
            getRelatedResearchSuggestions={getRelatedResearchSuggestions}
            researchTags={researchTags}
            {...propOverride}
          />
        ),
      },
      {
        path: '/shared-research/42/publishedNow',
        element: <div>Published</div>,
      },
      {
        path: '/shared-research/42',

        element: (
          <>
            <div>42</div>
          </>
        ),
      },
    ];
    router = createMemoryRouter(routes);

    render(<RouterProvider router={router} />);

    fireEvent.change(screen.getByLabelText(/url/i), {
      target: { value: data.link },
    });
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: data.title },
    });

    fireEvent.change(screen.getByRole('textbox', { name: /description/i }), {
      target: { value: data.descriptionMD },
    });

    const typeDropdown = screen.getByRole('combobox', {
      name: 'Type (required) Select the type that matches your output the best.',
    });
    fireEvent.change(typeDropdown, {
      target: { value: data.type },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });

    const identifier = screen.getByRole('combobox', {
      name: /identifier.+/i,
    });
    fireEvent.change(identifier, {
      target: { value: 'DOI' },
    });
    fireEvent.keyDown(identifier, {
      keyCode: ENTER_KEYCODE,
    });

    fireEvent.change(screen.getByPlaceholderText('e.g. 10.5555/YFRU1371'), {
      target: { value: '10.1234' },
    });
  };

  const submitForm = async () => {
    const button = screen.getByRole('button', { name: /Publish/i });
    await userEvent.click(button);
    await userEvent.click(
      screen.getByRole('button', { name: /Publish Output/i }),
    );
  };

  const saveForm = async () => {
    const button = screen.getByRole('button', { name: /save/i });
    await userEvent.click(button);
  };

  it('can submit a form with minimum data', async () => {
    await setupForm();

    await submitForm();

    expect(saveFn).toHaveBeenLastCalledWith(expectedRequest);
    expect(screen.getByText('Published')).toBeVisible();
  });

  it('can update a published form with minimum data', async () => {
    await setupForm({ propOverride: { published: true } });
    await saveForm();
    expect(saveFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
      published: true,
    });
    expect(screen.getByText('42')).toBeVisible();
    expect(router.state.location.pathname).toEqual(`/shared-research/42`);
  });

  it('will show you confirmation dialog and allow you to cancel it', async () => {
    await setupForm();
    const button = screen.getByRole('button', { name: /Publish/i });
    await userEvent.click(button);
    expect(
      screen.getByRole('button', { name: 'Publish Output' }),
    ).toBeVisible();
    await userEvent.click(
      screen.getAllByRole('button', { name: /Cancel/i })[0]!,
    );
    expect(screen.queryByRole('button', { name: 'Publish Output' })).toBeNull();
    expect(saveFn).not.toHaveBeenCalled();
  });

  it('can submit a lab', async () => {
    getLabSuggestions.mockResolvedValue([
      { label: 'One Lab', value: '1' },
      { label: 'Two Lab', value: '2' },
    ]);
    await setupForm();

    await userEvent.click(screen.getByRole('combobox', { name: /Labs.+/i }));
    await userEvent.click(screen.getByText('One Lab'));
    await submitForm();
    expect(saveFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
      labs: ['1'],
    });
  });

  it('can submit a related research', async () => {
    getRelatedResearchSuggestions.mockResolvedValue([
      { label: 'First Related Research', value: '1' },
      { label: 'Second Related Research', value: '2' },
    ]);
    await setupForm();

    await userEvent.click(
      screen.getByRole('combobox', { name: /Related Outputs.+/i }),
    );
    await userEvent.click(screen.getByText('First Related Research'));
    await submitForm();
    expect(saveFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
      relatedResearch: ['1'],
    });
  });
  it('can submit existing internal and external and create a new external author', async () => {
    getAuthorSuggestions.mockResolvedValue([
      {
        author: { ...createUserResponse(), displayName: 'Chris Blue' },
        label: 'Chris Blue',
        value: 'u2',
      },
      {
        author: {
          ...createUserResponse(),
          email: undefined,
          displayName: 'Chris Reed',
        },
        label: 'Chris Reed (Non CRN)',
        value: 'u1',
      },
    ]);
    await setupForm();

    const authors = screen.getByRole('combobox', { name: /Authors.+/i });
    await userEvent.click(authors);
    await userEvent.click(screen.getByText(/Chris Reed/i));
    await userEvent.click(authors);
    await userEvent.click(screen.getByText('Chris Blue'));
    await userEvent.click(authors);
    await userEvent.type(authors, 'Alex White');
    await userEvent.click(screen.getAllByText('Alex White')[0]!);

    await submitForm();
    expect(saveFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
      authors: [
        {
          externalAuthorId: 'u1',
        },
        { userId: 'u2' },
        { externalAuthorName: 'Alex White' },
      ],
    });
  });

  it('can submit access instructions', async () => {
    await setupForm();
    await userEvent.type(
      screen.getByRole('textbox', { name: /usage notes/i }),
      'Access Instructions',
    );
    await submitForm();
    expect(saveFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
      usageNotes: 'Access Instructions',
    });
  });
  it('can submit a method', async () => {
    const researchTags = [researchTagMethodResponse];
    const documentType = 'Dataset';
    const type = 'Spectroscopy';
    await setupForm({ researchTags, documentType });
    const typeDropdown = screen.getByRole('combobox', {
      name: /Select the type.+/i,
    });
    fireEvent.change(typeDropdown, {
      target: { value: type },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });

    await userEvent.click(
      await screen.findByRole('combobox', { name: /methods.+/i }),
    );
    await userEvent.click(screen.getByText('ELISA'));
    await submitForm();
    expect(saveFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
      sharingStatus: 'Network Only',
      usedInPublication: undefined,
      documentType,
      type,
      methods: ['ELISA'],
    });
  });
  it('can submit an organism', async () => {
    const documentType = 'Protocol';
    const type = 'Model System';
    const researchTags = [researchTagOrganismResponse];
    await setupForm({
      researchTags,
      documentType,
    });
    const typeDropdown = screen.getByRole('combobox', {
      name: /Select the type.+/i,
    });
    fireEvent.change(typeDropdown, {
      target: { value: type },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });

    await userEvent.click(
      await screen.findByRole('combobox', { name: /organisms.+/i }),
    );
    await userEvent.click(screen.getByText('Rat'));
    await submitForm();
    expect(saveFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
      sharingStatus: 'Network Only',
      usedInPublication: undefined,
      documentType,
      type,
      organisms: ['Rat'],
    });
  });

  it('can submit an environment', async () => {
    const documentType = 'Protocol';
    const type = 'Model System';
    const researchTags = [researchTagEnvironmentResponse];
    await setupForm({
      researchTags,
      documentType,
    });
    const typeDropdown = screen.getByRole('combobox', {
      name: /Select the type.+/i,
    });
    fireEvent.change(typeDropdown, {
      target: { value: type },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });

    await userEvent.click(
      await screen.findByRole('combobox', { name: /environments.+/i }),
    );
    await userEvent.click(screen.getByText('In Vitro'));
    await submitForm();
    expect(saveFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
      sharingStatus: 'Network Only',
      usedInPublication: undefined,
      documentType,
      type,
      environments: ['In Vitro'],
    });
  });

  it('resetting the type resets methods', async () => {
    const researchTags = [researchTagMethodResponse];
    const documentType = 'Dataset';
    const type = 'Spectroscopy';
    await setupForm({ researchTags, documentType });
    const typeDropdown = screen.getByRole('combobox', {
      name: /Select the type.+/i,
    });
    fireEvent.change(typeDropdown, {
      target: { value: type },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });

    const methods = await screen.findByRole('combobox', { name: /methods.+/i });
    await userEvent.click(methods);
    await userEvent.click(screen.getByText('ELISA'));

    expect(screen.getByText(/ELISA/i)).toBeInTheDocument();
    fireEvent.change(typeDropdown, {
      target: { value: 'Protein Data' },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });

    await waitFor(() =>
      expect(screen.queryByText(/ELISA/i)).not.toBeInTheDocument(),
    );
    expect(methods).toBeInTheDocument();
  });
  it('resetting the type resets organisms', async () => {
    const researchTags = [researchTagOrganismResponse];
    const documentType = 'Protocol';
    const type = 'Model System';
    await setupForm({ researchTags, documentType });
    const typeDropdown = screen.getByRole('combobox', {
      name: /Select the type.+/i,
    });
    fireEvent.change(typeDropdown, {
      target: { value: type },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });

    const organisms = await screen.findByRole('combobox', {
      name: /organisms.+/i,
    });
    await userEvent.click(organisms);
    await userEvent.click(screen.getByText('Rat'));

    expect(screen.getByText(/rat/i)).toBeInTheDocument();
    fireEvent.change(typeDropdown, {
      target: { value: 'Microscopy' },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });

    await waitFor(() =>
      expect(screen.queryByText(/rat/i)).not.toBeInTheDocument(),
    );
    expect(organisms).toBeInTheDocument();
  });
  it('resetting the type resets environment', async () => {
    const documentType = 'Protocol';
    const type = 'Model System';
    const researchTags = [researchTagEnvironmentResponse];
    await setupForm({ researchTags, documentType });
    const typeDropdown = screen.getByRole('combobox', {
      name: /Select the type.+/i,
    });
    fireEvent.change(typeDropdown, {
      target: { value: type },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });

    const environments = await screen.findByRole('combobox', {
      name: /environments.+/i,
    });
    await userEvent.click(environments);
    await userEvent.click(screen.getByText('In Vitro'));

    expect(screen.getByText(/In Vitro/i)).toBeInTheDocument();
    fireEvent.change(typeDropdown, {
      target: { value: 'Microscopy' },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });
    await waitFor(() =>
      expect(screen.queryByText(/In Vitro/i)).not.toBeInTheDocument(),
    );
    expect(environments).toBeInTheDocument();
  });
  it('resetting the type resets subtype', async () => {
    const documentType = 'Protocol';
    const type = 'Model System';
    const researchTags = [researchTagSubtypeResponse];
    await setupForm({ researchTags, documentType });
    const typeDropdown = screen.getByRole('combobox', {
      name: /Select the type.+/i,
    });

    fireEvent.change(typeDropdown, {
      target: { value: type },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });
    const subtype = screen.getByRole('combobox', {
      name: /subtype.+/i,
    });
    await userEvent.click(subtype);
    await userEvent.click(screen.getByText('Metabolite'));

    expect(screen.getByText(/metabolite/i)).toBeInTheDocument();
    fireEvent.change(typeDropdown, {
      target: { value: 'Microscopy' },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });
    await waitFor(() =>
      expect(screen.queryByText(/metabolite/i)).not.toBeInTheDocument(),
    );
    expect(subtype).toBeInTheDocument();
  });
  it('can submit published date', async () => {
    await setupForm();
    const sharingStatus = screen.getByRole('group', {
      name: /sharing status/i,
    });
    await userEvent.click(
      within(sharingStatus).getByRole('radio', { name: 'Public' }),
    );
    fireEvent.change(screen.getByLabelText(/date published/i), {
      target: { value: '2022-03-24' },
    });
    await submitForm();
    expect(saveFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
      sharingStatus: 'Public',
      publishDate: new Date('2022-03-24').toISOString(),
    });
  });

  it('can submit labCatalogNumber for lab resource', async () => {
    await setupForm({
      data: { ...expectedRequest, type: 'Animal Model' },
      documentType: 'Lab Resource',
    });
    fireEvent.change(screen.getByRole('textbox', { name: /Catalog Number/i }), {
      target: { value: 'abc123' },
    });
    await submitForm();
    expect(saveFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
      sharingStatus: 'Network Only',
      usedInPublication: undefined,
      type: 'Animal Model',
      documentType: 'Lab Resource',
      labCatalogNumber: 'abc123',
    });
  });

  describe.each`
    fieldName              | selector
    ${'asapFunded'}        | ${/Has this output been funded by ASAP/i}
    ${'usedInPublication'} | ${/Has this output been used in a publication/i}
  `('$fieldName can submit', ({ fieldName, selector }) => {
    // TODO: fix funded status
    it.skip.each`
      value         | expected
      ${'Yes'}      | ${true}
      ${'No'}       | ${false}
      ${'Not Sure'} | ${undefined}
    `('when $value then $expected', async ({ value, expected }) => {
      await setupForm();
      const funded = screen.getByRole('group', {
        name: selector,
      });
      await userEvent.click(within(funded).getByText(value));

      await submitForm();
      expect(saveFn).toHaveBeenLastCalledWith({
        ...expectedRequest,
        [fieldName]: expected,
      });
    });
  });

  it('should disable "No" and "Not Sure" options', async () => {
    await setupForm({
      researchOutputData: {
        ...createResearchOutputResponse(),
        usedInPublication: undefined,
        sharingStatus: 'Network Only',
        documentType: 'Article',
      },
    });
    const usedInPublication = screen.getByRole('group', {
      name: /Has this output been used in a publication/i,
    });

    expect(
      within(usedInPublication).getByRole('radio', { name: 'No' }),
    ).toBeDisabled();
    expect(
      within(usedInPublication).getByRole('radio', { name: 'Not Sure' }),
    ).toBeDisabled();
  });

  const saveDraft = async () => {
    const button = screen.getByRole('button', { name: /Save Draft/i });
    await userEvent.click(button);

    // expect(
    //   await screen.findByRole('button', { name: /Save Draft/i }),
    // ).toBeEnabled();
    // expect(
    //   await screen.findByRole('button', { name: /Cancel/i }),
    // ).toBeEnabled();
  };

  it('can save draft with minimum data', async () => {
    await setupForm();
    await saveDraft();
    expect(saveDraftFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
      published: false,
    });
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(`/shared-research/${id}`);
      expect(router.state.location.search).toEqual('?draftCreated=true');
    });
  });
});

describe.only('form buttons', () => {
  const id = '42';
  const saveFn = jest.fn();
  const getLabSuggestions = jest.fn();
  const getAuthorSuggestions = jest.fn();

  beforeEach(() => {
    saveFn.mockResolvedValue({ id } as ResearchOutputResponse);
    getLabSuggestions.mockResolvedValue([]);
    getAuthorSuggestions.mockResolvedValue([]);

    // TODO: fix and remove
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  let router = createMemoryRouter([{ path: '/', element: <></> }]);

  const setupForm = async (
    {
      canEditResearchOutput = false,
      canPublishResearchOutput = false,
      published = false,
      documentType = 'Article',
      researchTags = [{ id: '1', name: 'research tag 1' }],
      descriptionUnchangedWarning = false,
      researchOutputData = undefined,
      versionAction = undefined,
    }: {
      canEditResearchOutput?: boolean;
      canPublishResearchOutput?: boolean;

      published?: boolean;
      documentType?: ComponentProps<typeof ResearchOutputForm>['documentType'];
      versionAction?: ComponentProps<
        typeof ResearchOutputForm
      >['versionAction'];
      researchTags?: ResearchTagResponse[];
      descriptionUnchangedWarning?: ComponentProps<
        typeof ResearchOutputForm
      >['descriptionUnchangedWarning'];
      researchOutputData?: ComponentProps<
        typeof ResearchOutputForm
      >['researchOutputData'];
    } = {
      documentType: 'Article',
      researchTags: [],
    },
  ) => {
    const routes = [
      {
        path: '/',
        element: (
          <ResearchOutputForm
            {...defaultProps}
            versionAction={versionAction}
            researchOutputData={researchOutputData}
            descriptionUnchangedWarning={descriptionUnchangedWarning}
            selectedTeams={[{ value: 'TEAMID', label: 'Example Team' }]}
            documentType={documentType}
            typeOptions={Array.from(
              researchOutputDocumentTypeToType[documentType],
            )}
            onSave={saveFn}
            getLabSuggestions={getLabSuggestions}
            getAuthorSuggestions={getAuthorSuggestions}
            researchTags={researchTags}
            published={published}
            permissions={{
              canEditResearchOutput,
              canPublishResearchOutput,
              canShareResearchOutput: true,
            }}
          />
        ),
      },
      {
        path: '/shared-research/42/publishedNow',
        element: <div>Published</div>,
      },
      {
        path: '/shared-research/42',

        element: (
          <>
            <div>42</div>
          </>
        ),
      },
    ];
    router = createMemoryRouter(routes);

    render(<RouterProvider router={router} />);
  };

  const primaryButtonBg = fern.rgb;
  const notPrimaryButtonBg = paper.rgb;

  it.only('shows Cancel, Save Draft and Publish buttons when user has editing and publishing permissions and the research output has not been published yet', async () => {
    await setupForm({
      canEditResearchOutput: true,
      canPublishResearchOutput: true,
      published: false,
    });

    const publishButton = screen.getByRole('button', {
      name: /Publish/i,
    });
    expect(publishButton).toBeInTheDocument();
    expect(publishButton).toHaveStyle(`background-color:${primaryButtonBg}`);

    const saveDraftButton = screen.getByRole('button', { name: /Save Draft/i });
    expect(saveDraftButton).toBeInTheDocument();
    expect(saveDraftButton).toHaveStyle(
      `background-color:${notPrimaryButtonBg}`,
    );

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveStyle(`background-color:${notPrimaryButtonBg}`);
  });

  it('shows only Cancel and Save buttons when user has editing and publishing permission and the research output has already been published', async () => {
    await setupForm({
      canEditResearchOutput: true,
      canPublishResearchOutput: true,
      published: true,
    });

    expect(
      screen.queryByRole('button', { name: /Publish/i }),
    ).not.toBeInTheDocument();

    const saveDraftButton = screen.getByRole('button', { name: /Save/i });
    expect(saveDraftButton).toBeInTheDocument();
    expect(saveDraftButton).toHaveStyle(`background-color:${primaryButtonBg}`);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveStyle(`background-color:${notPrimaryButtonBg}`);
  });

  it('shows only Cancel and Save Draft buttons when user has editing permission and the research output has not been published yet', async () => {
    await setupForm({
      canEditResearchOutput: true,
      canPublishResearchOutput: false,
      published: false,
    });

    expect(
      screen.queryByRole('button', { name: /Publish/i }),
    ).not.toBeInTheDocument();

    const saveDraftButton = screen.getByRole('button', { name: /Save Draft/i });
    expect(saveDraftButton).toBeInTheDocument();
    expect(saveDraftButton).toHaveStyle(`background-color:${primaryButtonBg}`);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveStyle(`background-color:${notPrimaryButtonBg}`);
  });
  describe('descriptionUnchangedWarning', () => {
    it('Shows correct button for draft save warning', async () => {
      await setupForm({
        descriptionUnchangedWarning: true,
        canEditResearchOutput: true,
        canPublishResearchOutput: true,
        published: false,
        researchOutputData: createResearchOutputResponse(),
      });
      await userEvent.click(
        screen.getByRole('button', { name: /Save Draft/i }),
      );
      expect(screen.getByText(/Keep the same description/i)).toBeVisible();
      expect(screen.getByText(/Keep and save/i)).toBeVisible();
    });
    it('Shows correct button for publish save warning', async () => {
      await setupForm({
        descriptionUnchangedWarning: true,
        canEditResearchOutput: true,
        canPublishResearchOutput: true,
        researchOutputData: createResearchOutputResponse(),
        published: false,
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(screen.getByText(/Keep the same description/i)).toBeVisible();
      expect(screen.getByText(/Keep and publish/i)).toBeVisible();
    });
    it('is cancelable', async () => {
      await setupForm({
        descriptionUnchangedWarning: true,
        canEditResearchOutput: true,
        canPublishResearchOutput: true,
        researchOutputData: createResearchOutputResponse(),
        published: false,
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(screen.getByText(/Keep the same description/i)).toBeVisible();
      await userEvent.click(
        screen.getAllByRole('button', { name: /Cancel/i })[0]!,
      );
      expect(screen.queryByText(/Keep the same description/i)).toBeNull();
    });

    it('Will be dismissed if there are errors on the form', async () => {
      await setupForm({
        descriptionUnchangedWarning: true,
        canEditResearchOutput: true,
        canPublishResearchOutput: true,

        researchOutputData: {
          ...createResearchOutputResponse(),
          link: '',
        },
        published: false,
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(screen.getByText(/Keep the same description/i)).toBeVisible();
      await userEvent.click(
        screen.getByRole('button', { name: /Keep and publish/i }),
      );
      await waitFor(() => {
        expect(screen.queryByText(/Keep the same description/i)).toBeNull();
        expect(screen.getByText(/Please enter a valid URL/i)).toBeVisible();
      });
    });
    it('Will not reappear once dismissed', async () => {
      await setupForm({
        descriptionUnchangedWarning: true,
        canEditResearchOutput: true,
        canPublishResearchOutput: true,

        researchOutputData: {
          ...createResearchOutputResponse(),
          link: '',
        },
        published: false,
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(screen.getByText(/Keep the same description/i)).toBeVisible();
      await userEvent.click(
        screen.getByRole('button', { name: /Keep and publish/i }),
      );
      await waitFor(() => {
        expect(screen.queryByText(/Keep the same description/i)).toBeNull();
        expect(screen.getByText(/Please enter a valid URL/i)).toBeVisible();
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(screen.queryByText(/Keep the same description/i)).toBeNull();
    });
  });

  describe('Create Version Warning', () => {
    it('Shows warning', async () => {
      await setupForm({
        versionAction: 'create',
        canEditResearchOutput: true,
        canPublishResearchOutput: true,
        researchOutputData: createResearchOutputResponse(),
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(
        screen.getByText(/Publish new version for the whole hub?/i),
      ).toBeVisible();
      expect(
        screen.getByRole('button', { name: /Publish new version/i }),
      ).toBeVisible();
    });

    it('is cancelable', async () => {
      await setupForm({
        versionAction: 'create',
        canEditResearchOutput: true,
        canPublishResearchOutput: true,
        researchOutputData: createResearchOutputResponse(),
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(
        screen.getByText(/Publish new version for the whole hub?/i),
      ).toBeVisible();
      await userEvent.click(
        screen.getAllByRole('button', { name: /Cancel/i })[0]!,
      );
      expect(
        screen.queryByText(/Publish new version for the whole hub?/i),
      ).toBeNull();
    });

    it('Will be dismissed if there are errors on the form', async () => {
      await setupForm({
        versionAction: 'create',
        canEditResearchOutput: true,
        canPublishResearchOutput: true,
        researchOutputData: {
          ...createResearchOutputResponse(),
          link: '',
        },
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(
        screen.getByText(/Publish new version for the whole hub?/i),
      ).toBeVisible();
      await userEvent.click(
        screen.getByRole('button', { name: /Publish new version/i }),
      );
      await waitFor(() => {
        expect(
          screen.queryByText(/Publish new version for the whole hub?/i),
        ).toBeNull();
        expect(screen.getByText(/Please enter a valid URL/i)).toBeVisible();
      });
    });
    it('Will not reappear once dismissed', async () => {
      await setupForm({
        versionAction: 'create',
        canEditResearchOutput: true,
        canPublishResearchOutput: true,

        researchOutputData: {
          ...createResearchOutputResponse(),
          link: '',
        },
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(
        screen.getByText(/Publish new version for the whole hub?/i),
      ).toBeVisible();
      await userEvent.click(
        screen.getByRole('button', { name: /Publish new version/i }),
      );
      await waitFor(() => {
        expect(
          screen.queryByText(/Publish new version for the whole hub?/i),
        ).toBeNull();
        expect(screen.getByText(/Please enter a valid URL/i)).toBeVisible();
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(
        screen.queryByText(/Publish new version for the whole hub?/i),
      ).toBeNull();
    });
  });
});
