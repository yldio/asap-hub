import { render, waitFor, within } from '@testing-library/react';
import { ComponentProps, Suspense } from 'react';
import { StaticRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { createMessage } from '@asap-hub/fixtures';
import {
  AuthorResponse,
  AuthorSelectOption,
  QuickCheck,
  QuickCheckDetails,
  quickCheckQuestions,
} from '@asap-hub/model';
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

jest.mock(
  'react-lottie',
  () =>
    function MockLottie() {
      return <div>Loading...</div>;
    },
);

jest.setTimeout(30_000);
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation();
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
  url: 'http://example.com',
  isOpenScienceTeamMember: false,
  impact: { value: 'impact-id-1', label: 'Impact A' },
  categories: [{ value: 'category-id-1', label: 'Category A' }],
  getImpactSuggestions: getImpactSuggestionsMock,
  getCategorySuggestions: getCategorySuggestionsMock,
};

const submitForm = async ({ findByRole }: { findByRole: FindByRole }) => {
  const submitBtn = await findByRole('button', { name: /Submit/ });

  expect(submitBtn).toBeEnabled();

  await userEvent.click(submitBtn);

  const confirmBtn = await findByRole('button', {
    name: /Submit Manuscript/i,
  });
  expect(confirmBtn).toBeEnabled();

  await userEvent.click(confirmBtn);
};
jest.setTimeout(30000);

describe('QuickCheck logic', () => {
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
      const { findByRole, queryByText } = render(
        <StaticRouter>
          <Suspense fallback={<div>Loading...</div>}>
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
          </Suspense>
        </StaticRouter>,
      );

      await waitFor(() => {
        expect(queryByText(/Loading.../i)).not.toBeInTheDocument();
      });

      await submitForm({ findByRole });
      const payload = {
        title: 'manuscript title',
        url: 'http://example.com',
        eligibilityReasons: [],
        impact: 'impact-id-1',
        categories: ['category-id-1'],
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
            shortDescription: 'A good short description',
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
      const { findByRole } = render(
        <StaticRouter>
          <Suspense fallback={<div>Loading...</div>}>
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
          </Suspense>
        </StaticRouter>,
      );

      await submitForm({ findByRole });
      const payload = {
        title: 'manuscript title',
        url: 'http://example.com',
        eligibilityReasons: [],
        impact: 'impact-id-1',
        categories: ['category-id-1'],
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
            shortDescription: 'A good short description',
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
      const { findByRole, getByRole, getByTestId } = render(
        <StaticRouter>
          <Suspense fallback={<div>Loading...</div>}>
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
          </Suspense>
        </StaticRouter>,
      );

      userEvent.type(
        getByRole('textbox', { name: /Title of Manuscript/i }),
        'manuscript title',
      );
      const quickCheckFields = quickCheckQuestions.map((q) => q.field);

      quickCheckFields.forEach((f) => {
        within(getByTestId(f)).getByText('Yes').click();
      });

      await submitForm({ findByRole });

      await waitFor(() => {
        expect(onCreate).toHaveBeenCalledWith({
          title: 'manuscript title',
          url: 'http://example.com',
          eligibilityReasons: [],
          impact: 'impact-id-1',
          categories: ['category-id-1'],
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
    const {
      queryByText,
      getByTestId,
      getByLabelText,
      getAllByText,
      getByRole,
    } = render(
      <StaticRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <ManuscriptForm
            {...defaultProps}
            title="manuscript title"
            type="Original Research"
            publicationDoi="10.0777"
            url="http://example.com/111"
            lifecycle="Publication"
            manuscriptFile={{
              id: '123',
              filename: 'test.pdf',
              url: 'http://example.com/test.pdf',
            }}
            onCreate={onCreate}
          />
        </Suspense>
      </StaticRouter>,
    );
    await waitFor(() => {
      expect(queryByText(/Loading.../i)).not.toBeInTheDocument();
    });
    expect(queryByText(/Please enter the details./i)).not.toBeInTheDocument();

    const quickCheckFields = quickCheckQuestions.map((q) => q.field);

    quickCheckFields
      .filter((f) => f !== 'acknowledgedGrantNumber')
      .forEach((f) => {
        within(getByTestId(f)).getByText('Yes').click();
      });

    within(getByTestId('acknowledgedGrantNumber')).getByText('No').click();

    await waitFor(() => {
      expect(getByLabelText(/Please provide details/i)).toBeInTheDocument();
    });
    const input = getByLabelText(/Please provide details/i);

    input.focus();
    input.blur();

    await waitFor(() => {
      expect(getAllByText(/Please enter the details./i).length).toBeGreaterThan(
        0,
      );
    });

    userEvent.type(getByLabelText(/Please provide details/i), 'Some details');

    userEvent.click(getByRole('button', { name: /Submit/ }));

    await waitFor(() => {
      expect(queryByText(/Please enter the details./i)).not.toBeInTheDocument();
    });
  });

  it('displays an error message when quick check detail is longer than 256 characters', async () => {
    const onCreate = jest.fn();
    const { findByText, getByLabelText, queryByText } = render(
      <StaticRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <ManuscriptForm
            {...defaultProps}
            title="manuscript title"
            type="Original Research"
            publicationDoi="10.0777"
            url="http://example.com/111"
            lifecycle="Publication"
            manuscriptFile={{
              id: '123',
              filename: 'test.pdf',
              url: 'http://example.com/test.pdf',
            }}
            onCreate={onCreate}
            availabilityStatement="No"
            availabilityStatementDetails="d"
          />
        </Suspense>
      </StaticRouter>,
    );

    await waitFor(() => {
      expect(getByLabelText(/Please provide details/i)).toBeInTheDocument();
    });
    expect(
      queryByText(/Reason cannot exceed 256 characters./i),
    ).not.toBeInTheDocument();

    const input = getByLabelText(/Please provide details/i);
    userEvent.type(input, 'A'.repeat(257));
    input.blur();

    expect(
      await findByText(/Reason cannot exceed 256 characters./i),
    ).toBeVisible();
  });
});
