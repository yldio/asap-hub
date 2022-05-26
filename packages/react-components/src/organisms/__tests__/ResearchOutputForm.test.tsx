import {
  createTeamResponse,
  createUserResponse,
  researchTagEnvironmentResponse,
  researchTagMethodResponse,
  researchTagOrganismResponse,
  researchTagSubtypeResponse,
  createResearchOutputResponse,
} from '@asap-hub/fixtures';
import {
  ResearchOutputIdentifierType,
  ResearchOutputPostRequest,
  ResearchOutputResponse,
  ResearchTagResponse,
} from '@asap-hub/model';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import userEvent, { specialChars } from '@testing-library/user-event';
import { createMemoryHistory, History } from 'history';
import { ComponentProps } from 'react';
import { Router, StaticRouter } from 'react-router-dom';
import ResearchOutputForm, {
  createIdentifierField,
  getIdentifierType,
  isDirty,
  isIdentifierModified,
  getPublishDate,
  ResearchOutputState,
} from '../ResearchOutputForm';

const props: ComponentProps<typeof ResearchOutputForm> = {
  onSave: jest.fn(() => Promise.resolve()),
  tagSuggestions: [],
  researchTags: [],
  documentType: 'Article',
  team: createTeamResponse(),
};

jest.setTimeout(60000);
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
  render(
    <StaticRouter>
      <ResearchOutputForm {...props} />
    </StaticRouter>,
  );
  expect(
    screen.getByRole('heading', { name: /What are you sharing/i }),
  ).toBeVisible();
  expect(screen.getByRole('button', { name: /Publish/i })).toBeVisible();
});

it('renders the edit form button when research output data is present', async () => {
  render(
    <StaticRouter>
      <ResearchOutputForm
        {...props}
        researchOutputData={createResearchOutputResponse()}
      />
    </StaticRouter>,
  );

  expect(screen.getByRole('button', { name: /Save/i })).toBeVisible();
});

it('displays proper message when no author is found', async () => {
  const getAuthorSuggestions = jest.fn().mockResolvedValue([]);
  render(
    <StaticRouter>
      <ResearchOutputForm
        {...props}
        getAuthorSuggestions={getAuthorSuggestions}
      />
    </StaticRouter>,
  );
  userEvent.click(screen.getByRole('textbox', { name: /Authors/i }));
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

  expect(screen.getByText(/Sorry, no authors match/i)).toBeVisible();
});

it('displays proper message when no lab is found', async () => {
  const getLabSuggestions = jest.fn().mockResolvedValue([]);
  render(
    <StaticRouter>
      <ResearchOutputForm {...props} getLabSuggestions={getLabSuggestions} />
    </StaticRouter>,
  );
  userEvent.click(screen.getByRole('textbox', { name: /Labs/i }));
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  expect(screen.getByText(/Sorry, no labs match/i)).toBeVisible();
});

it('displays current team within the form', async () => {
  render(
    <StaticRouter>
      <ResearchOutputForm
        {...props}
        team={{ ...createTeamResponse(), displayName: 'example team' }}
      />
    </StaticRouter>,
  );
  expect(screen.getByText('example team')).toBeVisible();
});

it('is funded and publication are both yes, then the identifier type is required', async () => {
  render(
    <StaticRouter>
      <ResearchOutputForm {...props} />
    </StaticRouter>,
  );
  const textbox = screen.getByRole('textbox', { name: /identifier/i });
  userEvent.click(textbox);

  expect(
    screen.getByRole('textbox', { name: 'Identifier Type (optional)' }),
  ).toBeInTheDocument();

  const funded = screen.getByRole('group', {
    name: /Has this output been funded by ASAP/i,
  });
  userEvent.click(within(funded).getByText('Yes'));

  const publication = screen.getByRole('group', {
    name: /Has this output been used in a publication/i,
  });
  userEvent.click(within(publication).getByText('Yes'));
  userEvent.click(textbox);

  expect(
    screen.getByRole('textbox', { name: 'Identifier Type (required)' }),
  ).toBeInTheDocument();
});

describe('on submit', () => {
  let history!: History;
  const id = '42';
  const saveFn = jest.fn();
  const getLabSuggestions = jest.fn();
  const getAuthorSuggestions = jest.fn();

  beforeEach(() => {
    history = createMemoryHistory();
    saveFn.mockResolvedValue({ id } as ResearchOutputResponse);
    getLabSuggestions.mockResolvedValue([]);
    getAuthorSuggestions.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const expectedRequest: ResearchOutputPostRequest = {
    documentType: 'Article',
    doi: '10.1234',
    tags: [],
    link: 'http://example.com',
    title: 'example title',
    description: 'example description',
    type: 'Preprint',
    labs: [],
    authors: [],
    teams: ['TEAMID'],
    sharingStatus: 'Network Only',
    addedDate: expect.anything(),
    methods: [],
    organisms: [],
    environments: [],
    labCatalogNumber: undefined,
    publishDate: undefined,
    subtype: undefined,
    accessInstructions: undefined,
    asapFunded: false,
    usedInPublication: false,
  };
  type Data = Pick<
    ResearchOutputPostRequest,
    'link' | 'title' | 'description' | 'type'
  >;

  const setupForm = async (
    {
      data = {
        description: 'example description',
        title: 'example title',
        type: 'Preprint',
        link: 'http://example.com',
      },
      documentType = 'Article',
      researchTags = [],
    }: {
      data?: Data;
      documentType?: ComponentProps<typeof ResearchOutputForm>['documentType'];
      researchTags?: ResearchTagResponse[];
    } = {
      data: {
        description: 'example description',
        title: 'example title',
        type: 'Preprint',
        link: 'http://example.com',
      },
      documentType: 'Article',
      researchTags: [],
    },
  ) => {
    render(
      <Router history={history}>
        <ResearchOutputForm
          {...props}
          team={{ ...createTeamResponse(), id: 'TEAMID' }}
          documentType={documentType}
          onSave={saveFn}
          getLabSuggestions={getLabSuggestions}
          getAuthorSuggestions={getAuthorSuggestions}
          researchTags={researchTags}
        />
      </Router>,
    );

    userEvent.type(screen.getByRole('textbox', { name: /url/i }), data.link!);
    userEvent.type(screen.getByRole('textbox', { name: /title/i }), data.title);
    userEvent.type(
      screen.getByRole('textbox', { name: /description/i }),
      data.description,
    );

    const typeDropdown = screen.getByRole('textbox', {
      name: /Select the option/i,
    });
    userEvent.type(typeDropdown, data.type);
    userEvent.type(typeDropdown, specialChars.enter);

    const identifier = screen.getByRole('textbox', { name: /identifier/i });
    userEvent.type(identifier, 'DOI');
    userEvent.type(identifier, specialChars.enter);
    userEvent.type(
      await screen.findByRole('textbox', {
        name: /Your DOI must start with/i,
      }),
      '10.1234',
    );
  };
  const submitForm = async () => {
    const button = screen.getByRole('button', { name: /Publish/i });
    userEvent.click(button);

    expect(
      await screen.findByRole('button', { name: /Publish/i }),
    ).toBeEnabled();
    expect(
      await screen.findByRole('button', { name: /Cancel/i }),
    ).toBeEnabled();
  };

  it('can submit a form with minimum data', async () => {
    await setupForm();
    await submitForm();
    expect(saveFn).toHaveBeenLastCalledWith(expectedRequest);
    expect(history.location.pathname).toEqual(`/shared-research/${id}`);
  });

  it('can submit a lab', async () => {
    getLabSuggestions.mockResolvedValue([
      { label: 'One Lab', value: '1' },
      { label: 'Two Lab', value: '2' },
    ]);
    await setupForm();

    userEvent.click(screen.getByRole('textbox', { name: /Labs/i }));
    userEvent.click(screen.getByText('One Lab'));
    await submitForm();
    expect(saveFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
      labs: ['1'],
    });
  });
  it('can submit existing internal and external and create a new external author', async () => {
    getAuthorSuggestions.mockResolvedValue([
      {
        user: { ...createUserResponse(), displayName: 'Chris Blue' },
        label: 'Chris Blue',
        value: 'u2',
      },
      {
        user: {
          ...createUserResponse(),
          email: undefined,
          displayName: 'Chris Reed',
        },
        label: 'Chris Reed (Non CRN)',
        value: 'u1',
      },
    ]);
    await setupForm();

    const authors = screen.getByRole('textbox', { name: /Authors/i });
    userEvent.click(authors);
    userEvent.click(screen.getByText(/Chris Reed/i));
    userEvent.click(authors);
    userEvent.click(screen.getByText('Chris Blue'));
    userEvent.click(authors);
    userEvent.type(authors, 'Alex White');
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    userEvent.click(screen.getAllByText('Alex White')[1]);

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
    userEvent.type(
      screen.getByRole('textbox', { name: /access instructions/i }),
      'Access Instructions',
    );
    await submitForm();
    expect(saveFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
      accessInstructions: 'Access Instructions',
    });
  });
  it('can submit a method', async () => {
    const researchTags = [researchTagMethodResponse];
    const documentType = 'Dataset';
    const type = 'Spectroscopy';
    await setupForm({ researchTags, documentType });
    const typeDropdown = screen.getByRole('textbox', {
      name: /Select the option/i,
    });
    userEvent.type(typeDropdown, type);
    userEvent.type(typeDropdown, specialChars.enter);

    userEvent.click(await screen.findByRole('textbox', { name: /methods/i }));
    userEvent.click(screen.getByText('ELISA'));
    await submitForm();
    expect(saveFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
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
    const typeDropdown = screen.getByRole('textbox', {
      name: /Select the option/i,
    });
    userEvent.type(typeDropdown, type);
    userEvent.type(typeDropdown, specialChars.enter);

    userEvent.click(await screen.findByRole('textbox', { name: /organisms/i }));
    userEvent.click(screen.getByText('Rat'));
    await submitForm();
    expect(saveFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
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
    const typeDropdown = screen.getByRole('textbox', {
      name: /Select the option/i,
    });
    userEvent.type(typeDropdown, type);
    userEvent.type(typeDropdown, specialChars.enter);

    userEvent.click(
      await screen.findByRole('textbox', { name: /environments/i }),
    );
    userEvent.click(screen.getByText('In Vitro'));
    await submitForm();
    expect(saveFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
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
    const typeDropdown = screen.getByRole('textbox', {
      name: /Select the option/i,
    });
    userEvent.type(typeDropdown, type);
    userEvent.type(typeDropdown, specialChars.enter);

    const methods = await screen.findByRole('textbox', { name: /methods/i });
    userEvent.click(methods);
    userEvent.click(screen.getByText('ELISA'));

    expect(screen.getByText(/ELISA/i)).toBeInTheDocument();
    userEvent.type(typeDropdown, 'Protein Data');
    userEvent.type(typeDropdown, specialChars.enter);
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
    const typeDropdown = screen.getByRole('textbox', {
      name: /Select the option/i,
    });
    userEvent.type(typeDropdown, type);
    userEvent.type(typeDropdown, specialChars.enter);

    const organisms = await screen.findByRole('textbox', {
      name: /organisms/i,
    });
    userEvent.click(organisms);
    userEvent.click(screen.getByText('Rat'));

    expect(screen.getByText(/rat/i)).toBeInTheDocument();
    userEvent.type(typeDropdown, 'Microscopy');
    userEvent.type(typeDropdown, specialChars.enter);
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
    const typeDropdown = screen.getByRole('textbox', {
      name: /Select the option/i,
    });
    userEvent.type(typeDropdown, type);
    userEvent.type(typeDropdown, specialChars.enter);

    const environments = await screen.findByRole('textbox', {
      name: /environments/i,
    });
    userEvent.click(environments);
    userEvent.click(screen.getByText('In Vitro'));

    expect(screen.getByText(/In Vitro/i)).toBeInTheDocument();
    userEvent.type(typeDropdown, 'Microscopy');
    userEvent.type(typeDropdown, specialChars.enter);
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
    const typeDropdown = screen.getByRole('textbox', {
      name: /Select the option/i,
    });
    userEvent.type(typeDropdown, type);
    userEvent.type(typeDropdown, specialChars.enter);

    const subtype = screen.getByRole('textbox', {
      name: /subtype/i,
    });
    userEvent.click(subtype);
    userEvent.click(screen.getByText('Metabolite'));

    expect(screen.getByText(/metabolite/i)).toBeInTheDocument();
    userEvent.type(typeDropdown, 'Microscopy');
    userEvent.type(typeDropdown, specialChars.enter);
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
    userEvent.click(
      within(sharingStatus).getByRole('radio', { name: 'Public' }),
    );
    userEvent.type(screen.getByLabelText(/date published/i), '2022-03-24');
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
    userEvent.type(
      screen.getByRole('textbox', { name: /Catalog Number/i }),
      'abc123',
    );
    await submitForm();
    expect(saveFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
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
    it.each`
      value         | expected
      ${'Yes'}      | ${true}
      ${'No'}       | ${false}
      ${'Not Sure'} | ${undefined}
    `('when $value then $expected', async ({ value, expected }) => {
      await setupForm();
      const funded = screen.getByRole('group', {
        name: selector,
      });
      userEvent.click(within(funded).getByText(value));

      await submitForm();
      expect(saveFn).toHaveBeenLastCalledWith({
        ...expectedRequest,
        [fieldName]: expected,
      });
    });
  });
});

describe('isDirty', () => {
  const researchOutputResponse: ResearchOutputResponse =
    createResearchOutputResponse();
  const payload: ResearchOutputState = {
    title: researchOutputResponse.title,
    description: researchOutputResponse.description,
    link: researchOutputResponse.link,
    type: researchOutputResponse.type!,
    tags: researchOutputResponse.tags,
    methods: researchOutputResponse.methods,
    organisms: researchOutputResponse.organisms,
    environments: researchOutputResponse.environments,
    teams: researchOutputResponse?.teams.map((element, index) => ({
      label: element.displayName,
      value: element.id,
      isFixed: index === 0,
    })),
    labs: researchOutputResponse?.labs.map((lab) => ({
      value: lab.id,
      label: lab.name,
    })),
    authors: researchOutputResponse?.authors.map((author) => ({
      value: author.id,
      label: author.displayName,
      user: author,
    })),
    subtype: researchOutputResponse.subtype,
    labCatalogNumber: researchOutputResponse.labCatalogNumber,
    identifierType: ResearchOutputIdentifierType.Empty,
  };

  it('returns true for edit mode when values differ from the initial ones', () => {
    expect(
      isDirty(payload, {
        ...researchOutputResponse,
        title: 'Changed title',
        doi: '12.1234',
      }),
    ).toBeTruthy();
  });

  it('returns true for edit mode when teams are in diff order', () => {
    expect(
      isDirty(
        {
          ...payload,
          teams: [
            { value: 't0', label: 'team-0' },
            { value: 't1', label: 'team-1' },
          ],
        },
        {
          ...researchOutputResponse,
          teams: [
            { id: 't1', displayName: 'team-1' },
            { id: 't0', displayName: 'team-0' },
          ],
        },
      ),
    ).toBeTruthy();
  });

  it('returns false for edit mode when values equal the initial ones', () => {
    expect(isDirty(payload, researchOutputResponse)).toBeFalsy();
  });

  it('returns true when the initial values are changed', () => {
    expect(isDirty(payload)).toBeTruthy();
  });

  it('returns true when the initial values are unchanged', () => {
    expect(
      isDirty({
        title: '',
        description: '',
        link: '',
        type: '',
        tags: [],
        methods: [],
        organisms: [],
        environments: [],
        teams: [{ value: '12', label: 'Team ASAP' }],
        labs: [],
        authors: [],
        subtype: undefined,
        labCatalogNumber: '',
        identifier: '',
        identifierType: ResearchOutputIdentifierType.Empty,
      }),
    ).toBeFalsy();
  });

  it('returns false when the identifier is absent', () => {
    expect(isIdentifierModified(researchOutputResponse)).toBeFalsy();
  });

  it('returns false when the identifier is equal to initial identifier', () => {
    expect(
      isIdentifierModified(
        { ...researchOutputResponse, doi: '12.1234' },
        '12.1234',
      ),
    ).toBeFalsy();
  });

  it('returns true when the identifier is not equal to initial identifier', () => {
    expect(
      isIdentifierModified(
        { ...researchOutputResponse, doi: '12.1234' },
        '12.5555',
      ),
    ).toBeTruthy();
  });
});

describe('getPublishDate', () => {
  const dateString = new Date().toString();
  it('returns a new date if date string exists', () => {
    expect(getPublishDate(dateString)).toBeInstanceOf(Date);
  });
  it('returns undefined if no date string is present', () => {
    expect(getPublishDate()).toBeUndefined();
  });
});

describe('getIdentifierType', () => {
  it('returns DOI when doi is present', () => {
    expect(
      getIdentifierType({ ...createResearchOutputResponse(), doi: 'abc' }),
    ).toEqual('DOI');
  });
  it('returns RRID when rrid is present', () => {
    expect(
      getIdentifierType({ ...createResearchOutputResponse(), rrid: 'abc' }),
    ).toEqual('RRID');
  });
  it('returns Accession Number when accession is present', () => {
    expect(
      getIdentifierType({
        ...createResearchOutputResponse(),
        accession: 'abc',
      }),
    ).toEqual('Accession Number');
  });
  it('returns empty when there is no identifier present', () => {
    expect(
      getIdentifierType({
        ...createResearchOutputResponse(),
        accession: '',
        rrid: '',
        doi: '',
      }),
    ).toEqual('');
  });
});
