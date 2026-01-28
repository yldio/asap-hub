import {
  AuthorResponse,
  AuthorSelectOption,
  manuscriptTypeLifecycles,
} from '@asap-hub/model';
import { cleanup, render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps, Suspense } from 'react';
import { StaticRouter } from 'react-router-dom/server';
import ManuscriptForm from '../ManuscriptForm';

jest.setTimeout(30_000);
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation();
  jest.clearAllMocks();
  cleanup();
});

const teamId = '1';

const mockGetLabSuggestions = jest.fn();
mockGetLabSuggestions.mockResolvedValue([
  { label: 'One Lab', value: '1' },
  { label: 'Two Lab', value: '2' },
]);

const getTeamSuggestions = jest.fn();
getTeamSuggestions.mockResolvedValue([
  { label: 'One Team', value: '1' },
  { label: 'Two Team', value: '2' },
]);

const getImpactSuggestionsMock = jest.fn().mockResolvedValue([
  { label: 'Impact A', value: 'impact-id-1' },
  { label: 'Impact B', value: 'impact-id-2' },
]);

const getCategorySuggestionsMock = jest.fn().mockResolvedValue([
  { label: 'Category A', value: 'category-id-1' },
  { label: 'Category B', value: 'category-id-2' },
]);

const defaultProps: ComponentProps<typeof ManuscriptForm> = {
  onCreate: jest.fn(() => Promise.resolve()),
  onUpdate: jest.fn(() => Promise.resolve()),
  onResubmit: jest.fn(() => Promise.resolve()),
  getShortDescriptionFromDescription: jest.fn(() => Promise.resolve('')),
  getAuthorSuggestions: jest.fn(),
  getLabSuggestions: mockGetLabSuggestions,
  getTeamSuggestions,
  selectedTeams: [{ value: '1', label: 'One Team', isFixed: true }],
  selectedLabs: [],
  handleFileUpload: jest.fn(() =>
    Promise.resolve({
      id: '123',
      filename: 'test.pdf',
      url: 'http://example.com/test.pdf',
    }),
  ),
  onSuccess: jest.fn(),
  teamId,
  eligibilityReasons: new Set(),
  acknowledgedGrantNumber: 'Yes',
  asapAffiliationIncluded: 'Yes',
  manuscriptLicense: 'Yes',
  datasetsDeposited: 'Yes',
  codeDeposited: 'Yes',
  protocolsDeposited: 'Yes',
  labMaterialsRegistered: 'Yes',
  availabilityStatement: 'Yes',
  description: 'Some description',
  firstAuthors: [
    {
      label: 'Author 1',
      value: 'author-1',
      id: 'author-1',
      displayName: 'Author 1',
    } as AuthorResponse & AuthorSelectOption,
  ],
  correspondingAuthor: [],
  additionalAuthors: [],
  onError: jest.fn(),
  clearFormToast: jest.fn(),
  isOpenScienceTeamMember: false,
  impact: { value: 'impact-id-1', label: 'Impact A' },
  categories: [{ value: 'category-id-1', label: 'Category A' }],
  getImpactSuggestions: getImpactSuggestionsMock,
  getCategorySuggestions: getCategorySuggestionsMock,
};

const renderManuscriptForm = async (
  props: ComponentProps<typeof ManuscriptForm>,
) => {
  const container = render(
    <StaticRouter location="/">
      <Suspense fallback={<div>Loading...</div>}>
        <ManuscriptForm {...props} />
      </Suspense>
    </StaticRouter>,
  );
  await waitFor(() => {
    expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
  });
  return container;
};

it('does not display the lifecycle select box until type is selected', async () => {
  await renderManuscriptForm(defaultProps);
  expect(
    screen.queryByLabelText(/Where is the manuscript in the life cycle/i),
  ).not.toBeInTheDocument();

  const combobox = screen.getByRole('combobox', {
    name: /Type of Manuscript/i,
  });
  await act(async () => {
    await userEvent.type(combobox, 'Original');
    await userEvent.type(combobox, '{Enter}');
    await userEvent.click(combobox);
  });

  await waitFor(() => {
    expect(
      screen.getByRole('combobox', {
        name: /Where is the manuscript in the life cycle/i,
      }),
    ).toBeInTheDocument();
  });
});

const manuscriptTypeLifecyclesFlat = manuscriptTypeLifecycles.flatMap(
  ({ types, lifecycle }) => types.map((type) => ({ type, lifecycle })),
);

it.each(manuscriptTypeLifecyclesFlat)(
  'displays $lifecycle lifecycle option for when $type type is selected',
  async ({ lifecycle, type }) => {
    await renderManuscriptForm({
      ...defaultProps,
      type,
      lifecycle,
    });

    const lifecycleCombobox = await screen.findByRole('combobox', {
      name: /Where is the manuscript in the life cycle/i,
    });
    await userEvent.click(lifecycleCombobox);

    const hiddenInput = screen.getByDisplayValue(lifecycle);
    expect(hiddenInput).toHaveValue(lifecycle);
  },
);

it('displays error message when no lifecycle was found', async () => {
  await renderManuscriptForm(defaultProps);

  const typeCombobox = screen.getByRole('combobox', {
    name: /Type of Manuscript/i,
  });
  await userEvent.type(typeCombobox, 'Original');
  await userEvent.type(typeCombobox, '{Enter}');
  typeCombobox.blur();

  const lifecycleCombobox = await screen.findByRole('combobox', {
    name: /Where is the manuscript in the life cycle/i,
  });
  await userEvent.type(lifecycleCombobox, 'invalid lifecycle');

  await waitFor(() => {
    expect(screen.getByText(/Sorry, no options match/i)).toBeVisible();
  });
});

it('maintains values provided when lifecycle changes but field is still visible', async () => {
  await renderManuscriptForm({ ...defaultProps, title: 'manuscript title' });

  const typeCombobox = screen.getByRole('combobox', {
    name: /Type of Manuscript/i,
  });
  await userEvent.type(typeCombobox, 'Original');
  await userEvent.type(typeCombobox, '{Enter}');
  typeCombobox.blur();

  const lifecycleCombobox = await screen.findByRole('combobox', {
    name: /Where is the manuscript in the life cycle/i,
  });
  await userEvent.type(
    lifecycleCombobox,
    'Publication with addendum or corrigendum',
  );
  await userEvent.type(lifecycleCombobox, '{Enter}');
  lifecycleCombobox.blur();

  const preprintDoi = '10.4444/test';
  const publicationDoi = '10.4467/test';

  const preprintDoiTextbox = await screen.findByRole('textbox', {
    name: /Preprint DOI/i,
  });
  await userEvent.type(preprintDoiTextbox, preprintDoi);

  const publicationDoiTextbox = screen.getByRole('textbox', {
    name: /Publication DOI/i,
  });
  await userEvent.type(publicationDoiTextbox, publicationDoi);

  expect(preprintDoiTextbox).toHaveValue(preprintDoi);
  expect(publicationDoiTextbox).toHaveValue(publicationDoi);

  await userEvent.type(lifecycleCombobox, 'Preprint');
  await userEvent.type(lifecycleCombobox, '{Enter}');
  lifecycleCombobox.blur();

  await waitFor(() => {
    expect(
      screen.getByRole('textbox', {
        name: /Preprint DOI/i,
      }),
    ).toHaveValue(preprintDoi);
  });
  expect(
    screen.queryByRole('textbox', {
      name: /Publication DOI/i,
    }),
  ).not.toBeInTheDocument();
});
