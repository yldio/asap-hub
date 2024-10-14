import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { Router, StaticRouter } from 'react-router-dom';

import {
  createResearchOutputResponse,
  createUserResponse,
  researchTagEnvironmentResponse,
  researchTagOrganismResponse,
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
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { createMemoryHistory, History } from 'history';
import ResearchOutputForm from '../ResearchOutputForm';
import { ENTER_KEYCODE } from '../../atoms/Dropdown';
import { createIdentifierField } from '../../utils/research-output-form';

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
  getShortDescriptionFromDescription: jest.fn(),
};

jest.setTimeout(60000);

it('sets authors to required', () => {
  render(
    <StaticRouter>
      <ResearchOutputForm {...defaultProps} authorsRequired={false} />
    </StaticRouter>,
  );
  expect(
    screen.getByRole('textbox', { name: 'Authors (optional)' }),
  ).toBeVisible();
  render(
    <StaticRouter>
      <ResearchOutputForm {...defaultProps} authorsRequired={true} />
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
      <ResearchOutputForm {...defaultProps} />
    </StaticRouter>,
  );
  expect(
    screen.getByRole('heading', { name: /What are you sharing/i }),
  ).toBeVisible();
  expect(screen.getByRole('button', { name: /Publish/i })).toBeVisible();
});

it('renders the edit form button when research output data is present', async () => {
  jest.spyOn(console, 'error').mockImplementation();
  render(
    <StaticRouter>
      <ResearchOutputForm
        {...defaultProps}
        researchOutputData={createResearchOutputResponse()}
      />
    </StaticRouter>,
  );

  expect(screen.getByRole('button', { name: /Save/i })).toBeVisible();
});

it('pre populates the form with provided backend response', async () => {
  jest.spyOn(console, 'error').mockImplementation();

  const researchOutputData = {
    ...createResearchOutputResponse(),
    title: 'test title',
    link: 'https://test.com',
    descriptionMD: 'test description',
    shortDescription: 'short description',
    type: 'Genetic Data - DNA' as ResearchOutputType,
    keywords: ['testAddedTag'],
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
        {...defaultProps}
        documentType={'Dataset'}
        typeOptions={Array.from(researchOutputDocumentTypeToType.Dataset)}
        researchOutputData={researchOutputData}
      />
    </StaticRouter>,
  );

  expect(screen.getByTestId('editor')).toBeVisible();
  expect(screen.getByText(researchOutputData.shortDescription)).toBeVisible();
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
  jest.spyOn(console, 'error').mockImplementation();

  const researchOutputData = {
    ...createResearchOutputResponse(),
    usageNotes: 'rich text',
    usageNotesMD: 'markdown',
  };
  await render(
    <StaticRouter>
      <ResearchOutputForm
        {...defaultProps}
        documentType={'Dataset'}
        typeOptions={Array.from(researchOutputDocumentTypeToType.Dataset)}
        researchOutputData={researchOutputData}
      />
    </StaticRouter>,
  );

  expect(screen.queryByText('rich text')).not.toBeInTheDocument();
  expect(screen.getByText('markdown')).toBeVisible();
});

it('displays keywords suggestions', async () => {
  await render(
    <StaticRouter>
      <ResearchOutputForm
        {...defaultProps}
        tagSuggestions={['2D Cultures', 'Adenosine', 'Adrenal']}
      />
    </StaticRouter>,
  );
  userEvent.click(
    screen.getByText(/Start typing\.\.\. \(E\.g\. Cell Biology\)/i),
  );
  expect(screen.getByText('2D Cultures')).toBeVisible();
  expect(screen.getByText('Adenosine')).toBeVisible();
  expect(screen.getByText('Adrenal')).toBeVisible();
});

it('displays selected teams', async () => {
  await render(
    <StaticRouter>
      <ResearchOutputForm
        {...defaultProps}
        selectedTeams={[{ label: 'Team 1', value: 'abc123' }]}
      />
    </StaticRouter>,
  );
  expect(screen.getByText('Team 1')).toBeVisible();
});

it('displays error message when no author is found', async () => {
  const getAuthorSuggestions = jest.fn().mockResolvedValue([]);
  await render(
    <StaticRouter>
      <ResearchOutputForm
        {...defaultProps}
        getAuthorSuggestions={getAuthorSuggestions}
      />
    </StaticRouter>,
  );

  userEvent.click(screen.getByRole('textbox', { name: /Authors/i }));
  expect(screen.getByText(/Sorry, no authors match/i)).toBeVisible();
});

it('displays error message when no lab is found', async () => {
  const getLabSuggestions = jest.fn().mockResolvedValue([]);
  await render(
    <StaticRouter>
      <ResearchOutputForm
        {...defaultProps}
        getLabSuggestions={getLabSuggestions}
      />
    </StaticRouter>,
  );
  userEvent.click(screen.getByRole('textbox', { name: /Labs/i }));
  expect(screen.getByText(/Sorry, no labs match/i)).toBeVisible();
});

it('displays error message when no related research is found', async () => {
  const getRelatedResearchSuggestions = jest.fn().mockResolvedValue([]);
  await render(
    <StaticRouter>
      <ResearchOutputForm
        {...defaultProps}
        getRelatedResearchSuggestions={getRelatedResearchSuggestions}
      />
    </StaticRouter>,
  );
  userEvent.click(screen.getByRole('textbox', { name: /Related Outputs/i }));
  expect(screen.getByText(/Sorry, no related outputs match/i)).toBeVisible();
});

it('displays current team within the form', async () => {
  render(
    <StaticRouter>
      <ResearchOutputForm
        {...defaultProps}
        selectedTeams={[{ label: 'example team', value: 'id' }]}
      />
    </StaticRouter>,
  );
  expect(screen.getByText('example team')).toBeVisible();
});

it('can generate short description when description is present', async () => {
  const getShortDescriptionFromDescription = jest
    .fn()
    .mockResolvedValue('An interesting article');
  const researchOutputData = {
    ...createResearchOutputResponse(),
    shortDescription: '',
  };
  render(
    <StaticRouter>
      <ResearchOutputForm
        {...defaultProps}
        researchOutputData={researchOutputData}
        getShortDescriptionFromDescription={getShortDescriptionFromDescription}
      />
    </StaticRouter>,
  );
  expect(
    screen.getByRole('textbox', { name: /short description/i }),
  ).toHaveValue('');

  userEvent.click(screen.getByRole('button', { name: /Generate/i }));

  await waitFor(() => {
    expect(
      screen.getByRole('textbox', { name: /short description/i }),
    ).toHaveValue('An interesting article');
  });
});

describe('on submit', () => {
  let history!: History;
  const id = '42';
  const saveDraftFn = jest.fn();
  const saveFn = jest.fn();
  const getLabSuggestions = jest.fn();
  const getAuthorSuggestions = jest.fn();
  const getRelatedResearchSuggestions = jest.fn();
  const getShortDescriptionFromDescription = jest.fn();

  beforeEach(() => {
    history = createMemoryHistory();
    saveDraftFn.mockResolvedValue({ ...createResearchOutputResponse(), id });
    saveFn.mockResolvedValue({ ...createResearchOutputResponse(), id });
    getLabSuggestions.mockResolvedValue([]);
    getAuthorSuggestions.mockResolvedValue([]);
    getRelatedResearchSuggestions.mockResolvedValue([]);
    getShortDescriptionFromDescription.mockReturnValue('short description');

    // TODO: fix act error
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
    shortDescription: 'short description',
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
    published: false,
    relatedEvents: [],
  };
  type Data = Pick<
    ResearchOutputPostRequest,
    'link' | 'title' | 'descriptionMD' | 'shortDescription' | 'type'
  >;

  const setupForm = async (
    {
      data = {
        descriptionMD: 'example description',
        shortDescription: 'short description',
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
        shortDescription: 'short description',
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
          getShortDescriptionFromDescription={
            getShortDescriptionFromDescription
          }
          researchTags={researchTags}
          {...propOverride}
        />
      </Router>,
    );

    fireEvent.change(screen.getByLabelText(/url/i), {
      target: { value: data.link },
    });
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: data.title },
    });

    const descriptionEditor = screen.getByTestId('editor');
    userEvent.click(descriptionEditor);
    userEvent.tab();
    fireEvent.input(descriptionEditor, { data: data.descriptionMD });
    userEvent.tab();

    fireEvent.change(
      screen.getByRole('textbox', { name: /short description/i }),
      {
        target: { value: data.shortDescription },
      },
    );

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
    fireEvent.change(screen.getByPlaceholderText('e.g. 10.5555/YFRU1371'), {
      target: { value: '10.1234' },
    });
  };
  const submitForm = async () => {
    const button = screen.getByRole('button', { name: /Publish/i });
    userEvent.click(button);
    userEvent.click(screen.getByRole('button', { name: /Publish Output/i }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Publish' })).toBeEnabled();
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeEnabled();
    });
  };

  const saveForm = async () => {
    const button = screen.getByRole('button', { name: /save/i });
    userEvent.click(button);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeEnabled();
    });
  };

  it('can update a published form with minimum data', async () => {
    await setupForm({ propOverride: { published: true } });
    await saveForm();
    expect(saveFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
      published: true,
    });
    expect(history.location.pathname).toEqual(`/shared-research/${id}`);
  });

  it('will show you confirmation dialog and allow you to cancel it', async () => {
    await setupForm();
    const button = screen.getByRole('button', { name: /Publish/i });
    userEvent.click(button);
    expect(
      screen.getByRole('button', { name: 'Publish Output' }),
    ).toBeVisible();
    userEvent.click(screen.getAllByRole('button', { name: /Cancel/i })[0]!);
    expect(screen.queryByRole('button', { name: 'Publish Output' })).toBeNull();
    expect(saveFn).not.toHaveBeenCalled();
  });

  it.only('field tests', async () => {
    getLabSuggestions.mockResolvedValue([
      { label: 'One Lab', value: '1' },
      { label: 'Two Lab', value: '2' },
    ]);
    getRelatedResearchSuggestions.mockResolvedValue([
      { label: 'First Related Research', value: '1' },
      { label: 'Second Related Research', value: '2' },
    ]);
    getAuthorSuggestions.mockResolvedValue([
      {
        author: { ...createUserResponse(), displayName: 'Chris Blue' },
        label: 'Chris Blue',
        value: 'u2',
      },
      {
        author: {
          id: 'external-chris',
          displayName: 'Chris Reed',
        },
        label: 'Chris Reed (Non CRN)',
        value: 'u1',
      },
    ]);

    await setupForm();

    // can submit a lab

    userEvent.click(screen.getByRole('textbox', { name: /Labs/i }));
    userEvent.click(screen.getByText('One Lab'));

    // related research
    userEvent.click(screen.getByRole('textbox', { name: /Related Outputs/i }));
    userEvent.click(screen.getByText('First Related Research'));

    // authors
    const authors = screen.getByRole('textbox', { name: /Authors/i });
    userEvent.click(authors);
    userEvent.click(screen.getByText(/Chris Reed/i));
    userEvent.click(authors);
    userEvent.click(screen.getByText('Chris Blue'));
    userEvent.click(authors);
    userEvent.type(authors, 'Alex White');
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    userEvent.click(screen.getAllByText('Alex White')[1]!);

    // access instructions
    userEvent.type(
      screen.getByRole('textbox', { name: /usage notes/i }),
      'Access Instructions',
    );

    await submitForm();

    expect(saveFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
      labs: ['1'],
      relatedResearch: ['1'],
      authors: [
        {
          externalAuthorId: 'u1',
        },
        { userId: 'u2' },
        { externalAuthorName: 'Alex White' },
      ],
      usageNotes: 'Access Instructions',
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
    expect(saveDraftFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
      published: false,
    });
    await waitFor(() => {
      expect(history.location.pathname).toEqual(`/shared-research/${id}`);
      expect(history.location.search).toEqual('?draftCreated=true');
    });
  });
});
