import { createTeamResponse, createUserResponse } from '@asap-hub/fixtures';
import {
  ResearchOutputIdentifierType,
  ResearchOutputPostRequest,
  ResearchOutputResponse,
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
import TeamCreateOutputForm, {
  createIdentifierField,
} from '../TeamCreateOutputForm';

const props: ComponentProps<typeof TeamCreateOutputForm> = {
  onSave: jest.fn(() => Promise.resolve()),
  tagSuggestions: [],
  documentType: 'Article',
  team: createTeamResponse(),
};

jest.setTimeout(60000);
describe('createIdentifierField', () => {
  it('maps the ResearchOutputIdentifierType to fields including the identifier', () => {
    expect(
      createIdentifierField(ResearchOutputIdentifierType.None, 'identifier'),
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
      <TeamCreateOutputForm {...props} />
    </StaticRouter>,
  );
  expect(
    screen.getByRole('heading', { name: /What are you sharing/i }),
  ).toBeVisible();
});

it('displays proper message when no author is found', async () => {
  const getAuthorSuggestions = jest.fn().mockResolvedValue([]);
  render(
    <StaticRouter>
      <TeamCreateOutputForm
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
      <TeamCreateOutputForm {...props} getLabSuggestions={getLabSuggestions} />
    </StaticRouter>,
  );
  userEvent.click(screen.getByRole('textbox', { name: /Labs/i }));
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  expect(screen.getByText(/Sorry, no labs match/i)).toBeVisible();
});

it('displays current team within the form', async () => {
  render(
    <StaticRouter>
      <TeamCreateOutputForm
        {...props}
        team={{ ...createTeamResponse(), displayName: 'example team' }}
      />
    </StaticRouter>,
  );
  expect(screen.getByText('example team')).toBeVisible();
});

it('is funded and publication are both yes, then the none option is removed', async () => {
  render(
    <StaticRouter>
      <TeamCreateOutputForm {...props} />
    </StaticRouter>,
  );
  const textbox = screen.getByRole('textbox', { name: /identifier/i });
  userEvent.click(textbox);
  expect(screen.getByText('None')).toBeVisible();

  const funded = screen.getByRole('group', {
    name: /Has this output been funded by ASAP/i,
  });
  userEvent.click(within(funded).getByText('Yes'));

  const publication = screen.getByRole('group', {
    name: /Has this output been used in a publication/i,
  });
  userEvent.click(within(publication).getByText('Yes'));
  userEvent.click(textbox);

  await waitFor(() => {
    expect(screen.queryByText('None')).toBeNull();
  });
});

describe('on submit', () => {
  let history!: History;
  const id = '42';
  beforeEach(() => {
    history = createMemoryHistory();
  });
  let saveFn = jest.fn(() => promise);
  afterEach(() => {
    jest.resetAllMocks();
    saveFn = jest.fn(() => promise);
  });
  const getLabSuggestions = jest.fn().mockResolvedValue([]);
  const getAuthorSuggestions = jest.fn().mockResolvedValue([]);
  const promise = Promise.resolve({ id } as ResearchOutputResponse);
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
    asapFunded: false,
    usedInPublication: false,
    sharingStatus: 'Network Only',
    addedDate: expect.anything(),
    methods: [],
  };
  type Data = Pick<
    ResearchOutputPostRequest,
    'link' | 'title' | 'description' | 'type'
  >;

  const setupForm = async (
    data: Data = {
      description: 'example description',
      title: 'example title',
      type: 'Preprint',
      link: 'http://example.com',
    },
    documentType: ComponentProps<
      typeof TeamCreateOutputForm
    >['documentType'] = 'Article',
  ) => {
    render(
      <Router history={history}>
        <TeamCreateOutputForm
          {...props}
          team={{ ...createTeamResponse(), id: 'TEAMID' }}
          documentType={documentType}
          onSave={saveFn}
          getLabSuggestions={getLabSuggestions}
          getAuthorSuggestions={getAuthorSuggestions}
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
    identifier.blur();
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
    await setupForm(
      { ...expectedRequest, type: 'Animal Model' },
      'Lab Resource',
    );
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
});
