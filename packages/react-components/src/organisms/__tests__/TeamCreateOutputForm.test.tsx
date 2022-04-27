import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router-dom';
import { ComponentProps } from 'react';
import { fireEvent, waitFor } from '@testing-library/dom';
import { createTeamResponse, createUserResponse } from '@asap-hub/fixtures';
import { ResearchOutputIdentifierType } from '@asap-hub/model';

import TeamCreateOutputForm, {
  createIdentifierField,
} from '../TeamCreateOutputForm';
import { ENTER_KEYCODE } from '../../atoms/Dropdown';

const props: ComponentProps<typeof TeamCreateOutputForm> = {
  tagSuggestions: [],
  documentType: 'Article',
  team: createTeamResponse(),
};

const clickShare = () => {
  const button = screen.getByRole('button', { name: /Share/i });
  userEvent.click(button);
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
        ResearchOutputIdentifierType.LabCatalogNumber,
        'identifier',
      ),
    ).toEqual({ labCatalogNumber: 'identifier' });
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

it('can submit a form when form data is valid', async () => {
  const saveFn = jest.fn();
  const getLabSuggestions = jest.fn();
  const getAuthorSuggestions = jest.fn();
  getLabSuggestions.mockResolvedValue([
    { label: 'One Lab', value: '1' },
    { label: 'Two Lab', value: '2' },
  ]);
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
  render(
    <StaticRouter>
      <TeamCreateOutputForm
        {...props}
        team={{ ...createTeamResponse(), id: 'TEAMID' }}
        documentType="Lab Resource"
        onSave={saveFn}
        getLabSuggestions={getLabSuggestions}
        getAuthorSuggestions={getAuthorSuggestions}
      />
    </StaticRouter>,
  );

  fireEvent.change(screen.getByLabelText(/url/i), {
    target: { value: 'http://example.com' },
  });
  fireEvent.change(screen.getByLabelText(/title/i), {
    target: { value: 'example title' },
  });
  fireEvent.change(screen.getByLabelText(/description/i), {
    target: { value: 'example description' },
  });
  userEvent.type(screen.getByLabelText(/Select the option/i), 'Animal Model');
  fireEvent.keyDown(screen.getByLabelText(/Select the option/i), {
    keyCode: ENTER_KEYCODE,
  });

  fireEvent.click(
    screen
      .getByRole('group', { name: /funded by ASAP/i })
      .querySelectorAll('input')[0]!,
  );

  fireEvent.click(
    screen
      .getByRole('group', { name: /used in a publication/i })
      .querySelectorAll('input')[0]!,
  );

  fireEvent.click(
    screen
      .getByRole('group', { name: /sharing status/i })
      .querySelectorAll('input')[1]!,
  );

  userEvent.type(screen.getByLabelText(/date published/i), '2022-03-24');

  userEvent.click(screen.getByLabelText(/Labs/i));
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  userEvent.click(screen.getByText('One Lab'));

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

  userEvent.type(screen.getByLabelText(/identifier/i), 'DO');
  userEvent.click(screen.getByText('DOI'));
  fireEvent.change(screen.getByLabelText(/doi/i), {
    target: { value: 'doi:12.1234' },
  });

  clickShare();

  expect(screen.getByRole('button', { name: /Share/i })).not.toBeEnabled();
  expect(screen.getByRole('button', { name: /Cancel/i })).not.toBeEnabled();

  await act(() =>
    waitFor(() => {
      expect(saveFn).toHaveBeenCalledWith({
        tags: [],
        link: 'http://example.com',
        title: 'example title',
        description: 'example description',
        type: 'Animal Model',
        labs: ['1'],
        authors: [
          { externalAuthorId: 'u1' },
          { userId: 'u2' },
          { externalAuthorName: 'Alex White' },
        ],
        teams: ['TEAMID'],
        asapFunded: true,
        usedInPublication: true,
        sharingStatus: 'Public',
        publishDate: new Date('2022-03-24').toISOString(),
        doi: 'doi:12.1234',
      });
      expect(screen.getByRole('button', { name: /Share/i })).toBeEnabled();
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeEnabled();
    }),
  );
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
  const { getByText } = render(
    <StaticRouter>
      <TeamCreateOutputForm {...props} getLabSuggestions={getLabSuggestions} />
    </StaticRouter>,
  );
  userEvent.click(screen.getByLabelText(/Labs/i));
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  expect(getByText(/Sorry, no labs match/i)).toBeVisible();
});
