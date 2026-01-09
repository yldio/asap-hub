import {
  AuthorResponse,
  AuthorSelectOption,
  ManuscriptFileType,
  manuscriptFormFieldsMapping,
  ManuscriptLifecycle,
  ManuscriptType,
  QuickCheck,
  quickCheckQuestions,
} from '@asap-hub/model';
import { cleanup, render, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps, Suspense } from 'react';
import { StaticRouter } from 'react-router-dom/server';
import type {
  ByRoleOptions,
  waitForOptions,
  ByRoleMatcher,
} from '@testing-library/react';
import ManuscriptForm from '../ManuscriptForm';

type FindByRole = (
  role: ByRoleMatcher,
  options?: ByRoleOptions | undefined,
  waitForElementOptions?: waitForOptions | undefined,
) => Promise<HTMLElement>;

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
  shortDescription: 'A good short description',
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

const submitForm = async ({ findByRole }: { findByRole: FindByRole }) => {
  const submitBtn = await findByRole('button', { name: /Submit/ });
  await userEvent.click(submitBtn);

  const confirmBtn = await findByRole('button', {
    name: /Submit Manuscript/i,
  });
  await userEvent.click(confirmBtn);
};

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

      const { getByText, findByRole, findByLabelText, queryByText } = render(
        <StaticRouter location="/">
          <Suspense fallback={<div>Loading...</div>}>
            <ManuscriptForm
              {...defaultProps}
              title="manuscript title"
              onCreate={onCreate}
              type="Original Research"
              lifecycle="Publication"
              url="http://example.com"
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
          </Suspense>
        </StaticRouter>,
      );

      const sectionInput = await findByLabelText(section, undefined, {
        timeout: 10000,
      });

      await userEvent.click(sectionInput);
      await userEvent.click(getByText('Author One'));

      await submitForm({ findByRole });
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

      const { getByLabelText, getByText, findByRole, findByLabelText } = render(
        <StaticRouter location="/">
          <Suspense fallback={<div>Loading...</div>}>
            <ManuscriptForm
              {...defaultProps}
              title="manuscript title"
              onCreate={onCreate}
              type="Original Research"
              lifecycle="Publication"
              url="http://example.com"
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
          </Suspense>
        </StaticRouter>,
      );

      // Wait for the form section to be ready - findByLabelText waits for the element to appear
      // This avoids race conditions with Suspense fallbacks in CI environments
      const sectionInput = await findByLabelText(section);
      await userEvent.click(sectionInput);
      await userEvent.click(getByText(/External Author One \(Non CRN\)/));
      await userEvent.type(
        getByLabelText(/External Author One Email/i),
        'external@author.com',
      );

      await submitForm({ findByRole });

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
    section                     | submittedValue
    ${/Corresponding Author/}   | ${{ correspondingAuthor: { externalAuthorEmail: 'jane@doe.com', externalAuthorName: 'Jane Doe' } }}
    ${/Additional Authors/}     | ${{ additionalAuthors: [{ externalAuthorEmail: 'jane@doe.com', externalAuthorName: 'Jane Doe' }] }}
    ${/First Author Full Name/} | ${{ firstAuthors: [{ externalAuthorEmail: 'jane@doe.com', externalAuthorName: 'Jane Doe' }] }}
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

      const { getByLabelText, getByText, findByRole, findByLabelText } = render(
        <StaticRouter location="/">
          <Suspense fallback={<div>Loading...</div>}>
            <ManuscriptForm
              {...defaultProps}
              title="manuscript title"
              onCreate={onCreate}
              type="Original Research"
              lifecycle="Publication"
              url="http://example.com"
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
          </Suspense>
        </StaticRouter>,
      );

      // Wait for the form section to be ready - findByLabelText waits for the element to appear
      // This avoids race conditions with Suspense fallbacks in CI environments
      const sectionInput = await findByLabelText(section);

      await userEvent.type(sectionInput, 'Jane Doe');

      await userEvent.click(getByText(/Jane Doe/, { selector: 'strong' }));
      await userEvent.type(getByLabelText(/Jane Doe Email/i), 'jane@doe.com');

      await submitForm({ findByRole });

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
      const { getByRole } = render(
        <StaticRouter location="/">
          <Suspense fallback={<div>Loading...</div>}>
            <ManuscriptForm
              {...defaultProps}
              type="Original Research"
              lifecycle={lifecycle}
            />
          </Suspense>
        </StaticRouter>,
      );

      expect(
        getByRole('textbox', {
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
    shortDescription: 'Add a short description',
    teams: 'Add other teams that contributed to this manuscript.',
    labs: 'Add ASAP labs that contributed to this manuscript.',
    url: 'Please provide a URL',
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
            <StaticRouter location="/">
              <Suspense fallback={<div>Loading...</div>}>
                <ManuscriptForm
                  {...defaultProps}
                  type={manuscriptType}
                  lifecycle={manuscriptLifecycle}
                />
              </Suspense>
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

describe('manuscript file', () => {
  it('should show error when file upload fails', async () => {
    const handleFileUpload: jest.MockedFunction<
      ComponentProps<typeof ManuscriptForm>['handleFileUpload']
    > = jest.fn();

    const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });
    const mockError = 'No file provided or file is not a PDF.';

    handleFileUpload.mockImplementation(
      (
        _file: File,
        _fileType: ManuscriptFileType,
        handleError: (errorMessage: string) => void,
      ) => {
        handleError(mockError);
        return Promise.resolve(undefined);
      },
    );
    const { getByLabelText, getByText } = render(
      <StaticRouter location="/">
        <Suspense fallback={<div>Loading...</div>}>
          <ManuscriptForm
            {...defaultProps}
            title="manuscript title"
            type="Original Research"
            lifecycle="Publication"
            preprintDoi="10.4444/test"
            publicationDoi="10.4467/test"
            handleFileUpload={handleFileUpload}
          />
        </Suspense>
      </StaticRouter>,
    );

    const uploadInput = getByLabelText(/Upload Manuscript File/i);

    await userEvent.upload(uploadInput, mockFile);

    await waitFor(() => {
      expect(getByText(mockError)).toBeInTheDocument();
    });
  });

  it('should show error when file size is greater than 100MB', async () => {
    const handleFileUpload: jest.MockedFunction<
      ComponentProps<typeof ManuscriptForm>['handleFileUpload']
    > = jest.fn();

    const mockFileContent = new Array(1024).fill('x').join('');
    const mockFile = new File([mockFileContent], 'test.pdf', {
      type: 'application/pdf',
    });
    Object.defineProperty(mockFile, 'size', { value: 101 * 1024 * 1024 });

    const { getByLabelText, getByText } = render(
      <StaticRouter location="/">
        <Suspense fallback={<div>Loading...</div>}>
          <ManuscriptForm
            {...defaultProps}
            title="manuscript title"
            type="Original Research"
            lifecycle="Publication"
            preprintDoi="10.4444/test"
            publicationDoi="10.4467/test"
            handleFileUpload={handleFileUpload}
          />
        </Suspense>
      </StaticRouter>,
    );

    const uploadInput = getByLabelText(/Upload Manuscript File/i);

    await userEvent.upload(uploadInput, mockFile);

    await waitFor(() => {
      expect(
        getByText(
          'The file size exceeds the limit of 100 MB. Please upload a smaller file.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('should upload and remove file when user clicks on upload manuscript file and remove button', async () => {
    const { getByLabelText, queryByText, getByText, getByRole } = render(
      <StaticRouter location="/">
        <Suspense fallback={<div>Loading...</div>}>
          <ManuscriptForm
            {...defaultProps}
            title="manuscript title"
            type="Original Research"
            lifecycle="Publication"
            preprintDoi="10.4444/test"
            publicationDoi="10.4467/test"
          />
        </Suspense>
      </StaticRouter>,
    );

    expect(queryByText(/test.pdf/i)).not.toBeInTheDocument();

    const testFile = new File(['file content'], 'test.pdf', {
      type: 'application/pdf',
    });
    const uploadInput = getByLabelText(/Upload Manuscript File/i);

    await userEvent.upload(uploadInput, testFile);

    await waitFor(() => {
      expect(getByText(/test.pdf/i)).toBeInTheDocument();
    });

    const removeFileButton = getByRole('button', { name: /cross/i });
    expect(removeFileButton).toBeInTheDocument();

    await userEvent.click(removeFileButton);

    await waitFor(() => {
      expect(queryByText(/test.pdf/i)).not.toBeInTheDocument();
    });
  });

  it('clears error when a valid manuscript file is uploaded after an error', async () => {
    const { getByLabelText, queryByText, getByText } = render(
      <StaticRouter location="/">
        <Suspense fallback={<div>Loading...</div>}>
          <ManuscriptForm
            {...defaultProps}
            title="manuscript title"
            type="Original Research"
            lifecycle="Publication"
            preprintDoi="10.4444/test"
            publicationDoi="10.4467/test"
          />
        </Suspense>
      </StaticRouter>,
    );

    const tooLargeFile = new File(['x'], 'too-big.pdf', {
      type: 'application/pdf',
    });
    Object.defineProperty(tooLargeFile, 'size', { value: 101 * 1024 * 1024 });

    const uploadInput = getByLabelText(/Upload Manuscript File/i);
    await userEvent.upload(uploadInput, tooLargeFile);

    await waitFor(() => {
      expect(
        getByText(
          'The file size exceeds the limit of 100 MB. Please upload a smaller file.',
        ),
      ).toBeInTheDocument();
    });

    // Uploads a valid file
    const validFile = new File(['valid content'], 'valid.pdf', {
      type: 'application/pdf',
    });

    await userEvent.upload(uploadInput, validFile);

    // Error message should disappear
    await waitFor(() => {
      expect(
        queryByText(
          'The file size exceeds the limit of 100 MB. Please upload a smaller file.',
        ),
      ).not.toBeInTheDocument();
    });
  });

  it('clears error when a valid key resource table is uploaded after an error', async () => {
    const { getByLabelText, queryByText, getByText } = render(
      <StaticRouter location="/">
        <Suspense fallback={<div>Loading...</div>}>
          <ManuscriptForm
            {...defaultProps}
            title="manuscript title"
            type="Original Research"
            lifecycle="Publication"
          />
        </Suspense>
      </StaticRouter>,
    );

    const tooLargeFile = new File(['x'], 'too-big.csv', {
      type: 'text/csv',
    });
    Object.defineProperty(tooLargeFile, 'size', { value: 101 * 1024 * 1024 });

    const uploadInput = getByLabelText(/Upload Key Resource Table/i);
    await userEvent.upload(uploadInput, tooLargeFile);

    await waitFor(() => {
      expect(
        getByText(
          'The file size exceeds the limit of 100 MB. Please upload a smaller file.',
        ),
      ).toBeInTheDocument();
    });

    // Uploads a valid file
    const validFile = new File(['valid content'], 'valid.csv', {
      type: 'text/csv',
    });
    await userEvent.upload(uploadInput, validFile);

    // Error message should disappear
    await waitFor(() => {
      expect(
        queryByText(
          'The file size exceeds the limit of 100 MB. Please upload a smaller file.',
        ),
      ).not.toBeInTheDocument();
    });
  });

  it('clears error when a valid additional file is uploaded after an error', async () => {
    const { getByLabelText, queryByText, getByText } = render(
      <StaticRouter location="/">
        <Suspense fallback={<div>Loading...</div>}>
          <ManuscriptForm
            {...defaultProps}
            title="manuscript title"
            type="Original Research"
            lifecycle="Publication"
          />
        </Suspense>
      </StaticRouter>,
    );

    const tooLargeFile = new File(['x'], 'too-big.pdf', {
      type: 'application/pdf',
    });
    Object.defineProperty(tooLargeFile, 'size', { value: 101 * 1024 * 1024 });

    const uploadInput = getByLabelText(/Upload Additional Files/i);
    await userEvent.upload(uploadInput, tooLargeFile);

    await waitFor(() => {
      expect(
        getByText(
          'The file size exceeds the limit of 100 MB. Please upload a smaller file.',
        ),
      ).toBeInTheDocument();
    });

    // Upload a valid file
    const validFile = new File(['valid content'], 'valid.pdf', {
      type: 'application/pdf',
    });
    await userEvent.upload(uploadInput, validFile);

    await waitFor(() => {
      expect(
        queryByText(
          'The file size exceeds the limit of 100 MB. Please upload a smaller file.',
        ),
      ).not.toBeInTheDocument();
    });
  });
});

describe('key resource table', () => {
  it('should show error when file upload fails', async () => {
    const handleFileUpload: jest.MockedFunction<
      ComponentProps<typeof ManuscriptForm>['handleFileUpload']
    > = jest.fn();

    const mockFile = new File([''], 'test.csv', { type: 'text/csv' });
    const mockError = 'No file provided or file is not a CSV.';

    handleFileUpload.mockImplementation(
      (
        _file: File,
        _fileType: ManuscriptFileType,
        handleError: (errorMessage: string) => void,
      ) => {
        handleError(mockError);
        return Promise.resolve(undefined);
      },
    );
    const { getByLabelText, getByText } = render(
      <StaticRouter location="/">
        <Suspense fallback={<div>Loading...</div>}>
          <ManuscriptForm
            {...defaultProps}
            title="manuscript title"
            type="Original Research"
            lifecycle="Publication"
            preprintDoi="10.4444/test"
            publicationDoi="10.4467/test"
            handleFileUpload={handleFileUpload}
          />
        </Suspense>
      </StaticRouter>,
    );

    const uploadInput = getByLabelText(/Upload Key Resource Table/i);

    await userEvent.upload(uploadInput, mockFile);

    await waitFor(() => {
      expect(getByText(mockError)).toBeInTheDocument();
    });
  });

  it('should show error when file size is greater than 100MB', async () => {
    const handleFileUpload: jest.MockedFunction<
      ComponentProps<typeof ManuscriptForm>['handleFileUpload']
    > = jest.fn();

    const mockFileContent = new Array(1024).fill('x').join('');
    const mockFile = new File([mockFileContent], 'test.csv', {
      type: 'text/csv',
    });
    Object.defineProperty(mockFile, 'size', { value: 101 * 1024 * 1024 });

    const { getByLabelText, getByText } = render(
      <StaticRouter location="/">
        <Suspense fallback={<div>Loading...</div>}>
          <ManuscriptForm
            {...defaultProps}
            title="manuscript title"
            type="Original Research"
            lifecycle="Publication"
            preprintDoi="10.4444/test"
            publicationDoi="10.4467/test"
            handleFileUpload={handleFileUpload}
          />
        </Suspense>
      </StaticRouter>,
    );

    const uploadInput = getByLabelText(/Upload Key Resource Table/i);

    await userEvent.upload(uploadInput, mockFile);

    await waitFor(() => {
      expect(
        getByText(
          'The file size exceeds the limit of 100 MB. Please upload a smaller file.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('should upload and remove file when user clicks on upload key resource table and remove button', async () => {
    const handleFileUpload = jest.fn(() =>
      Promise.resolve({
        id: '123',
        filename: 'test.csv',
        url: 'http://example.com/test.csv',
      }),
    );
    const { getByLabelText, queryByText, getByText, getByRole } = render(
      <StaticRouter location="/">
        <Suspense fallback={<div>Loading...</div>}>
          <ManuscriptForm
            {...defaultProps}
            title="manuscript title"
            type="Original Research"
            lifecycle="Publication"
            preprintDoi="10.4444/test"
            publicationDoi="10.4467/test"
            handleFileUpload={handleFileUpload}
          />
        </Suspense>
      </StaticRouter>,
    );

    expect(queryByText(/test.csv/i)).not.toBeInTheDocument();

    const testFile = new File(['file content'], 'test.csv', {
      type: 'text/csv',
    });
    const uploadInput = getByLabelText(/Upload Key Resource Table/i);

    await userEvent.upload(uploadInput, testFile);

    await waitFor(() => {
      expect(getByText(/test.csv/i)).toBeInTheDocument();
    });

    const removeFileButton = getByRole('button', { name: /cross/i });
    expect(removeFileButton).toBeInTheDocument();

    await userEvent.click(removeFileButton);

    await waitFor(() => {
      expect(queryByText(/test.csv/i)).not.toBeInTheDocument();
    });
  });
});

describe('additional files', () => {
  it('user can upload additional files', async () => {
    const onCreate = jest.fn();
    const { getByLabelText, queryByText, getByText } = render(
      <StaticRouter location="/">
        <Suspense fallback={<div>Loading...</div>}>
          <ManuscriptForm
            {...defaultProps}
            title="manuscript title"
            onCreate={onCreate}
            type="Original Research"
            lifecycle="Publication"
            preprintDoi="10.4444/test"
            publicationDoi="10.4467/test"
          />
        </Suspense>
      </StaticRouter>,
    );

    expect(queryByText(/test.pdf/i)).not.toBeInTheDocument();

    const testFile = new File(['file content'], 'test.pdf', {
      type: 'application/pdf',
    });
    const uploadInput = getByLabelText(/Upload Additional Files/i);

    await userEvent.upload(uploadInput, testFile);

    await waitFor(() => {
      expect(getByText(/test.pdf/i)).toBeInTheDocument();
    });
  });
  it('should show error when file upload fails', async () => {
    const handleFileUpload: jest.MockedFunction<
      ComponentProps<typeof ManuscriptForm>['handleFileUpload']
    > = jest.fn();

    const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });
    const mockError = 'No file provided or file is not a CSV or PDF.';

    handleFileUpload.mockImplementation(
      (
        _file: File,
        _fileType: ManuscriptFileType,
        handleError: (errorMessage: string) => void,
      ) => {
        handleError(mockError);
        return Promise.resolve(undefined);
      },
    );
    const { getByLabelText, getByText } = render(
      <StaticRouter location="/">
        <Suspense fallback={<div>Loading...</div>}>
          <ManuscriptForm
            {...defaultProps}
            title="manuscript title"
            type="Original Research"
            lifecycle="Publication"
            preprintDoi="10.4444/test"
            publicationDoi="10.4467/test"
            handleFileUpload={handleFileUpload}
          />
        </Suspense>
      </StaticRouter>,
    );

    const uploadInput = getByLabelText(/Upload Additional Files/i);

    await userEvent.upload(uploadInput, mockFile);

    await waitFor(() => {
      expect(getByText(mockError)).toBeInTheDocument();
    });
  });

  it('user cannot upload the same file multiple times', async () => {
    const onCreate = jest.fn();
    const { getByLabelText, getByText } = render(
      <StaticRouter location="/">
        <Suspense fallback={<div>Loading...</div>}>
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
        </Suspense>
      </StaticRouter>,
    );

    expect(getByText(/test.csv/i)).toBeInTheDocument();

    const testFile = new File(['file content'], 'test.csv', {
      type: 'application/pdf',
    });
    const uploadInput = getByLabelText(/Upload Additional Files/i);

    await userEvent.upload(uploadInput, testFile);

    await waitFor(() => {
      expect(getByText(/File uploaded already exists./i)).toBeInTheDocument();
    });
  });

  it('should show error when file size is greater than 100MB', async () => {
    const handleFileUpload: jest.MockedFunction<
      ComponentProps<typeof ManuscriptForm>['handleFileUpload']
    > = jest.fn();

    const mockFileContent = new Array(1024).fill('x').join('');
    const mockFile = new File([mockFileContent], 'test.pdf', {
      type: 'application/pdf',
    });
    Object.defineProperty(mockFile, 'size', { value: 101 * 1024 * 1024 });

    const { getByLabelText, getByText } = render(
      <StaticRouter location="/">
        <Suspense fallback={<div>Loading...</div>}>
          <ManuscriptForm
            {...defaultProps}
            title="manuscript title"
            type="Original Research"
            lifecycle="Publication"
            preprintDoi="10.4444/test"
            publicationDoi="10.4467/test"
            handleFileUpload={handleFileUpload}
          />
        </Suspense>
      </StaticRouter>,
    );

    const uploadInput = getByLabelText(/Upload Additional Files/i);

    await userEvent.upload(uploadInput, mockFile);

    await waitFor(() => {
      expect(
        getByText(
          'The file size exceeds the limit of 100 MB. Please upload a smaller file.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('should remove one of the additional files without removing the others', async () => {
    const { queryByText, getByText, getAllByRole } = render(
      <StaticRouter location="/">
        <Suspense fallback={<div>Loading...</div>}>
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
        </Suspense>
      </StaticRouter>,
    );

    expect(getByText(/file_one.csv/i)).toBeInTheDocument();
    expect(getByText(/file_two.pdf/i)).toBeInTheDocument();

    const removeFileOneButton = getAllByRole('button', {
      name: /cross/i,
    })[0]!;
    expect(removeFileOneButton).toBeInTheDocument();

    await userEvent.click(removeFileOneButton);

    await waitFor(() => {
      expect(queryByText(/file_one.csv/i)).not.toBeInTheDocument();
    });
    expect(getByText(/file_two.pdf/i)).toBeInTheDocument();
  });
});

it('user can add teams', async () => {
  const onCreate = jest.fn();
  const getTeamSuggestionsMock = jest.fn().mockResolvedValue([
    { label: 'Team A', value: 'team-a' },
    { label: 'Team B', value: 'team-b' },
  ]);
  const { getByText, findByRole, getByRole } = render(
    <StaticRouter location="/">
      <Suspense fallback={<div>Loading...</div>}>
        <ManuscriptForm
          {...defaultProps}
          title="manuscript title"
          onCreate={onCreate}
          type="Original Research"
          lifecycle="Publication"
          url="http://example.com"
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
      </Suspense>
    </StaticRouter>,
  );

  await userEvent.click(getByRole('textbox', { name: /Teams/i }));
  await waitFor(() => {
    expect(getByText('Team A')).toBeVisible();
  });
  await userEvent.click(getByText('Team A'));

  await userEvent.click(getByRole('textbox', { name: /Teams/i }));
  await waitFor(() => {
    expect(getByText('Team B')).toBeVisible();
  });
  await userEvent.click(getByText('Team B'));

  await submitForm({ findByRole });

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
  const { getByText, findByRole, getByRole } = render(
    <StaticRouter location="/">
      <Suspense fallback={<div>Loading...</div>}>
        <ManuscriptForm
          {...defaultProps}
          title="manuscript title"
          onCreate={onCreate}
          type="Original Research"
          lifecycle="Publication"
          url="http://example.com"
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
      </Suspense>
    </StaticRouter>,
  );
  await userEvent.click(getByRole('textbox', { name: /Labs/i }));
  await waitFor(() => {
    expect(getByText('Lab One')).toBeVisible();
  });
  await userEvent.click(getByText('Lab One'));

  await userEvent.click(getByRole('textbox', { name: /Labs/i }));
  expect(getByText('Lab Two')).toBeVisible();
  await userEvent.click(getByText('Lab Two'));

  await submitForm({ findByRole });

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
  const { getByText, getByRole } = render(
    <StaticRouter location="/">
      <Suspense fallback={<div>Loading...</div>}>
        <ManuscriptForm
          {...defaultProps}
          getTeamSuggestions={getTeamSuggestionsMock}
        />
      </Suspense>
    </StaticRouter>,
  );
  await userEvent.click(getByRole('textbox', { name: /Teams/i }));
  await waitFor(() => {
    expect(getByText(/Sorry, no teams match/i)).toBeVisible();
  });
});

it('displays error message when no lab is found', async () => {
  const getLabSuggestions = jest.fn().mockResolvedValue([]);
  const { getByText, getByRole } = render(
    <StaticRouter location="/">
      <Suspense fallback={<div>Loading...</div>}>
        <ManuscriptForm
          {...defaultProps}
          getLabSuggestions={getLabSuggestions}
        />
      </Suspense>
    </StaticRouter>,
  );
  await userEvent.click(getByRole('textbox', { name: /Labs/i }));
  await waitFor(() => {
    expect(getByText(/Sorry, no labs match/i)).toBeVisible();
  });
});

it('calls onUpdate when form is updated', async () => {
  const onUpdate = jest.fn();
  const { findByRole } = render(
    <StaticRouter location="/">
      <Suspense fallback={<div>Loading...</div>}>
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
      </Suspense>
    </StaticRouter>,
  );

  await submitForm({ findByRole });

  await waitFor(() => {
    expect(onUpdate).toHaveBeenCalledWith('manuscript-id', {
      teamId: '1',
      title: 'manuscript title',
      url: undefined,
      impact: 'impact-id-1',
      categories: ['category-id-1'],
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
          shortDescription: 'A good short description',
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
          manuscriptLicense: 'Yes',
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
  const { findByLabelText, findByRole, getByRole } = render(
    <StaticRouter location="/">
      <Suspense fallback={<div>Loading...</div>}>
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
      </Suspense>
    </StaticRouter>,
  );

  const lifecycleTextbox = getByRole('textbox', {
    name: /Where is the manuscript in the life cycle/i,
  });

  await userEvent.type(
    lifecycleTextbox,
    'Draft Manuscript (prior to Publication)',
  );
  await userEvent.type(lifecycleTextbox, '{Enter}');
  lifecycleTextbox.blur();

  const testManuscriptFile = new File(['file content'], 'manuscript.pdf', {
    type: 'application/pdf',
  });
  const testKeyResourceFile = new File(['file content'], 'keyresource.csv', {
    type: 'text/csv',
  });

  await userEvent.upload(
    await findByLabelText(/Upload Manuscript File/i),
    testManuscriptFile,
  );
  await userEvent.upload(
    await findByLabelText(/Upload Key Resource Table/i),
    testKeyResourceFile,
  );

  const quickChecks = getByRole('region', { name: /quick checks/i });

  for (const button of within(quickChecks).getAllByRole('radio', {
    name: 'Yes',
  })) {
    // eslint-disable-next-line no-await-in-loop -- Sequential clicks are intentional to simulate real user interaction
    await userEvent.click(button);
  }

  await submitForm({ findByRole });

  await waitFor(() => {
    expect(onResubmit).toHaveBeenCalledWith('manuscript-id', {
      teamId: '1',
      title: 'manuscript title',
      url: undefined,
      impact: 'impact-id-1',
      categories: ['category-id-1'],
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
          shortDescription: 'A good short description',
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

it('can generate short description when description is present', async () => {
  const getShortDescriptionFromDescription = jest
    .fn()
    .mockResolvedValue('A tiny description');

  const { getByRole } = render(
    <StaticRouter location="/">
      <Suspense fallback={<div>Loading...</div>}>
        <ManuscriptForm
          {...defaultProps}
          description="A very very long description"
          shortDescription={undefined}
          getShortDescriptionFromDescription={
            getShortDescriptionFromDescription
          }
          title="manuscript title"
          type="Original Research"
          lifecycle="Publication"
          preprintDoi="10.4444/test"
          publicationDoi="10.4467/test"
        />
      </Suspense>
    </StaticRouter>,
  );

  await userEvent.click(getByRole('button', { name: 'Generate' }));

  await waitFor(() => {
    expect(getShortDescriptionFromDescription).toHaveBeenCalledWith(
      'A very very long description',
    );
  });
});
