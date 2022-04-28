import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router-dom';
import { ComponentProps } from 'react';
import { fireEvent, waitFor } from '@testing-library/dom';
import { createTeamResponse, createUserResponse } from '@asap-hub/fixtures';
import {
  ResearchOutputIdentifierType,
  ResearchOutputPostRequest,
} from '@asap-hub/model';

import TeamCreateOutputForm, {
  createIdentifierField,
} from '../TeamCreateOutputForm';
import { ENTER_KEYCODE } from '../../atoms/Dropdown';

const props: ComponentProps<typeof TeamCreateOutputForm> = {
  onSave: jest.fn(() => Promise.resolve()),
  tagSuggestions: [],
  documentType: 'Article',
  team: createTeamResponse(),
};

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
  const { getByText } = render(
    <StaticRouter>
      <TeamCreateOutputForm {...props} />
    </StaticRouter>,
  );
  expect(getByText(/What are you sharing/i)).toBeVisible();
});

it('displays proper message when no author is found', async () => {
  const getAuthorSuggestions = jest.fn();
  getAuthorSuggestions.mockResolvedValue([]);
  const { getByText } = render(
    <StaticRouter>
      <TeamCreateOutputForm
        {...props}
        getAuthorSuggestions={getAuthorSuggestions}
      />
    </StaticRouter>,
  );
  userEvent.click(screen.getByLabelText(/Authors/i));
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  expect(getByText(/Sorry, no authors match/i)).toBeVisible();
});

it('displays proper message when no lab is found', async () => {
  const getLabSuggestions = jest.fn();
  getLabSuggestions.mockResolvedValue([]);
  render(
    <StaticRouter>
      <TeamCreateOutputForm {...props} getLabSuggestions={getLabSuggestions} />
    </StaticRouter>,
  );
  userEvent.click(screen.getByLabelText(/Labs/i));
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  expect(screen.getByText(/Sorry, no labs match/i)).toBeVisible();
});

it('displays current team within the form', async () => {
  const { getByText } = render(
    <StaticRouter>
      <TeamCreateOutputForm
        {...props}
        team={{ ...createTeamResponse(), displayName: 'example team' }}
      />
    </StaticRouter>,
  );
  expect(getByText('example team')).toBeVisible();
});

describe('on submit', () => {
  let saveFn = jest.fn(() => promise);
  afterEach(() => {
    jest.resetAllMocks();
    saveFn = jest.fn(() => promise);
  });
  const getLabSuggestions = jest.fn();
  const getAuthorSuggestions = jest.fn();
  const promise = Promise.resolve();
  const expectedRequest: ResearchOutputPostRequest = {
    documentType: 'Article',
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
  };
  type Data = Pick<
    ResearchOutputPostRequest,
    'link' | 'title' | 'description' | 'type'
  >;

  const setupForm = (
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
      <StaticRouter>
        <TeamCreateOutputForm
          {...props}
          team={{ ...createTeamResponse(), id: 'TEAMID' }}
          documentType={documentType}
          onSave={saveFn}
          getLabSuggestions={getLabSuggestions}
          getAuthorSuggestions={getAuthorSuggestions}
        />
      </StaticRouter>,
    );

    fireEvent.change(screen.getByLabelText(/url/i), {
      target: { value: data.link },
    });
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: data.title },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: data.description },
    });
    userEvent.type(screen.getByLabelText(/Select the option/i), data.type);
    fireEvent.keyDown(screen.getByLabelText(/Select the option/i), {
      keyCode: ENTER_KEYCODE,
    });
  };
  const submitForm = async () => {
    const button = screen.getByRole('button', { name: /Share/i });
    userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Share/i })).toBeEnabled();
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeEnabled();
    });
  };

  it('can submit a form with minimum data', async () => {
    setupForm();
    await submitForm();
    expect(saveFn).toHaveBeenLastCalledWith(expectedRequest);
  });

  it('can submit a lab', async () => {
    getLabSuggestions.mockResolvedValue([
      { label: 'One Lab', value: '1' },
      { label: 'Two Lab', value: '2' },
    ]);
    setupForm();
    userEvent.click(screen.getByLabelText(/Labs/i));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );
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
    setupForm();

    userEvent.click(screen.getByLabelText(/Authors/i));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    userEvent.click(screen.getByText(/Chris Reed/i));

    userEvent.click(screen.getByLabelText(/Authors/i));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );
    userEvent.click(screen.getByText('Chris Blue'));

    userEvent.click(screen.getByLabelText(/Authors/i));
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    userEvent.type(screen.getByLabelText(/Authors/i), 'Alex White');
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );
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
    setupForm();
    userEvent.type(
      screen.getByLabelText(/access instructions/i),
      'Access Instructions',
    );
    await submitForm();
    expect(saveFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
      accessInstructions: 'Access Instructions',
    });
  });

  it('can submit published date', async () => {
    setupForm();
    userEvent.click(
      screen
        .getByRole('group', { name: /sharing status/i })
        .querySelectorAll('input')[1]!,
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
    setupForm({ ...expectedRequest, type: 'Animal Model' }, 'Lab Resource');
    userEvent.type(screen.getByLabelText(/Catalog Number/i), 'abc123');
    await submitForm();
    expect(saveFn).toHaveBeenLastCalledWith({
      ...expectedRequest,
      type: 'Animal Model',
      documentType: 'Lab Resource',
      labCatalogNumber: 'abc123',
    });
  });
});
