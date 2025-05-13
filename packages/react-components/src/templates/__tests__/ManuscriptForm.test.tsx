import {
  act,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import { ComponentProps } from 'react';
import { MemoryRouter, Route, Router, StaticRouter } from 'react-router-dom';
import { createMemoryHistory, History } from 'history';
import userEvent, { specialChars } from '@testing-library/user-event';
import { createMessage } from '@asap-hub/fixtures';
import {
  AuthorResponse,
  AuthorSelectOption,
  ManuscriptFileType,
  manuscriptFormFieldsMapping,
  ManuscriptLifecycle,
  ManuscriptType,
  manuscriptTypeLifecycles,
  QuickCheck,
  QuickCheckDetails,
  quickCheckQuestions,
} from '@asap-hub/model';
import ManuscriptForm from '../ManuscriptForm';

jest.mock(
  'react-lottie',
  () =>
    function MockLottie() {
      return <div>Loading...</div>;
    },
);

let history!: History;

jest.setTimeout(30_000);
beforeEach(() => {
  history = createMemoryHistory();
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

const defaultProps: ComponentProps<typeof ManuscriptForm> = {
  onCreate: jest.fn(() => Promise.resolve()),
  onUpdate: jest.fn(() => Promise.resolve()),
  onResubmit: jest.fn(() => Promise.resolve()),
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
};

const submitForm = async () => {
  await act(async () => {
    userEvent.click(await screen.findByRole('button', { name: /Submit/ }));
  });

  userEvent.click(screen.getByRole('button', { name: /Submit Manuscript/ }));
};

it('renders the form', async () => {
  render(
    <StaticRouter>
      <ManuscriptForm {...defaultProps} />
    </StaticRouter>,
  );
  expect(
    screen.getByRole('heading', { name: /What are you sharing/i }),
  ).toBeVisible();
  expect(screen.getByRole('button', { name: /Submit/ })).toBeVisible();
});

it('data is sent on form submission', async () => {
  const onCreate = jest.fn();
  render(
    <StaticRouter>
      <ManuscriptForm
        {...defaultProps}
        title="manuscript title"
        type="Original Research"
        lifecycle="Draft Manuscript (prior to Publication)"
        manuscriptFile={{
          id: '123',
          filename: 'test.pdf',
          url: 'http://example.com/test.pdf',
        }}
        keyResourceTable={{
          id: '124',
          filename: 'test.csv',
          url: 'http://example.com/test.csv',
        }}
        onCreate={onCreate}
      />
    </StaticRouter>,
  );

  await submitForm();
  await waitFor(() => {
    expect(onCreate).toHaveBeenCalledWith({
      title: 'manuscript title',
      eligibilityReasons: [],
      versions: [
        {
          type: 'Original Research',
          lifecycle: 'Draft Manuscript (prior to Publication)',
          manuscriptFile: {
            id: '123',
            filename: 'test.pdf',
            url: 'http://example.com/test.pdf',
          },
          keyResourceTable: {
            id: '124',
            filename: 'test.csv',
            url: 'http://example.com/test.csv',
          },
          acknowledgedGrantNumber: 'Yes',
          asapAffiliationIncluded: 'Yes',
          manuscriptLicense: undefined,
          datasetsDeposited: 'Yes',
          codeDeposited: 'Yes',
          protocolsDeposited: 'Yes',
          labMaterialsRegistered: 'Yes',
          availabilityStatement: 'Yes',

          acknowledgedGrantNumberDetails: '',
          asapAffiliationIncludedDetails: '',
          manuscriptLicenseDetails: '',
          datasetsDepositedDetails: '',
          codeDepositedDetails: '',
          protocolsDepositedDetails: '',
          labMaterialsRegisteredDetails: '',
          availabilityStatementDetails: '',

          teams: ['1'],
          labs: [],

          description: 'Some description',
          firstAuthors: [],
          additionalAuthors: [],
        },
      ],
      teamId,
    });
  });
});

test.each`
  field                        | fieldDetails
  ${'acknowledgedGrantNumber'} | ${'acknowledgedGrantNumberDetails'}
  ${'asapAffiliationIncluded'} | ${'asapAffiliationIncludedDetails'}
  ${'availabilityStatement'}   | ${'availabilityStatementDetails'}
  ${'manuscriptLicense'}       | ${'manuscriptLicenseDetails'}
  ${'datasetsDeposited'}       | ${'datasetsDepositedDetails'}
  ${'codeDeposited'}           | ${'codeDepositedDetails'}
  ${'protocolsDeposited'}      | ${'protocolsDepositedDetails'}
  ${'labMaterialsRegistered'}  | ${'labMaterialsRegisteredDetails'}
`(
  'should send $fieldDetails value if $field is No',
  async ({
    field,
    fieldDetails,
  }: {
    field: QuickCheck;
    fieldDetails: QuickCheckDetails;
  }) => {
    const onCreate = jest.fn();
    const getDiscussion = jest.fn(() => ({
      id: 'discussion-1',
      message: createMessage('Explanation'),
    }));
    const props = {
      ...defaultProps,
      [field]: 'No',
      [fieldDetails]: 'Explanation',
      getDiscussion,
    };
    render(
      <StaticRouter>
        <ManuscriptForm
          {...props}
          title="manuscript title"
          type="Original Research"
          publicationDoi="10.0777"
          lifecycle="Publication"
          manuscriptFile={{
            id: '123',
            filename: 'test.pdf',
            url: 'http://example.com/test.pdf',
          }}
          keyResourceTable={{
            id: '124',
            filename: 'test.csv',
            url: 'http://example.com/test.csv',
          }}
          onCreate={onCreate}
        />
      </StaticRouter>,
    );

    await submitForm();
    const payload = {
      title: 'manuscript title',
      eligibilityReasons: [],
      versions: [
        {
          type: 'Original Research',
          lifecycle: 'Publication',
          manuscriptFile: expect.anything(),
          keyResourceTable: expect.anything(),
          publicationDoi: '10.0777',
          acknowledgedGrantNumber: 'Yes',
          asapAffiliationIncluded: 'Yes',
          manuscriptLicense: 'Yes',
          datasetsDeposited: 'Yes',
          codeDeposited: 'Yes',
          protocolsDeposited: 'Yes',
          labMaterialsRegistered: 'Yes',
          availabilityStatement: 'Yes',

          acknowledgedGrantNumberDetails: '',
          asapAffiliationIncludedDetails: '',
          manuscriptLicenseDetails: '',
          datasetsDepositedDetails: '',
          codeDepositedDetails: '',
          protocolsDepositedDetails: '',
          labMaterialsRegisteredDetails: '',
          availabilityStatementDetails: '',

          teams: ['1'],
          labs: [],

          description: 'Some description',
          firstAuthors: [],
          additionalAuthors: [],
        },
      ],
      teamId,
    };
    payload.versions[0]![field] = 'No';
    payload.versions[0]![fieldDetails] = 'Explanation';
    await waitFor(() => {
      expect(onCreate).toHaveBeenCalledWith(payload);
    });
  },
);

test.each`
  field                        | fieldDetails
  ${'acknowledgedGrantNumber'} | ${'acknowledgedGrantNumberDetails'}
  ${'asapAffiliationIncluded'} | ${'asapAffiliationIncludedDetails'}
  ${'availabilityStatement'}   | ${'availabilityStatementDetails'}
  ${'manuscriptLicense'}       | ${'manuscriptLicenseDetails'}
  ${'datasetsDeposited'}       | ${'datasetsDepositedDetails'}
  ${'codeDeposited'}           | ${'codeDepositedDetails'}
  ${'protocolsDeposited'}      | ${'protocolsDepositedDetails'}
  ${'labMaterialsRegistered'}  | ${'labMaterialsRegisteredDetails'}
`(
  'should send $fieldDetails value if $field is Not applicable',
  async ({
    field,
    fieldDetails,
  }: {
    field: QuickCheck;
    fieldDetails: QuickCheckDetails;
  }) => {
    const onCreate = jest.fn();
    const getDiscussion = jest.fn(() => ({
      id: 'discussion-1',
      message: createMessage('Explanation'),
    }));
    const props = {
      ...defaultProps,
      [field]: 'Not applicable',
      [fieldDetails]: 'Explanation',
      getDiscussion,
    };
    render(
      <StaticRouter>
        <ManuscriptForm
          {...props}
          title="manuscript title"
          type="Original Research"
          publicationDoi="10.0777"
          lifecycle="Publication"
          manuscriptFile={{
            id: '123',
            filename: 'test.pdf',
            url: 'http://example.com/test.pdf',
          }}
          keyResourceTable={{
            id: '124',
            filename: 'test.csv',
            url: 'http://example.com/test.csv',
          }}
          onCreate={onCreate}
        />
      </StaticRouter>,
    );

    await submitForm();
    const payload = {
      title: 'manuscript title',
      eligibilityReasons: [],
      versions: [
        {
          type: 'Original Research',
          lifecycle: 'Publication',
          manuscriptFile: expect.anything(),
          keyResourceTable: expect.anything(),
          publicationDoi: '10.0777',
          acknowledgedGrantNumber: 'Yes',
          asapAffiliationIncluded: 'Yes',
          manuscriptLicense: 'Yes',
          datasetsDeposited: 'Yes',
          codeDeposited: 'Yes',
          protocolsDeposited: 'Yes',
          labMaterialsRegistered: 'Yes',
          availabilityStatement: 'Yes',

          acknowledgedGrantNumberDetails: '',
          asapAffiliationIncludedDetails: '',
          manuscriptLicenseDetails: '',
          datasetsDepositedDetails: '',
          codeDepositedDetails: '',
          protocolsDepositedDetails: '',
          labMaterialsRegisteredDetails: '',
          availabilityStatementDetails: '',

          teams: ['1'],
          labs: [],

          description: 'Some description',
          firstAuthors: [],
          additionalAuthors: [],
        },
      ],
      teamId,
    };
    payload.versions[0]![field] = 'Not applicable';
    payload.versions[0]![fieldDetails] = 'Explanation';
    await waitFor(() => {
      expect(onCreate).toHaveBeenCalledWith(payload);
    });
  },
);

test.each`
  field                        | fieldDetails
  ${'acknowledgedGrantNumber'} | ${'acknowledgedGrantNumberDetails'}
  ${'asapAffiliationIncluded'} | ${'asapAffiliationIncludedDetails'}
  ${'availabilityStatement'}   | ${'availabilityStatementDetails'}
  ${'manuscriptLicense'}       | ${'manuscriptLicenseDetails'}
  ${'datasetsDeposited'}       | ${'datasetsDepositedDetails'}
  ${'codeDeposited'}           | ${'codeDepositedDetails'}
  ${'protocolsDeposited'}      | ${'protocolsDepositedDetails'}
  ${'labMaterialsRegistered'}  | ${'labMaterialsRegisteredDetails'}
`(
  'should send $fieldDetails as empty string if $field is Yes',
  async ({
    field,
    fieldDetails,
  }: {
    field: QuickCheck;
    fieldDetails: QuickCheckDetails;
  }) => {
    const onCreate = jest.fn();
    const props = {
      ...defaultProps,
      [field]: 'Yes',
      [fieldDetails]: { message: { text: 'Explanation' } },
    };
    render(
      <StaticRouter>
        <ManuscriptForm
          {...props}
          title={undefined}
          type="Original Research"
          publicationDoi="10.0777"
          lifecycle="Publication"
          manuscriptFile={{
            id: '123',
            filename: 'test.pdf',
            url: 'http://example.com/test.pdf',
          }}
          keyResourceTable={{
            id: '124',
            filename: 'test.csv',
            url: 'http://example.com/test.csv',
          }}
          onCreate={onCreate}
        />
      </StaticRouter>,
    );

    userEvent.type(
      screen.getByRole('textbox', { name: /Title of Manuscript/i }),
      'manuscript title',
    );
    const quickCheckFields = quickCheckQuestions.map((q) => q.field);

    quickCheckFields.forEach((f) => {
      within(screen.getByTestId(f)).getByText('Yes').click();
    });

    await submitForm();

    await waitFor(() => {
      expect(onCreate).toHaveBeenCalledWith({
        title: 'manuscript title',
        eligibilityReasons: [],
        versions: [
          expect.objectContaining({
            acknowledgedGrantNumber: 'Yes',
            asapAffiliationIncluded: 'Yes',
            manuscriptLicense: 'Yes',
            datasetsDeposited: 'Yes',
            codeDeposited: 'Yes',
            protocolsDeposited: 'Yes',
            labMaterialsRegistered: 'Yes',
            availabilityStatement: 'Yes',

            acknowledgedGrantNumberDetails: '',
            asapAffiliationIncludedDetails: '',
            manuscriptLicenseDetails: '',
            datasetsDepositedDetails: '',
            codeDepositedDetails: '',
            protocolsDepositedDetails: '',
            labMaterialsRegisteredDetails: '',
            availabilityStatementDetails: '',
          }),
        ],
        teamId,
      });
    });
  },
);

it('displays an error message when user selects no in a quick check and does not provide details', async () => {
  const onCreate = jest.fn();
  render(
    <StaticRouter>
      <ManuscriptForm
        {...defaultProps}
        title="manuscript title"
        type="Original Research"
        publicationDoi="10.0777"
        lifecycle="Publication"
        manuscriptFile={{
          id: '123',
          filename: 'test.pdf',
          url: 'http://example.com/test.pdf',
        }}
        onCreate={onCreate}
      />
    </StaticRouter>,
  );
  expect(
    screen.queryByText(/Please enter the details./i),
  ).not.toBeInTheDocument();

  const quickCheckFields = quickCheckQuestions.map((q) => q.field);

  quickCheckFields
    .filter((f) => f !== 'acknowledgedGrantNumber')
    .forEach((f) => {
      within(screen.getByTestId(f)).getByText('Yes').click();
    });

  within(screen.getByTestId('acknowledgedGrantNumber')).getByText('No').click();

  userEvent.click(screen.getByRole('button', { name: /Submit/ }));

  await waitFor(() => {
    expect(
      screen.getAllByText(/Please enter the details./i).length,
    ).toBeGreaterThan(0);
  });

  userEvent.type(
    screen.getByLabelText(/Please provide details/i),
    'Some details',
  );

  userEvent.click(screen.getByRole('button', { name: /Submit/ }));

  await waitFor(() => {
    expect(
      screen.queryByText(/Please enter the details./i),
    ).not.toBeInTheDocument();
  });
});

it('does not display the lifecycle select box until type is selected', async () => {
  render(
    <StaticRouter>
      <ManuscriptForm {...defaultProps} />
    </StaticRouter>,
  );
  expect(
    screen.queryByLabelText(/Where is the manuscript in the life cycle/i),
  ).not.toBeInTheDocument();

  const textbox = screen.getByRole('textbox', { name: /Type of Manuscript/i });
  userEvent.type(textbox, 'Original');
  userEvent.type(textbox, specialChars.enter);
  textbox.blur();

  expect(
    screen.getByRole('textbox', {
      name: /Where is the manuscript in the life cycle/i,
    }),
  ).toBeInTheDocument();
});

const manuscriptTypeLifecyclesFlat = manuscriptTypeLifecycles.flatMap(
  ({ types, lifecycle }) => types.map((type) => ({ type, lifecycle })),
);
it.each(manuscriptTypeLifecyclesFlat)(
  'displays $lifecycle lifecycle option for when $type type is selected',
  async ({ lifecycle, type }) => {
    render(
      <StaticRouter>
        <ManuscriptForm {...defaultProps} type={type} lifecycle="" />
      </StaticRouter>,
    );

    const lifecycleTextbox = screen.getByRole('textbox', {
      name: /Where is the manuscript in the life cycle/i,
    });
    userEvent.click(lifecycleTextbox);

    expect(screen.getByText(lifecycle)).toBeVisible();
  },
);

it('displays error message when manuscript title is missing', async () => {
  render(
    <StaticRouter>
      <ManuscriptForm {...defaultProps} />
    </StaticRouter>,
  );

  const input = screen.getByRole('textbox', { name: /Title of Manuscript/i });
  const submitButton = screen.getByRole('button', { name: /Submit/ });

  userEvent.click(submitButton);

  await waitFor(() => {
    expect(submitButton).toBeEnabled();
  });
  expect(
    screen.getAllByText(/Please enter a title/i).length,
  ).toBeGreaterThanOrEqual(1);

  userEvent.type(input, 'title');

  userEvent.click(submitButton);

  await waitFor(() => {
    expect(submitButton).toBeEnabled();
  });
  expect(screen.queryByText(/Please enter a title/i)).toBeNull();
});

it('displays error message when manuscript title is not unique', async () => {
  const onUpdate = jest.fn().mockRejectedValueOnce({
    statusCode: 422,
    response: {
      message: 'Title must be unique',
    },
  });
  render(
    <StaticRouter>
      <ManuscriptForm
        {...defaultProps}
        title="manuscript title"
        type="Original Research"
        lifecycle="Draft Manuscript (prior to Publication)"
        manuscriptFile={{
          id: '123',
          filename: 'test.pdf',
          url: 'http://example.com/test.pdf',
        }}
        keyResourceTable={{
          id: '124',
          filename: 'test.csv',
          url: 'http://example.com/test.csv',
        }}
        manuscriptId="manuscript-id"
        onUpdate={onUpdate}
      />
    </StaticRouter>,
  );

  await submitForm();

  await waitFor(() => {
    expect(onUpdate).toHaveBeenCalled();
  });

  await waitFor(() => {
    expect(
      screen.getAllByText(
        'This title is already in use. Please choose a different one.',
      ).length,
    ).toBeGreaterThan(0);
  });
});

it('displays error message when no type was found', async () => {
  render(
    <StaticRouter>
      <ManuscriptForm {...defaultProps} />
    </StaticRouter>,
  );

  const textbox = screen.getByRole('textbox', { name: /Type of Manuscript/i });
  userEvent.type(textbox, 'invalid type');

  expect(screen.getByText(/Sorry, no types match/i)).toBeVisible();
});

it('displays error message when no lifecycle was found', async () => {
  render(
    <StaticRouter>
      <ManuscriptForm {...defaultProps} />
    </StaticRouter>,
  );

  const typeTextbox = screen.getByRole('textbox', {
    name: /Type of Manuscript/i,
  });
  userEvent.type(typeTextbox, 'Original');
  userEvent.type(typeTextbox, specialChars.enter);
  typeTextbox.blur();

  const lifecycleTextbox = screen.getByRole('textbox', {
    name: /Where is the manuscript in the life cycle/i,
  });
  userEvent.type(lifecycleTextbox, 'invalid lifecycle');

  expect(screen.getByText(/Sorry, no options match/i)).toBeVisible();
});

it('displays error message when manuscript title is bigger than 256 characters', async () => {
  render(
    <StaticRouter>
      <ManuscriptForm {...defaultProps} />
    </StaticRouter>,
  );

  const input = screen.getByRole('textbox', {
    name: /Title of Manuscript/i,
  });
  userEvent.type(
    input,
    "Advancements in Parkinson's Disease Research: Investigating the Role of Genetic Mutations and DNA Sequencing Technologies in Unraveling the Molecular Mechanisms, Identifying Biomarkers, and Developing Targeted Therapies for Improved Diagnosis and Treatment of Parkinson Disease",
  );

  const submitButton = screen.getByRole('button', { name: /Submit/ });

  userEvent.click(submitButton);

  await waitFor(() => {
    expect(submitButton).toBeEnabled();
  });

  expect(
    screen.getAllByText(/This title cannot exceed 256 characters./i).length,
  ).toBeGreaterThanOrEqual(1);
});

it('displays error message when other details is bigger than 256 characters', async () => {
  render(
    <StaticRouter>
      <ManuscriptForm
        {...defaultProps}
        title="Manuscript"
        type="Original Research"
        lifecycle="Other"
      />
    </StaticRouter>,
  );

  const input = screen.getByRole('textbox', {
    name: /Please provide details/i,
  });
  userEvent.type(
    input,
    "Advancements in Parkinson's Disease Research: Investigating the Role of Genetic Mutations and DNA Sequencing Technologies in Unraveling the Molecular Mechanisms, Identifying Biomarkers, and Developing Targeted Therapies for Improved Diagnosis and Treatment of Parkinson Disease",
  );

  const submitButton = screen.getByRole('button', { name: /Submit/ });

  userEvent.click(submitButton);

  await waitFor(() => {
    expect(submitButton).toBeEnabled();
  });

  expect(
    screen.getAllByText(/Details cannot exceed 256 characters./i).length,
  ).toBeGreaterThanOrEqual(1);
});

describe('authors', () => {
  it.each`
    section                   | submittedValue
    ${/Corresponding Author/} | ${{ correspondingAuthor: { userId: 'author-1' } }}
    ${/Additional Authors/}   | ${{ additionalAuthors: [{ userId: 'author-1' }] }}
  `(
    'submits an existing internal author in $section',
    async ({ section, submittedValue }) => {
      const onCreate = jest.fn();

      const getAuthorSuggestionsMock = jest.fn().mockResolvedValue([
        {
          author: {
            id: 'author-1',
            firstName: 'Author',
            lastName: 'One',
            displayName: 'Author One',
            __meta: {
              type: 'user',
            },
          },
          label: 'Author One',
          value: 'author-1',
        },
      ]);

      render(
        <StaticRouter>
          <ManuscriptForm
            {...defaultProps}
            title="manuscript title"
            onCreate={onCreate}
            type="Original Research"
            lifecycle="Publication"
            preprintDoi="10.4444/test"
            publicationDoi="10.4467/test"
            manuscriptFile={{
              id: '123',
              url: 'https://test-url',
              filename: 'abc.jpeg',
            }}
            keyResourceTable={{
              id: '124',
              url: 'https://test-url',
              filename: 'abc.jpeg',
            }}
            getAuthorSuggestions={getAuthorSuggestionsMock}
          />
        </StaticRouter>,
      );

      userEvent.click(screen.getByLabelText(section));
      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
      );
      userEvent.click(screen.getByText('Author One'));

      await submitForm();
      await waitFor(() => {
        expect(onCreate).toHaveBeenCalledWith(
          expect.objectContaining({
            versions: [expect.objectContaining(submittedValue)],
          }),
        );
      });
    },
  );

  it.each`
    section                   | submittedValue
    ${/Corresponding Author/} | ${{ correspondingAuthor: { externalAuthorEmail: 'external@author.com', externalAuthorId: 'external-author-1', externalAuthorName: 'External Author One' } }}
    ${/Additional Authors/}   | ${{ additionalAuthors: [{ externalAuthorEmail: 'external@author.com', externalAuthorId: 'external-author-1', externalAuthorName: 'External Author One' }] }}
  `(
    'submits an existing external author in $section',
    async ({ section, submittedValue }) => {
      const onCreate = jest.fn();

      const getAuthorSuggestionsMock = jest.fn().mockResolvedValue([
        {
          author: {
            id: 'external-author-1',
            displayName: 'External Author One',
            __meta: {
              type: 'external-author',
            },
          },
          label: 'External Author One',
          value: 'external-author-1',
        },
      ]);

      render(
        <StaticRouter>
          <ManuscriptForm
            {...defaultProps}
            title="manuscript title"
            onCreate={onCreate}
            type="Original Research"
            lifecycle="Publication"
            preprintDoi="10.4444/test"
            publicationDoi="10.4467/test"
            manuscriptFile={{
              id: '123',
              url: 'https://test-url',
              filename: 'abc.jpeg',
            }}
            keyResourceTable={{
              id: '124',
              url: 'https://test-url',
              filename: 'abc.jpeg',
            }}
            getAuthorSuggestions={getAuthorSuggestionsMock}
          />
        </StaticRouter>,
      );

      userEvent.click(screen.getByLabelText(section));
      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
      );
      userEvent.click(screen.getByText(/External Author One \(Non CRN\)/));
      userEvent.type(
        screen.getByLabelText(/External Author One Email/i),
        'external@author.com',
      );

      await submitForm();

      await waitFor(() => {
        expect(onCreate).toHaveBeenCalledWith(
          expect.objectContaining({
            versions: [expect.objectContaining(submittedValue)],
          }),
        );
      });
    },
  );

  it.each`
    section                   | submittedValue
    ${/Corresponding Author/} | ${{ correspondingAuthor: { externalAuthorEmail: 'jane@doe.com', externalAuthorName: 'Jane Doe' } }}
    ${/Additional Authors/}   | ${{ additionalAuthors: [{ externalAuthorEmail: 'jane@doe.com', externalAuthorName: 'Jane Doe' }] }}
  `(
    'submits a non existing external author in $section',
    async ({ section, submittedValue }) => {
      const onCreate = jest.fn();

      const getAuthorSuggestionsMock = jest.fn().mockResolvedValue([
        {
          author: {
            id: 'author-1',
            firstName: 'Author',
            lastName: 'One',
            displayName: 'Author One',
            __meta: {
              type: 'user',
            },
          },
          label: 'Author One',
          value: 'author-1',
        },
      ]);

      render(
        <StaticRouter>
          <ManuscriptForm
            {...defaultProps}
            title="manuscript title"
            onCreate={onCreate}
            type="Original Research"
            lifecycle="Publication"
            preprintDoi="10.4444/test"
            publicationDoi="10.4467/test"
            manuscriptFile={{
              id: '123',
              url: 'https://test-url',
              filename: 'abc.jpeg',
            }}
            keyResourceTable={{
              id: '124',
              url: 'https://test-url',
              filename: 'abc.jpeg',
            }}
            getAuthorSuggestions={getAuthorSuggestionsMock}
          />
        </StaticRouter>,
      );

      userEvent.type(screen.getByLabelText(section), 'Jane Doe');

      await waitFor(() =>
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
      );

      userEvent.click(screen.getByText(/Jane Doe/, { selector: 'strong' }));
      userEvent.type(screen.getByLabelText(/Jane Doe Email/i), 'jane@doe.com');

      await submitForm();

      await waitFor(() => {
        expect(onCreate).toHaveBeenCalledWith(
          expect.objectContaining({
            versions: [expect.objectContaining(submittedValue)],
          }),
        );
      });
    },
  );
});

describe('preprintDoi', () => {
  it.each([
    { lifecycle: 'Preprint', status: 'required' },
    { lifecycle: 'Publication', status: 'optional' },
    {
      lifecycle: 'Publication with addendum or corrigendum',
      status: 'optional',
    },
  ] as {
    lifecycle: ManuscriptLifecycle;
    status: string;
  }[])(
    'preprintDoi is $status when lifecycle is $lifecycle',
    async ({ lifecycle, status }) => {
      render(
        <StaticRouter>
          <ManuscriptForm
            {...defaultProps}
            type="Original Research"
            lifecycle={lifecycle}
            resubmitManuscript
          />
        </StaticRouter>,
      );

      expect(
        screen.getByRole('textbox', {
          name: new RegExp(`Preprint DOI \\(${status}\\)`, 'i'),
        }),
      ).toBeVisible();
    },
  );
});

describe('renders the necessary fields', () => {
  const getQuickCheckQuestion = (field: QuickCheck) =>
    quickCheckQuestions.find((quickCheck) => quickCheck.field === field)
      ?.question;

  const fieldInputMapping = {
    preprintDoi: 'Preprint DOI',
    publicationDoi: 'Publication DOI',
    manuscriptFile: 'Upload the main manuscript file',
    keyResourceTable: 'Upload a key resource table',
    additionalFiles: 'Upload any additional files',
    otherDetails: 'Please provide details',
    type: 'Type of Manuscript',
    lifecycle: 'Where is the manuscript in the life cycle?',

    acknowledgedGrantNumber: getQuickCheckQuestion('acknowledgedGrantNumber'),
    asapAffiliationIncluded: getQuickCheckQuestion('asapAffiliationIncluded'),
    manuscriptLicense: getQuickCheckQuestion('manuscriptLicense'),
    datasetsDeposited: getQuickCheckQuestion('datasetsDeposited'),
    codeDeposited: getQuickCheckQuestion('codeDeposited'),
    protocolsDeposited: getQuickCheckQuestion('protocolsDeposited'),
    labMaterialsRegistered: getQuickCheckQuestion('labMaterialsRegistered'),
    availabilityStatement: getQuickCheckQuestion('availabilityStatement'),

    acknowledgedGrantNumberDetails: 'Please provide details',
    asapAffiliationIncludedDetails: 'Please provide details',
    manuscriptLicenseDetails: 'Please provide details',
    datasetsDepositedDetails: 'Please provide details',
    codeDepositedDetails: 'Please provide details',
    protocolsDepositedDetails: 'Please provide details',
    labMaterialsRegisteredDetails: 'Please provide details',
    availabilityStatementDetails: 'Please provide details',

    description: 'Please provide a description',

    teams: 'Add other teams that contributed to this manuscript.',
    labs: 'Add ASAP labs that contributed to this manuscript.',
  };

  describe.each(Object.keys(manuscriptFormFieldsMapping))(
    'when type is %s',
    (type) => {
      const manuscriptType = type as ManuscriptType;
      it.each(Object.keys(manuscriptFormFieldsMapping[manuscriptType]))(
        'lifecycle is %s',
        (lifecycle) => {
          const manuscriptLifecycle = lifecycle as ManuscriptLifecycle;
          const { getByText } = render(
            <StaticRouter>
              <ManuscriptForm
                {...defaultProps}
                type={manuscriptType}
                lifecycle={manuscriptLifecycle}
              />
            </StaticRouter>,
          );

          manuscriptFormFieldsMapping[manuscriptType][
            manuscriptLifecycle
          ].forEach((field) => {
            expect(getByText(fieldInputMapping[field] as string)).toBeVisible();
          });
        },
      );
    },
  );
});

it('resets form fields to default values when no longer visible', async () => {
  const onCreate = jest.fn();
  render(
    <StaticRouter>
      <ManuscriptForm
        {...defaultProps}
        title="manuscript title"
        onCreate={onCreate}
        type="Original Research"
        lifecycle="Publication"
        preprintDoi="10.4444/test"
        publicationDoi="10.4467/test"
        manuscriptFile={{
          id: '123',
          url: 'https://test-url',
          filename: 'abc.jpeg',
        }}
        keyResourceTable={{
          id: '124',
          url: 'https://test-url',
          filename: 'abc.jpeg',
        }}
      />
    </StaticRouter>,
  );

  const lifecycleTextbox = screen.getByRole('textbox', {
    name: /Where is the manuscript in the life cycle/i,
  });

  userEvent.type(lifecycleTextbox, 'Draft Manuscript (prior to Publication)');
  userEvent.type(lifecycleTextbox, specialChars.enter);
  lifecycleTextbox.blur();

  expect(
    screen.queryByRole('textbox', {
      name: /Preprint DOI/i,
    }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('textbox', {
      name: /Publication DOI/i,
    }),
  ).not.toBeInTheDocument();

  await submitForm();

  await waitFor(() => {
    expect(onCreate).toHaveBeenCalledWith({
      title: 'manuscript title',
      eligibilityReasons: [],
      versions: [
        expect.objectContaining({
          preprintDoi: undefined,
          publicationDoi: undefined,
        }),
      ],
      teamId,
    });
  });
});

it('maintains values provided when lifecycle changes but field is still visible', async () => {
  render(
    <StaticRouter>
      <ManuscriptForm {...defaultProps} title="manuscript title" />
    </StaticRouter>,
  );

  const typeTextbox = screen.getByRole('textbox', {
    name: /Type of Manuscript/i,
  });
  userEvent.type(typeTextbox, 'Original');
  userEvent.type(typeTextbox, specialChars.enter);
  typeTextbox.blur();

  const lifecycleTextbox = screen.getByRole('textbox', {
    name: /Where is the manuscript in the life cycle/i,
  });
  userEvent.type(lifecycleTextbox, 'Publication with addendum or corrigendum');
  userEvent.type(lifecycleTextbox, specialChars.enter);
  lifecycleTextbox.blur();

  const preprintDoi = '10.4444/test';
  const publicationDoi = '10.4467/test';

  const preprintDoiTextbox = screen.getByRole('textbox', {
    name: /Preprint DOI/i,
  });
  userEvent.type(preprintDoiTextbox, preprintDoi);

  const publicationDoiTextbox = screen.getByRole('textbox', {
    name: /Publication DOI/i,
  });
  userEvent.type(publicationDoiTextbox, publicationDoi);

  expect(preprintDoiTextbox).toHaveValue(preprintDoi);
  expect(publicationDoiTextbox).toHaveValue(publicationDoi);

  userEvent.type(lifecycleTextbox, 'Preprint');
  userEvent.type(lifecycleTextbox, specialChars.enter);
  lifecycleTextbox.blur();

  expect(
    screen.getByRole('textbox', {
      name: /Preprint DOI/i,
    }),
  ).toHaveValue(preprintDoi);
  expect(
    screen.queryByRole('textbox', {
      name: /Publication DOI/i,
    }),
  ).not.toBeInTheDocument();
});

it('does not submit when required values are missing', async () => {
  const onCreate = jest.fn();
  render(
    <StaticRouter>
      <ManuscriptForm {...defaultProps} onCreate={onCreate} />
    </StaticRouter>,
  );

  const submitButton = screen.getByRole('button', { name: /Submit/ });

  userEvent.click(submitButton);

  await waitFor(() => {
    expect(submitButton).toBeEnabled();
  });

  expect(
    screen.getByRole('textbox', { name: /Title of Manuscript/i }),
  ).toBeInvalid();
  expect(onCreate).not.toHaveBeenCalled();
});

it('should go back when cancel button is clicked', async () => {
  render(
    <MemoryRouter>
      <Router history={history}>
        <Route path="/form">
          <ManuscriptForm {...defaultProps} />
        </Route>
      </Router>
    </MemoryRouter>,
  );

  history.push('/another-url');
  history.push('/form');

  await act(async () => {
    await userEvent.click(await screen.findByText(/cancel/i));
  });

  await userEvent.click(
    screen.getByRole('button', { name: /Cancel manuscript submission/i }),
  );

  expect(history.location.pathname).toBe('/another-url');
});

describe('manuscript file', () => {
  it('should show error when file upload fails', async () => {
    const handleFileUpload: jest.MockedFunction<
      ComponentProps<typeof ManuscriptForm>['handleFileUpload']
    > = jest.fn();

    const mockFile = new File([''], 'test.txt', { type: 'text/plain' });
    const mockError = 'No file provided or file is not a PDF.';

    handleFileUpload.mockImplementation(
      (
        file: File,
        fileType: ManuscriptFileType,
        handleError: (errorMessage: string) => void,
      ) => {
        if (file === mockFile) {
          return Promise.reject(new Error(mockError)).catch((error) => {
            handleError(error.message);
            return undefined;
          });
        }
        return Promise.resolve({
          id: '123',
          filename: 'test.pdf',
          url: 'http://example.com/test.pdf',
        });
      },
    );
    render(
      <StaticRouter>
        <ManuscriptForm
          {...defaultProps}
          title="manuscript title"
          type="Original Research"
          lifecycle="Publication"
          preprintDoi="10.4444/test"
          publicationDoi="10.4467/test"
          handleFileUpload={handleFileUpload}
        />
      </StaticRouter>,
    );

    const uploadInput = screen.getByLabelText(/Upload Manuscript File/i);

    await waitFor(async () => {
      userEvent.upload(uploadInput, mockFile);
    });

    expect(screen.getByText(mockError)).toBeInTheDocument();
  });

  it('should show error when file size is greater than 100MB', async () => {
    const handleFileUpload: jest.MockedFunction<
      ComponentProps<typeof ManuscriptForm>['handleFileUpload']
    > = jest.fn();

    const mockFile = new File(['1'.repeat(1024 * 1024 * 100)], 'test.txt', {
      type: 'text/plain',
    });

    render(
      <StaticRouter>
        <ManuscriptForm
          {...defaultProps}
          title="manuscript title"
          type="Original Research"
          lifecycle="Publication"
          preprintDoi="10.4444/test"
          publicationDoi="10.4467/test"
          handleFileUpload={handleFileUpload}
        />
      </StaticRouter>,
    );

    const uploadInput = screen.getByLabelText(/Upload Manuscript File/i);

    await waitFor(async () => {
      userEvent.upload(uploadInput, mockFile);
    });

    expect(
      screen.getByText(
        'The file size exceeds the limit of 100 MB. Please upload a smaller file.',
      ),
    ).toBeInTheDocument();
  });

  it('should upload and remove file when user clicks on upload manuscript file and remove button', async () => {
    render(
      <StaticRouter>
        <ManuscriptForm
          {...defaultProps}
          title="manuscript title"
          type="Original Research"
          lifecycle="Publication"
          preprintDoi="10.4444/test"
          publicationDoi="10.4467/test"
        />
      </StaticRouter>,
    );

    expect(screen.queryByText(/test.pdf/i)).not.toBeInTheDocument();

    const testFile = new File(['file content'], 'test.pdf', {
      type: 'application/pdf',
    });
    const uploadInput = screen.getByLabelText(/Upload Manuscript File/i);

    await waitFor(() => {
      userEvent.upload(uploadInput, testFile);
    });

    expect(screen.getByText(/test.pdf/i)).toBeInTheDocument();

    const removeFileButton = screen.getByRole('button', { name: /cross/i });
    expect(removeFileButton).toBeInTheDocument();

    await waitFor(() => {
      userEvent.click(removeFileButton);
    });

    expect(screen.queryByText(/test.pdf/i)).not.toBeInTheDocument();
  });

  it('clears error when a valid manuscript file is uploaded after an error', async () => {
    render(
      <StaticRouter>
        <ManuscriptForm
          {...defaultProps}
          title="manuscript title"
          type="Original Research"
          lifecycle="Publication"
          preprintDoi="10.4444/test"
          publicationDoi="10.4467/test"
        />
      </StaticRouter>,
    );

    const tooLargeFile = new File(
      ['1'.repeat(101 * 1024 * 1024)],
      'too-big.pdf',
      {
        type: 'application/pdf',
      },
    );

    const uploadInput = screen.getByLabelText(/Upload Manuscript File/i);
    await waitFor(() => userEvent.upload(uploadInput, tooLargeFile));

    expect(
      screen.getByText(
        'The file size exceeds the limit of 100 MB. Please upload a smaller file.',
      ),
    ).toBeInTheDocument();

    // Uploads a valid file
    const validFile = new File(['valid content'], 'valid.pdf', {
      type: 'application/pdf',
    });

    await waitFor(() => userEvent.upload(uploadInput, validFile));

    // Error message should disappear
    expect(
      screen.queryByText(
        'The file size exceeds the limit of 100 MB. Please upload a smaller file.',
      ),
    ).not.toBeInTheDocument();
  });

  it('clears error when a valid key resource table is uploaded after an error', async () => {
    render(
      <StaticRouter>
        <ManuscriptForm
          {...defaultProps}
          title="manuscript title"
          type="Original Research"
          lifecycle="Publication"
        />
      </StaticRouter>,
    );

    const tooLargeFile = new File(
      ['1'.repeat(101 * 1024 * 1024)],
      'too-big.csv',
      {
        type: 'text/csv',
      },
    );

    const uploadInput = screen.getByLabelText(/Upload Key Resource Table/i);
    await waitFor(() => userEvent.upload(uploadInput, tooLargeFile));

    expect(
      screen.getByText(
        'The file size exceeds the limit of 100 MB. Please upload a smaller file.',
      ),
    ).toBeInTheDocument();

    // Uploads a valid file
    const validFile = new File(['valid content'], 'valid.csv', {
      type: 'text/csv',
    });
    await waitFor(() => userEvent.upload(uploadInput, validFile));

    // Error message should disappear
    expect(
      screen.queryByText(
        'The file size exceeds the limit of 100 MB. Please upload a smaller file.',
      ),
    ).not.toBeInTheDocument();
  });

  it('clears error when a valid additional file is uploaded after an error', async () => {
    render(
      <StaticRouter>
        <ManuscriptForm
          {...defaultProps}
          title="manuscript title"
          type="Original Research"
          lifecycle="Publication"
        />
      </StaticRouter>,
    );

    const tooLargeFile = new File(
      ['1'.repeat(101 * 1024 * 1024)],
      'too-big.pdf',
      {
        type: 'application/pdf',
      },
    );

    const uploadInput = screen.getByLabelText(/Upload Additional Files/i);
    await waitFor(() => userEvent.upload(uploadInput, tooLargeFile));

    expect(
      screen.getByText(
        'The file size exceeds the limit of 100 MB. Please upload a smaller file.',
      ),
    ).toBeInTheDocument();

    // Upload a valid file
    const validFile = new File(['valid content'], 'valid.pdf', {
      type: 'application/pdf',
    });
    await waitFor(() => userEvent.upload(uploadInput, validFile));

    expect(
      screen.queryByText(
        'The file size exceeds the limit of 100 MB. Please upload a smaller file.',
      ),
    ).not.toBeInTheDocument();
  });
});

describe('key resource table', () => {
  it('should show error when file upload fails', async () => {
    const handleFileUpload: jest.MockedFunction<
      ComponentProps<typeof ManuscriptForm>['handleFileUpload']
    > = jest.fn();

    const mockFile = new File([''], 'test.txt', { type: 'text/plain' });
    const mockError = 'No file provided or file is not a CSV.';

    handleFileUpload.mockImplementation(
      (
        file: File,
        fileType: ManuscriptFileType,
        handleError: (errorMessage: string) => void,
      ) =>
        Promise.reject(new Error(mockError)).catch((error) => {
          handleError(error.message);
          return undefined;
        }),
    );
    render(
      <StaticRouter>
        <ManuscriptForm
          {...defaultProps}
          title="manuscript title"
          type="Original Research"
          lifecycle="Publication"
          preprintDoi="10.4444/test"
          publicationDoi="10.4467/test"
          handleFileUpload={handleFileUpload}
        />
      </StaticRouter>,
    );

    const uploadInput = screen.getByLabelText(/Upload Key Resource Table/i);

    await waitFor(async () => {
      userEvent.upload(uploadInput, mockFile);
    });

    expect(screen.getByText(mockError)).toBeInTheDocument();
  });

  it('should show error when file size is greater than 100MB', async () => {
    const handleFileUpload: jest.MockedFunction<
      ComponentProps<typeof ManuscriptForm>['handleFileUpload']
    > = jest.fn();

    const mockFile = new File(['1'.repeat(1024 * 1024 * 100)], 'test.txt', {
      type: 'text/plain',
    });

    render(
      <StaticRouter>
        <ManuscriptForm
          {...defaultProps}
          title="manuscript title"
          type="Original Research"
          lifecycle="Publication"
          preprintDoi="10.4444/test"
          publicationDoi="10.4467/test"
          handleFileUpload={handleFileUpload}
        />
      </StaticRouter>,
    );

    const uploadInput = screen.getByLabelText(/Upload Key Resource Table/i);

    await waitFor(async () => {
      userEvent.upload(uploadInput, mockFile);
    });

    expect(
      screen.getByText(
        'The file size exceeds the limit of 100 MB. Please upload a smaller file.',
      ),
    ).toBeInTheDocument();
  });

  it('should upload and remove file when user clicks on upload key resource table and remove button', async () => {
    const handleFileUpload = jest.fn(() =>
      Promise.resolve({
        id: '123',
        filename: 'test.csv',
        url: 'http://example.com/test.csv',
      }),
    );
    render(
      <StaticRouter>
        <ManuscriptForm
          {...defaultProps}
          title="manuscript title"
          type="Original Research"
          lifecycle="Publication"
          preprintDoi="10.4444/test"
          publicationDoi="10.4467/test"
          handleFileUpload={handleFileUpload}
        />
      </StaticRouter>,
    );

    expect(screen.queryByText(/test.csv/i)).not.toBeInTheDocument();

    const testFile = new File(['file content'], 'test.csv', {
      type: 'text/csv',
    });
    const uploadInput = screen.getByLabelText(/Upload Key Resource Table/i);

    await waitFor(() => {
      userEvent.upload(uploadInput, testFile);
    });

    expect(screen.getByText(/test.csv/i)).toBeInTheDocument();

    const removeFileButton = screen.getByRole('button', { name: /cross/i });
    expect(removeFileButton).toBeInTheDocument();

    await waitFor(() => {
      userEvent.click(removeFileButton);
    });

    expect(screen.queryByText(/test.csv/i)).not.toBeInTheDocument();
  });
});

describe('additional files', () => {
  it('user can upload additional files', async () => {
    const onCreate = jest.fn();
    render(
      <StaticRouter>
        <ManuscriptForm
          {...defaultProps}
          title="manuscript title"
          onCreate={onCreate}
          type="Original Research"
          lifecycle="Publication"
          preprintDoi="10.4444/test"
          publicationDoi="10.4467/test"
        />
      </StaticRouter>,
    );

    expect(screen.queryByText(/test.pdf/i)).not.toBeInTheDocument();

    const testFile = new File(['file content'], 'test.pdf', {
      type: 'application/pdf',
    });
    const uploadInput = screen.getByLabelText(/Upload Additional Files/i);

    await waitFor(() => {
      userEvent.upload(uploadInput, testFile);
    });

    expect(screen.getByText(/test.pdf/i)).toBeInTheDocument();
  });
  it('should show error when file upload fails', async () => {
    const handleFileUpload: jest.MockedFunction<
      ComponentProps<typeof ManuscriptForm>['handleFileUpload']
    > = jest.fn();

    const mockFile = new File([''], 'test.txt', { type: 'text/plain' });
    const mockError = 'No file provided or file is not a CSV or PDF.';

    handleFileUpload.mockImplementation(
      (
        file: File,
        fileType: ManuscriptFileType,
        handleError: (errorMessage: string) => void,
      ) =>
        Promise.reject(new Error(mockError)).catch((error) => {
          handleError(error.message);
          return undefined;
        }),
    );
    render(
      <StaticRouter>
        <ManuscriptForm
          {...defaultProps}
          title="manuscript title"
          type="Original Research"
          lifecycle="Publication"
          preprintDoi="10.4444/test"
          publicationDoi="10.4467/test"
          handleFileUpload={handleFileUpload}
        />
      </StaticRouter>,
    );

    const uploadInput = screen.getByLabelText(/Upload Additional Files/i);

    await waitFor(async () => {
      userEvent.upload(uploadInput, mockFile);
    });

    expect(screen.getByText(mockError)).toBeInTheDocument();
  });

  it('user cannot upload the same file multiple times', async () => {
    const onCreate = jest.fn();
    render(
      <StaticRouter>
        <ManuscriptForm
          {...defaultProps}
          title="manuscript title"
          onCreate={onCreate}
          type="Original Research"
          lifecycle="Publication"
          preprintDoi="10.4444/test"
          publicationDoi="10.4467/test"
          additionalFiles={[
            {
              id: '124',
              filename: 'test.csv',
              url: 'http://example.com/test.csv',
            },
          ]}
        />
      </StaticRouter>,
    );

    expect(screen.getByText(/test.csv/i)).toBeInTheDocument();

    const testFile = new File(['file content'], 'test.csv', {
      type: 'application/pdf',
    });
    const uploadInput = screen.getByLabelText(/Upload Additional Files/i);

    await waitFor(() => {
      userEvent.upload(uploadInput, testFile);
    });

    expect(
      screen.getByText(/File uploaded already exists./i),
    ).toBeInTheDocument();
  });

  it('should show error when file size is greater than 100MB', async () => {
    const handleFileUpload: jest.MockedFunction<
      ComponentProps<typeof ManuscriptForm>['handleFileUpload']
    > = jest.fn();

    const mockFile = new File(['1'.repeat(1024 * 1024 * 100)], 'test.txt', {
      type: 'text/plain',
    });

    render(
      <StaticRouter>
        <ManuscriptForm
          {...defaultProps}
          title="manuscript title"
          type="Original Research"
          lifecycle="Publication"
          preprintDoi="10.4444/test"
          publicationDoi="10.4467/test"
          handleFileUpload={handleFileUpload}
        />
      </StaticRouter>,
    );

    const uploadInput = screen.getByLabelText(/Upload Additional Files/i);

    await waitFor(async () => {
      userEvent.upload(uploadInput, mockFile);
    });

    expect(
      screen.getByText(
        'The file size exceeds the limit of 100 MB. Please upload a smaller file.',
      ),
    ).toBeInTheDocument();
  });

  it('should remove one of the additional files without removing the others', async () => {
    render(
      <StaticRouter>
        <ManuscriptForm
          {...defaultProps}
          title="manuscript title"
          type="Original Research"
          lifecycle="Publication"
          preprintDoi="10.4444/test"
          publicationDoi="10.4467/test"
          additionalFiles={[
            {
              id: '123',
              filename: 'file_one.csv',
              url: 'http://example.com/file_one.csv',
            },
            {
              id: '124',
              filename: 'file_two.pdf',
              url: 'http://example.com/file_two.pdf',
            },
          ]}
        />
      </StaticRouter>,
    );

    expect(screen.getByText(/file_one.csv/i)).toBeInTheDocument();
    expect(screen.getByText(/file_two.pdf/i)).toBeInTheDocument();

    const removeFileOneButton = screen.getAllByRole('button', {
      name: /cross/i,
    })[0]!;
    expect(removeFileOneButton).toBeInTheDocument();

    await waitFor(() => {
      userEvent.click(removeFileOneButton);
    });

    expect(screen.queryByText(/file_one.csv/i)).not.toBeInTheDocument();
    expect(screen.getByText(/file_two.pdf/i)).toBeInTheDocument();
  });
});

it('user can add teams', async () => {
  const onCreate = jest.fn();
  const getTeamSuggestionsMock = jest.fn().mockResolvedValue([
    { label: 'Team A', value: 'team-a' },
    { label: 'Team B', value: 'team-b' },
  ]);
  render(
    <StaticRouter>
      <ManuscriptForm
        {...defaultProps}
        title="manuscript title"
        onCreate={onCreate}
        type="Original Research"
        lifecycle="Publication"
        preprintDoi="10.4444/test"
        publicationDoi="10.4467/test"
        manuscriptFile={{
          id: '123',
          url: 'https://test-url',
          filename: 'abc.jpeg',
        }}
        keyResourceTable={{
          id: '124',
          url: 'https://test-url',
          filename: 'abc.jpeg',
        }}
        getTeamSuggestions={getTeamSuggestionsMock}
      />
    </StaticRouter>,
  );

  userEvent.click(screen.getByRole('textbox', { name: /Teams/i }));
  await waitFor(() => {
    expect(screen.getByText('Team A')).toBeVisible();
  });
  userEvent.click(screen.getByText('Team A'));

  userEvent.click(screen.getByRole('textbox', { name: /Teams/i }));
  await waitFor(() => {
    expect(screen.getByText('Team B')).toBeVisible();
  });
  userEvent.click(screen.getByText('Team B'));

  await submitForm();

  await waitFor(() => {
    expect(onCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        versions: [
          expect.objectContaining({
            teams: ['1', 'team-a', 'team-b'],
          }),
        ],
      }),
    );
  });
});

it('user can add labs', async () => {
  const onCreate = jest.fn();
  const getLabSuggestions = jest.fn().mockResolvedValue([
    { label: 'Lab One', value: 'lab-1' },
    { label: 'Lab Two', value: 'lab-2' },
  ]);
  render(
    <StaticRouter>
      <ManuscriptForm
        {...defaultProps}
        title="manuscript title"
        onCreate={onCreate}
        type="Original Research"
        lifecycle="Publication"
        preprintDoi="10.4444/test"
        publicationDoi="10.4467/test"
        manuscriptFile={{
          id: '123',
          url: 'https://test-url',
          filename: 'abc.jpeg',
        }}
        keyResourceTable={{
          id: '124',
          url: 'https://test-url',
          filename: 'abc.jpeg',
        }}
        getLabSuggestions={getLabSuggestions}
      />
    </StaticRouter>,
  );
  userEvent.click(screen.getByRole('textbox', { name: /Labs/i }));
  await waitFor(() => {
    expect(screen.getByText('Lab One')).toBeVisible();
  });
  userEvent.click(screen.getByText('Lab One'));

  userEvent.click(screen.getByRole('textbox', { name: /Labs/i }));
  expect(screen.getByText('Lab Two')).toBeVisible();
  userEvent.click(screen.getByText('Lab Two'));

  await submitForm();

  await waitFor(() => {
    expect(onCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        versions: [
          expect.objectContaining({
            labs: ['lab-1', 'lab-2'],
          }),
        ],
      }),
    );
  });
});

it('displays error message when no team is found', async () => {
  const getTeamSuggestionsMock = jest.fn().mockResolvedValue([]);
  render(
    <StaticRouter>
      <ManuscriptForm
        {...defaultProps}
        getTeamSuggestions={getTeamSuggestionsMock}
      />
    </StaticRouter>,
  );
  userEvent.click(screen.getByRole('textbox', { name: /Teams/i }));
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  expect(screen.getByText(/Sorry, no teams match/i)).toBeVisible();
});

it('displays error message when no lab is found', async () => {
  const getLabSuggestions = jest.fn().mockResolvedValue([]);
  render(
    <StaticRouter>
      <ManuscriptForm {...defaultProps} getLabSuggestions={getLabSuggestions} />
    </StaticRouter>,
  );
  userEvent.click(screen.getByRole('textbox', { name: /Labs/i }));
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  expect(screen.getByText(/Sorry, no labs match/i)).toBeVisible();
});

it('calls onUpdate when form is updated', async () => {
  const onUpdate = jest.fn();
  render(
    <StaticRouter>
      <ManuscriptForm
        {...defaultProps}
        title="manuscript title"
        type="Original Research"
        lifecycle="Draft Manuscript (prior to Publication)"
        manuscriptFile={{
          id: '123',
          filename: 'test.pdf',
          url: 'http://example.com/test.pdf',
        }}
        keyResourceTable={{
          id: '124',
          filename: 'test.csv',
          url: 'http://example.com/test.csv',
        }}
        onUpdate={onUpdate}
        manuscriptId="manuscript-id"
      />
    </StaticRouter>,
  );

  await submitForm();

  await waitFor(() => {
    expect(onUpdate).toHaveBeenCalledWith('manuscript-id', {
      teamId: '1',
      title: 'manuscript title',
      versions: [
        {
          acknowledgedGrantNumber: 'Yes',
          acknowledgedGrantNumberDetails: '',
          additionalAuthors: [],
          additionalFiles: undefined,
          asapAffiliationIncluded: 'Yes',
          asapAffiliationIncludedDetails: '',
          availabilityStatement: 'Yes',
          availabilityStatementDetails: '',
          codeDeposited: 'Yes',
          codeDepositedDetails: '',
          correspondingAuthor: undefined,
          datasetsDeposited: 'Yes',
          datasetsDepositedDetails: '',
          description: 'Some description',
          firstAuthors: [],
          keyResourceTable: {
            filename: 'test.csv',
            id: '124',
            url: 'http://example.com/test.csv',
          },
          labMaterialsRegistered: 'Yes',
          labMaterialsRegisteredDetails: '',
          labs: [],
          lifecycle: 'Draft Manuscript (prior to Publication)',
          manuscriptFile: {
            filename: 'test.pdf',
            id: '123',
            url: 'http://example.com/test.pdf',
          },
          manuscriptLicense: undefined,
          manuscriptLicenseDetails: '',
          otherDetails: undefined,
          preprintDoi: undefined,
          protocolsDeposited: 'Yes',
          protocolsDepositedDetails: '',
          publicationDoi: undefined,
          teams: ['1'],
          type: 'Original Research',
        },
      ],
    });
  });
});

it('calls onResubmit when form details are saved and resubmitManuscript prop is true', async () => {
  const onResubmit = jest.fn();
  render(
    <StaticRouter>
      <ManuscriptForm
        {...defaultProps}
        handleFileUpload={jest.fn(async (file) => ({
          id: 'some-id',
          filename: file.name,
          url: `https://example.com/${file.name}`,
        }))}
        title="manuscript title"
        type="Original Research"
        lifecycle="Draft Manuscript (prior to Publication)"
        manuscriptFile={{
          id: '123',
          filename: 'test.pdf',
          url: 'http://example.com/test.pdf',
        }}
        keyResourceTable={{
          id: '124',
          filename: 'test.csv',
          url: 'http://example.com/test.csv',
        }}
        onResubmit={onResubmit}
        resubmitManuscript
        manuscriptId="manuscript-id"
      />
    </StaticRouter>,
  );

  const testManuscriptFile = new File(['file content'], 'manuscript.pdf', {
    type: 'application/pdf',
  });
  const testKeyResourceFile = new File(['file content'], 'keyresource.csv', {
    type: 'text/csv',
  });

  userEvent.upload(
    await screen.findByLabelText(/Upload Manuscript File/i),
    testManuscriptFile,
  );
  userEvent.upload(
    await screen.findByLabelText(/Upload Key Resource Table/i),
    testKeyResourceFile,
  );

  await submitForm();

  await waitFor(() => {
    expect(onResubmit).toHaveBeenCalledWith('manuscript-id', {
      teamId: '1',
      title: 'manuscript title',
      versions: [
        {
          acknowledgedGrantNumber: 'Yes',
          acknowledgedGrantNumberDetails: '',
          additionalAuthors: [],
          additionalFiles: undefined,
          asapAffiliationIncluded: 'Yes',
          asapAffiliationIncludedDetails: '',
          availabilityStatement: 'Yes',
          availabilityStatementDetails: '',
          codeDeposited: 'Yes',
          codeDepositedDetails: '',
          correspondingAuthor: undefined,
          datasetsDeposited: 'Yes',
          datasetsDepositedDetails: '',
          description: 'Some description',
          firstAuthors: [],
          keyResourceTable: {
            filename: 'keyresource.csv',
            id: 'some-id',
            url: 'https://example.com/keyresource.csv',
          },
          labMaterialsRegistered: 'Yes',
          labMaterialsRegisteredDetails: '',
          labs: [],
          lifecycle: 'Draft Manuscript (prior to Publication)',
          manuscriptFile: {
            filename: 'manuscript.pdf',
            id: 'some-id',
            url: 'https://example.com/manuscript.pdf',
          },
          manuscriptLicense: undefined,
          manuscriptLicenseDetails: '',
          otherDetails: undefined,
          preprintDoi: undefined,
          protocolsDeposited: 'Yes',
          protocolsDepositedDetails: '',
          publicationDoi: undefined,
          teams: ['1'],
          type: 'Original Research',
        },
      ],
    });
  });
});
