import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { StaticRouter, Router } from 'react-router-dom';
import {
  createResearchOutputResponse,
  createUserResponse,
  researchTagEnvironmentResponse,
  researchTagMethodResponse,
  researchTagOrganismResponse,
  researchTagSubtypeResponse,
} from '@asap-hub/fixtures';
import {
  ResearchOutputIdentifierType,
  ResearchOutputPostRequest,
  ResearchOutputResponse,
  researchOutputDocumentTypeToType,
  ResearchOutputType,
  ResearchTagResponse,
} from '@asap-hub/model';
import { disable } from '@asap-hub/flags';
import { fireEvent } from '@testing-library/dom';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import { createMemoryHistory, History } from 'history';
import ResearchOutputForm from '../ResearchOutputForm';
import { ENTER_KEYCODE } from '../../atoms/Dropdown';
import { createIdentifierField } from '../../utils/research-output-form';
import { fern, paper } from '../../colors';

const props: ComponentProps<typeof ResearchOutputForm> = {
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
};

jest.setTimeout(60000);

it('sets authors to required', () => {
  render(
    <StaticRouter>
      <ResearchOutputForm {...props} authorsRequired={false} />
    </StaticRouter>,
  );
  expect(
    screen.getByRole('textbox', { name: 'Authors (optional)' }),
  ).toBeVisible();
  render(
    <StaticRouter>
      <ResearchOutputForm {...props} authorsRequired={true} />
    </StaticRouter>,
  );
  expect(
    screen.getByRole('textbox', { name: 'Authors (required)' }),
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

it('pre populates the form with provided backend response', async () => {
  const researchOutputData = {
    ...createResearchOutputResponse(),
    title: 'test title',
    link: 'https://test.com',
    descriptionMD: 'test description',
    type: 'Genetic Data - DNA' as ResearchOutputType,
    tags: ['testAddedTag'],
    labs: [
      {
        id: 'lab1',
        name: 'Lab 1',
      },
    ],
  };
  await render(
    <StaticRouter>
      <ResearchOutputForm
        {...props}
        documentType={'Dataset'}
        typeOptions={Array.from(researchOutputDocumentTypeToType.Dataset)}
        researchOutputData={researchOutputData}
      />
    </StaticRouter>,
  );

  expect(screen.getByText(researchOutputData.descriptionMD)).toBeVisible();
  expect(screen.getByDisplayValue(researchOutputData.title)).toBeVisible();
  expect(screen.getByText(researchOutputData.type!)).toBeVisible();
  expect(screen.getByText(researchOutputData.sharingStatus)).toBeVisible();
  expect(
    screen.getByText(researchOutputData.authors[0]!.displayName),
  ).toBeVisible();

  expect(screen.getByText(researchOutputData.tags[0]!)).toBeVisible();
  expect(screen.getByText(researchOutputData.labs[0]!.name)).toBeVisible();

  expect(screen.getByRole('button', { name: /Save/i })).toBeVisible();
});

it('displays keywords suggestions', async () => {
  await render(
    <StaticRouter>
      <ResearchOutputForm
        {...props}
        tagSuggestions={['2D Cultures', 'Adenosine', 'Adrenal']}
      />
    </StaticRouter>,
  );
  userEvent.click(screen.getByText(/add a keyword/i));
  expect(screen.getByText('2D Cultures')).toBeVisible();
  expect(screen.getByText('Adenosine')).toBeVisible();
  expect(screen.getByText('Adrenal')).toBeVisible();
});

it('displays selected teams', async () => {
  await render(
    <StaticRouter>
      <ResearchOutputForm
        {...props}
        selectedTeams={[{ label: 'Team 1', value: 'abc123' }]}
      />
    </StaticRouter>,
  );
  expect(screen.getByText('Team 1')).toBeVisible();
});

it('displays error message when no author is found', async () => {
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

it('displays error message when no lab is found', async () => {
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

it('displays error message when no related research is found', async () => {
  const getRelatedResearchSuggestions = jest.fn().mockResolvedValue([]);
  render(
    <StaticRouter>
      <ResearchOutputForm
        {...props}
        getRelatedResearchSuggestions={getRelatedResearchSuggestions}
      />
    </StaticRouter>,
  );
  userEvent.click(screen.getByRole('textbox', { name: /Related Outputs/i }));
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  expect(screen.getByText(/Sorry, no related outputs match/i)).toBeVisible();
});

it('displays current team within the form', async () => {
  render(
    <StaticRouter>
      <ResearchOutputForm
        {...props}
        selectedTeams={[{ label: 'example team', value: 'id' }]}
      />
    </StaticRouter>,
  );
  expect(screen.getByText('example team')).toBeVisible();
});

describe('on submit', () => {
  let history!: History;
  const id = '42';
  const saveDraftFn = jest.fn();
  const saveFn = jest.fn();
  const getLabSuggestions = jest.fn();
  const getAuthorSuggestions = jest.fn();
  const getRelatedResearchSuggestions = jest.fn();

  beforeEach(() => {
    history = createMemoryHistory();
    saveDraftFn.mockResolvedValue({ ...createResearchOutputResponse(), id });
    saveFn.mockResolvedValue({ ...createResearchOutputResponse(), id });
    getLabSuggestions.mockResolvedValue([]);
    getAuthorSuggestions.mockResolvedValue([]);
    getRelatedResearchSuggestions.mockResolvedValue([]);
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
    description: '',
    descriptionMD: 'example description',
    type: 'Preprint',
    labs: [],
    authors: [],
    teams: ['TEAMID'],
    sharingStatus: 'Network Only',
    methods: [],
    organisms: [],
    environments: [],
    usageNotes: '',
    workingGroups: [],
    relatedResearch: [],
    keywords: [],
  };
  type Data = Pick<
    ResearchOutputPostRequest,
    'link' | 'title' | 'descriptionMD' | 'type'
  >;

  const setupForm = async (
    {
      data = {
        descriptionMD: 'example description',
        title: 'example title',
        type: 'Preprint',
        link: 'http://example.com',
      },
      documentType = 'Article',
      researchTags = [{ id: '1', name: 'research tag 1' }],
    }: {
      data?: Data;
      documentType?: ComponentProps<typeof ResearchOutputForm>['documentType'];
      researchTags?: ResearchTagResponse[];
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
    render(
      <Router history={history}>
        <ResearchOutputForm
          {...props}
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
        />
      </Router>,
    );

    fireEvent.change(screen.getByLabelText(/url/i), {
      target: { value: data.link },
    });
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: data.title },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: data.descriptionMD },
    });

    const typeDropdown = screen.getByRole('textbox', {
      name: /Select the type/i,
    });
    fireEvent.change(typeDropdown, {
      target: { value: data.type },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });

    const identifier = screen.getByRole('textbox', { name: /identifier/i });
    fireEvent.change(identifier, {
      target: { value: 'DOI' },
    });
    fireEvent.keyDown(identifier, {
      keyCode: ENTER_KEYCODE,
    });
    fireEvent.change(
      screen.getByPlaceholderText('DOI number e.g. 10.5555/YFRU1371'),
      {
        target: { value: '10.1234' },
      },
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
    expect(history.location.pathname).toEqual(
      `/shared-research/${id}/publishedNow`,
    );
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

  it('can submit a related research', async () => {
    getRelatedResearchSuggestions.mockResolvedValue([
      { label: 'First Related Research', value: '1' },
      { label: 'Second Related Research', value: '2' },
    ]);
    await setupForm();

    userEvent.click(screen.getByRole('textbox', { name: /Related Outputs/i }));
    userEvent.click(screen.getByText('First Related Research'));
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

    const authors = screen.getByRole('textbox', { name: /Authors/i });
    userEvent.click(authors);
    userEvent.click(screen.getByText(/Chris Reed/i));
    userEvent.click(authors);
    userEvent.click(screen.getByText('Chris Blue'));
    userEvent.click(authors);
    userEvent.type(authors, 'Alex White');
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    userEvent.click(screen.getAllByText('Alex White')[1]!);

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
    const typeDropdown = screen.getByRole('textbox', {
      name: /Select the type/i,
    });
    fireEvent.change(typeDropdown, {
      target: { value: type },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });

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
      name: /Select the type/i,
    });
    fireEvent.change(typeDropdown, {
      target: { value: type },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });

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
      name: /Select the type/i,
    });
    fireEvent.change(typeDropdown, {
      target: { value: type },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });

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
      name: /Select the type/i,
    });
    fireEvent.change(typeDropdown, {
      target: { value: type },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });

    const methods = await screen.findByRole('textbox', { name: /methods/i });
    userEvent.click(methods);
    userEvent.click(screen.getByText('ELISA'));

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
    const typeDropdown = screen.getByRole('textbox', {
      name: /Select the type/i,
    });
    fireEvent.change(typeDropdown, {
      target: { value: type },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });

    const organisms = await screen.findByRole('textbox', {
      name: /organisms/i,
    });
    userEvent.click(organisms);
    userEvent.click(screen.getByText('Rat'));

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
    const typeDropdown = screen.getByRole('textbox', {
      name: /Select the type/i,
    });
    fireEvent.change(typeDropdown, {
      target: { value: type },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });

    const environments = await screen.findByRole('textbox', {
      name: /environments/i,
    });
    userEvent.click(environments);
    userEvent.click(screen.getByText('In Vitro'));

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
    const typeDropdown = screen.getByRole('textbox', {
      name: /Select the type/i,
    });

    fireEvent.change(typeDropdown, {
      target: { value: type },
    });
    fireEvent.keyDown(typeDropdown, {
      keyCode: ENTER_KEYCODE,
    });
    const subtype = screen.getByRole('textbox', {
      name: /subtype/i,
    });
    userEvent.click(subtype);
    userEvent.click(screen.getByText('Metabolite'));

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
    userEvent.click(
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

  const saveDraft = async () => {
    const button = screen.getByRole('button', { name: /Save Draft/i });
    userEvent.click(button);

    expect(
      await screen.findByRole('button', { name: /Save Draft/i }),
    ).toBeEnabled();
    expect(
      await screen.findByRole('button', { name: /Cancel/i }),
    ).toBeEnabled();
  };

  it('can save draft with minimum data', async () => {
    await setupForm();
    await saveDraft();
    expect(saveDraftFn).toHaveBeenLastCalledWith(expectedRequest);
    await waitFor(() =>
      expect(history.location.pathname).toEqual(`/shared-research/${id}`),
    );
  });
});

describe('form buttons', () => {
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

  const setupForm = async (
    {
      canEditResearchOutput = false,
      canPublishResearchOutput = false,
      published = false,
      documentType = 'Article',
      researchTags = [{ id: '1', name: 'research tag 1' }],
    }: {
      canEditResearchOutput?: boolean;
      canPublishResearchOutput?: boolean;

      published?: boolean;
      documentType?: ComponentProps<typeof ResearchOutputForm>['documentType'];
      researchTags?: ResearchTagResponse[];
    } = {
      documentType: 'Article',
      researchTags: [],
    },
  ) => {
    render(
      <Router history={history}>
        <ResearchOutputForm
          {...props}
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
      </Router>,
    );
  };

  const primaryButtonBg = fern.rgb;
  const notPrimaryButtonBg = paper.rgb;

  it('shows Cancel, Save Draft and Publish buttons when user has editing and publishing permissions and the research output has not been published yet', async () => {
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

  it('shows only Cancel and Publish buttons when user has editing and publishing permissions, the research output has not been published yet and feature flag is disabled', async () => {
    disable('DRAFT_RESEARCH_OUTPUT');
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

    expect(
      screen.queryByRole('button', { name: /Save Draft/i }),
    ).not.toBeInTheDocument();
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
});
