import { mockActWarningsInConsole } from '@asap-hub/dom-test-utils';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 } from '@asap-hub/model';
import { Notification, NotificationContext } from '@asap-hub/react-context';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode, useEffect } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { createIdentifierField } from '../../utils';
import OutputForm, { getPublishDateValidationMessage } from '../OutputForm';

jest.setTimeout(95_000);

let currentLocation: { pathname: string; search: string } | null = null;
const LocationCapture = () => {
  const location = useLocation();
  useEffect(() => {
    currentLocation = { pathname: location.pathname, search: location.search };
  }, [location]);
  return null;
};

const renderWithRouter = (children: ReactNode) =>
  render(<StaticRouter location="/">{children}</StaticRouter>);

describe('OutputForm', () => {
  const defaultProps = {
    shareOutput: jest.fn(),
    documentType: 'Procedural Form' as const,
    entityType: 'workingGroup' as const,
    getRelatedOutputSuggestions: jest.fn(),
    getRelatedEventSuggestions: jest.fn(),
    getShortDescriptionFromDescription: jest.fn(),
    tagSuggestions: [],
    cohortSuggestions: [],
    workingGroupSuggestions: [],
    projectSuggestions: [],
    mainEntityId: '12',
    workingGroups: [{ id: '12', title: 'a WG title' }],
  };

  const title = 'Output Title';
  const link = 'https://example.com/output';
  const description = 'An interesting article';
  const shortDescription = 'An article';
  const { authors: outputAuthors } = gp2Fixtures.createOutputResponse();
  outputAuthors[0]!.displayName = 'Tony Stark';

  const requiredProps = {
    title,
    link,
    authors: outputAuthors,
    description,
    shortDescription,
  };

  const setup = () => {
    const addNotification = jest.fn();

    const getAuthorSuggestions = jest.fn();
    getAuthorSuggestions.mockResolvedValue([
      {
        author: {
          ...gp2Fixtures.createUserResponse(),
          displayName: 'Chris Blue',
        },
        label: 'Chris Blue',
        value: 'u2',
      },
      {
        author: {
          ...gp2Fixtures.createExternalUserResponse(),
          displayName: 'Chris Reed',
        },
        label: 'Chris Reed (Non CRN)',
        value: 'u1',
      },
    ]);

    const getRelatedEventSuggestions = jest.fn();
    getRelatedEventSuggestions.mockResolvedValueOnce([
      {
        value: '23',
        label: 'some related event',
        endDate: '2021-12-28T14:00:00.000Z',
      },
    ]);

    const getRelatedOutputSuggestions = jest.fn();
    getRelatedOutputSuggestions.mockResolvedValue([
      {
        value: '11',
        label: 'some related output',
        documentType: 'GP2 Reports',
      },
    ]);

    const shareOutput = jest.fn();
    shareOutput.mockResolvedValueOnce(gp2Fixtures.createOutputResponse());

    const getShortDescriptionFromDescription = jest.fn();
    getShortDescriptionFromDescription.mockReturnValue(
      'Short description content',
    );

    return {
      addNotification,
      getAuthorSuggestions,
      getRelatedEventSuggestions,
      getRelatedOutputSuggestions,
      getShortDescriptionFromDescription,
      shareOutput,
    };
  };

  beforeEach(() => {
    currentLocation = null;
  });

  afterEach(jest.resetAllMocks);

  it.each`
    entityType        | entityText         | notificationMessage                                      | entity
    ${'workingGroup'} | ${'working group'} | ${'Working group Code/Software published successfully.'} | ${{ workingGroups: [{ id: '12', title: 'a WG title' }], projects: [] }}
    ${'project'}      | ${'project'}       | ${'Project Code/Software published successfully.'}       | ${{ projects: [{ id: '12', title: 'a project title' }], workingGroups: [] }}
  `(
    'publish the form for entity $entityType',
    async ({ entityType, entityText, entity, notificationMessage }) => {
      const user = userEvent.setup();
      const {
        addNotification,
        getAuthorSuggestions,
        getRelatedEventSuggestions,
        getRelatedOutputSuggestions,
        shareOutput,
      } = setup();
      const { container } = render(
        <OutputForm
          {...defaultProps}
          {...entity}
          description="An interesting article"
          shortDescription="An article"
          gp2Supported="Yes"
          sharingStatus="GP2 Only"
          tags={[{ id: '27' }]}
          entityType={entityType}
          documentType="Code/Software"
          shareOutput={shareOutput}
          getAuthorSuggestions={getAuthorSuggestions}
          getRelatedOutputSuggestions={getRelatedOutputSuggestions}
          getRelatedEventSuggestions={getRelatedEventSuggestions}
          workingGroupSuggestions={[{ id: '2', title: 'another group' }]}
          projectSuggestions={[{ id: '3', title: 'another project' }]}
          tagSuggestions={[
            {
              id: '27',
              name: 'some tag name',
            },
          ]}
        />,
        {
          wrapper: ({ children }) => (
            <NotificationContext.Provider
              value={{
                notifications: [],
                addNotification,
                removeNotification: jest.fn(),
              }}
            >
              <MemoryRouter>
                <LocationCapture />
                {children}
              </MemoryRouter>
            </NotificationContext.Provider>
          ),
        },
      );

      await user.type(
        screen.getByRole('textbox', { name: /title/i }),
        'output title',
      );

      await user.type(
        screen.getByRole('textbox', { name: /url/i }),
        'https://example.com',
      );

      await user.click(
        screen.getByRole('textbox', { name: /identifier type/i }),
      );
      await user.click(screen.getByText(/^none/i));
      await user.click(
        screen.getByRole('textbox', {
          name: /working groups/i,
        }),
      );

      await user.click(screen.getByText('another group'));

      await user.click(
        screen.getByRole('textbox', {
          name: /projects/i,
        }),
      );

      await user.click(screen.getByText('another project'));

      const authors = screen.getByRole('textbox', { name: /Authors/i });
      await user.click(authors);

      await user.click(await screen.findByText(/Chris Reed/i));
      await user.click(authors);
      await user.click(screen.getByText('Chris Blue'));
      await user.click(authors);
      await user.type(authors, 'Alex White');

      const loadingElement = screen.queryByText(/loading/i);
      if (loadingElement) {
        await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
      }
      await user.click(screen.getAllByText('Alex White')[1]!);

      await user.click(
        screen.getByRole('textbox', {
          name: /related output/i,
        }),
      );
      await user.click(await screen.findByText('some related output'));
      await user.click(
        screen.getByRole('textbox', {
          name: /related gp2 hub events/i,
        }),
      );
      await user.click(await screen.findByText('some related event'));

      expect(
        screen.queryByText('Publish output for the whole hub?'),
      ).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Publish' }));

      expect(
        screen.getByText('Publish output for the whole hub?'),
      ).toBeVisible();
      expect(container).toHaveTextContent(
        `All ${entityText} members listed on this output will be notified and all GP2 members will be able to access it. If you need to unpublish this output, please contact techsupport@gp2.org.`,
      );

      await user.click(screen.getByRole('button', { name: 'Publish Output' }));

      await waitFor(() => {
        expect(shareOutput).toHaveBeenCalledWith({
          createVersion: false,
          title: 'output title',
          link: 'https://example.com',
          documentType: 'Code/Software',
          description: 'An interesting article',
          shortDescription: 'An article',
          gp2Supported: 'Yes',
          sharingStatus: 'GP2 Only',
          authors: [
            { externalUserId: 'u1' },
            { userId: 'u2' },
            { externalUserName: 'Alex White' },
          ],
          mainEntityId: '12',
          workingGroupIds: ['2'],
          projectIds: ['3'],
          relatedOutputIds: ['11'],
          relatedEventIds: ['23'],
          tagIds: ['27'],
          contributingCohortIds: [],
        });
      });

      expect(addNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          message: notificationMessage,
          page: 'output',
          type: 'success',
        }),
      );
      expect(currentLocation?.pathname).toEqual(`/outputs/ro0`);
    },
  );

  it('can submit published date', async () => {
    const user = userEvent.setup();
    const { addNotification, getAuthorSuggestions, shareOutput } = setup();

    render(
      <OutputForm
        {...defaultProps}
        {...requiredProps}
        link={undefined}
        shareOutput={shareOutput}
        getAuthorSuggestions={getAuthorSuggestions}
      />,
      {
        wrapper: ({ children }) => (
          <NotificationContext.Provider
            value={{
              notifications: [],
              addNotification,
              removeNotification: jest.fn(),
            }}
          >
            <MemoryRouter>
              <LocationCapture />
              {children}
            </MemoryRouter>
          </NotificationContext.Provider>
        ),
      },
    );

    await user.type(
      screen.getByRole('textbox', { name: /url/i }),
      'https://example.com',
    );

    const sharingStatus = screen.getByRole('group', {
      name: /sharing status?/i,
    });
    await user.click(
      within(sharingStatus).getByRole('radio', { name: 'Public' }),
    );
    fireEvent.change(
      screen.getByLabelText(/public repository published date/i),
      {
        target: { value: '2022-03-24' },
      },
    );

    await user.click(screen.getByRole('button', { name: 'Publish' }));
    await user.click(screen.getByRole('button', { name: 'Publish Output' }));

    await waitFor(() => {
      expect(shareOutput).toHaveBeenCalledWith(
        expect.objectContaining({
          sharingStatus: 'Public',
          publishDate: new Date('2022-03-24').toISOString(),
        }),
      );
    });
  });

  it('can generate short description when description is present', async () => {
    const user = userEvent.setup();
    const { addNotification, getShortDescriptionFromDescription } = setup();
    getShortDescriptionFromDescription.mockResolvedValue(
      'An interesting article',
    );

    render(
      <OutputForm
        {...defaultProps}
        getShortDescriptionFromDescription={getShortDescriptionFromDescription}
        description="An interesting article"
      />,
      {
        wrapper: ({ children }) => (
          <NotificationContext.Provider
            value={{
              notifications: [],
              addNotification,
              removeNotification: jest.fn(),
            }}
          >
            <MemoryRouter>
              <LocationCapture />
              {children}
            </MemoryRouter>
          </NotificationContext.Provider>
        ),
      },
    );
    expect(
      screen.getByRole('textbox', { name: /short description/i }),
    ).toHaveValue('');

    await user.click(screen.getByRole('button', { name: /Generate/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('textbox', { name: /short description/i }),
      ).toHaveValue('An interesting article');
    });
  });

  describe('Edit output', () => {
    it('renders with projects', () => {
      const output = {
        ...defaultProps,
        ...gp2Fixtures.createOutputResponse(),
        entityType: 'project' as const,
        projects: [{ id: '1', title: 'a project' }],
        workingGroups: undefined,
      };
      renderWithRouter(<OutputForm {...output} />);

      expect(
        screen.getByRole('textbox', { name: /working groups/i }),
      ).toBeVisible();
      expect(
        screen.getByLabelText(/working groups/i, {
          selector: 'input',
        }),
      ).toHaveValue('');
      expect(screen.getByRole('textbox', { name: /projects/i })).toBeVisible();
      expect(screen.getByText('a project')).toBeVisible();
    });

    it('does not render cohort', () => {
      renderWithRouter(
        <OutputForm {...defaultProps} documentType="Training Materials" />,
      );

      expect(
        screen.queryByRole('textbox', { name: /cohorts/i }),
      ).not.toBeInTheDocument();
    });

    it('does not display publish modal when editing and clicks save', async () => {
      const user = userEvent.setup();
      const { addNotification } = setup();
      const publishDate = '2020-03-04';
      const output = {
        ...defaultProps,
        ...requiredProps,
        ...gp2Fixtures.createOutputResponse(),
        publishDate,
        tags: [{ id: 'tag-1', name: 'Tag' }],
        contributingCohorts: [{ id: 'cohort-1', name: 'Cohort' }],
        documentType: 'Dataset' as gp2.OutputDocumentType,
      };
      render(<OutputForm {...output} />, {
        wrapper: ({ children }) => (
          <NotificationContext.Provider
            value={{
              notifications: [],
              addNotification,
              removeNotification: jest.fn(),
            }}
          >
            <MemoryRouter>
              <LocationCapture />
              {children}
            </MemoryRouter>
          </NotificationContext.Provider>
        ),
      });

      await user.click(screen.getByRole('button', { name: /save/i }));

      expect(
        screen.queryByText('Publish output for the whole hub?'),
      ).not.toBeInTheDocument();

      await waitFor(() => {
        expect(defaultProps.shareOutput).toHaveBeenCalled();
      });
    });
  });

  describe('Versioning', () => {
    const renderWithCreateVersion = (
      outputTitle = 'test versioning',
      createVersion = true,
      versions: gp2.OutputVersion[] = [],
    ) =>
      renderWithRouter(
        <OutputForm
          {...defaultProps}
          title={outputTitle}
          createVersion={createVersion}
          versions={versions}
        />,
      );

    it('does not display version history card when editing an output with no previous versions', () => {
      renderWithCreateVersion(undefined, false, []);
      expect(screen.queryByText('Version History')).not.toBeInTheDocument();
    });

    it('displays a version history card with the previous versions when editing an output with previous versions', () => {
      const versions: gp2.OutputVersion[] = [
        {
          addedDate: '2021-12-28T14:00:00.000Z',
          documentType: 'Article',
          id: '12345',
          title: 'Previous Version Test',
        },
      ];
      renderWithCreateVersion(undefined, false, versions);
      expect(screen.getByText('Version History')).toBeInTheDocument();
      expect(screen.getByText('Previous Version Test')).toBeInTheDocument();
      const versionHistoryCard =
        screen.getByText('Version History').parentElement!;
      expect(
        within(versionHistoryCard).queryByText('test versioning'),
      ).not.toBeInTheDocument();
    });

    it('displays a version history row of the current version when versioning', () => {
      renderWithCreateVersion();
      expect(screen.getByText('Version History')).toBeInTheDocument();
      const versionHistoryCard =
        screen.getByText('Version History').parentElement!;
      expect(
        within(versionHistoryCard).getByText('test versioning'),
      ).toBeInTheDocument();
    });

    it('handles empty title', () => {
      renderWithCreateVersion('');
      expect(screen.getByText('Version History')).toBeInTheDocument();
      expect(screen.getByText('#1')).toBeInTheDocument();
    });

    it('should publish the version for an Article and display an appropriate message', async () => {
      const user = userEvent.setup();
      const { addNotification, getAuthorSuggestions, shareOutput } = setup();

      render(
        <OutputForm
          {...defaultProps}
          {...requiredProps}
          documentType={'Dataset' as gp2.OutputDocumentType}
          shareOutput={shareOutput}
          getAuthorSuggestions={getAuthorSuggestions}
          createVersion={true}
        />,
        {
          wrapper: ({ children }) => (
            <NotificationContext.Provider
              value={{
                notifications: [],
                addNotification,
                removeNotification: jest.fn(),
              }}
            >
              <MemoryRouter>
                <LocationCapture />
                {children}
              </MemoryRouter>
            </NotificationContext.Provider>
          ),
        },
      );

      await user.click(screen.getByRole('button', { name: 'Publish' }));
      await user.click(
        screen.getByRole('button', { name: 'Publish new version' }),
      );

      await waitFor(() => {
        expect(shareOutput).toHaveBeenCalled();
      });

      expect(addNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          message: `New working group Dataset version published successfully.`,
          page: 'output',
          type: 'success',
        }),
      );
      expect(currentLocation?.pathname).toEqual(`/outputs/ro0`);
    });
  });

  describe('Article', () => {
    it('renders type', () => {
      renderWithRouter(<OutputForm {...defaultProps} documentType="Article" />);
      expect(screen.getByRole('textbox', { name: /^type/i })).toBeVisible();
    });
    it.each<gp2.OutputType>(['Blog', 'Hot Topic', 'Letter', 'Review'])(
      '%s does not render subtype',
      async (type) => {
        const user = userEvent.setup();
        renderWithRouter(
          <OutputForm {...defaultProps} documentType="Article" />,
        );
        await user.click(screen.getByRole('textbox', { name: /^type/i }));
        await user.click(screen.getByText(type));
        expect(
          screen.queryByRole('textbox', { name: /subtype/i }),
        ).not.toBeInTheDocument();
      },
    );
    it.each<gp2.OutputType>(['Research'])(
      '%s renders subtype',
      async (type) => {
        const user = userEvent.setup();
        renderWithRouter(
          <OutputForm {...defaultProps} documentType="Article" />,
        );
        await user.click(screen.getByRole('textbox', { name: /^type/i }));
        await user.click(screen.getByText(type));
        expect(screen.getByRole('textbox', { name: /subtype/i })).toBeVisible();
      },
    );

    it('publishes with type and subtype', async () => {
      const user = userEvent.setup();
      const { getAuthorSuggestions, shareOutput } = setup();

      render(
        <OutputForm
          {...defaultProps}
          {...requiredProps}
          link={undefined}
          documentType="Article"
          shareOutput={shareOutput}
          getAuthorSuggestions={getAuthorSuggestions}
        />,
        {
          wrapper: ({ children }) => (
            <NotificationContext.Provider
              value={{
                notifications: [],
                addNotification: jest.fn(),
                removeNotification: jest.fn(),
              }}
            >
              <MemoryRouter>
                <LocationCapture />
                {children}
              </MemoryRouter>
            </NotificationContext.Provider>
          ),
        },
      );

      await user.type(
        screen.getByRole('textbox', { name: /url/i }),
        'https://example.com',
      );
      await user.click(screen.getByRole('textbox', { name: /^type/i }));
      await user.click(screen.getByText('Research'));
      await user.click(screen.getByRole('textbox', { name: /subtype/i }));
      await user.click(screen.getByText('Published'));

      await user.click(screen.getByRole('button', { name: 'Publish' }));
      await user.click(screen.getByRole('button', { name: 'Publish Output' }));

      await waitFor(() => {
        expect(shareOutput).toHaveBeenCalledWith(
          expect.objectContaining({
            documentType: 'Article',
            type: 'Research',
            subtype: 'Published',
          }),
        );
      });
      expect(currentLocation?.pathname).toEqual(`/outputs/ro0`);
    });
  });

  describe('Base Information Section', () => {
    describe('GP2 Supported', () => {
      test.each`
        documentType
        ${'Procedural Form'}
        ${'Training Materials'}
      `(
        'is not displayed when document type is $documentType',
        ({ documentType }) => {
          renderWithRouter(
            <OutputForm {...defaultProps} documentType={documentType} />,
          );

          expect(
            screen.queryByRole('group', {
              name: /has this output been supported by gp2?/i,
            }),
          ).toBeNull();
        },
      );

      test.each`
        gp2SupportedValue | documentType
        ${'Yes'}          | ${'GP2 Reports'}
        ${"Don't Know"}   | ${'Dataset'}
        ${"Don't Know"}   | ${'Code/Software'}
        ${"Don't Know"}   | ${'Article'}
      `(
        'is $gp2SupportedValue by default when document type is $documentType',
        ({ gp2SupportedValue, documentType }) => {
          renderWithRouter(
            <OutputForm {...defaultProps} documentType={documentType} />,
          );

          const gp2Supported = screen.getByRole('group', {
            name: /has this output been supported by gp2?/i,
          });
          expect(
            within(gp2Supported).getByRole('radio', {
              name: gp2SupportedValue,
            }),
          ).toBeChecked();
        },
      );

      test.each`
        gp2SupportedValue | type
        ${'Yes'}          | ${'Blog'}
        ${"Don't Know"}   | ${'Research'}
        ${"Don't Know"}   | ${'Review'}
        ${"Don't Know"}   | ${'Letter'}
        ${"Don't Know"}   | ${'Hot Topic'}
      `(
        'is $gp2SupportedValue by default when type is $type',
        ({ gp2SupportedValue, type }) => {
          renderWithRouter(
            <OutputForm {...defaultProps} documentType="Article" type={type} />,
          );

          const gp2Supported = screen.getByRole('group', {
            name: /has this output been supported by gp2?/i,
          });
          expect(
            within(gp2Supported).getByRole('radio', {
              name: gp2SupportedValue,
            }),
          ).toBeChecked();
        },
      );

      test("is set to 'Yes' and make the gp2 supported disabled when type Blog is selected", () => {
        renderWithRouter(
          <OutputForm {...defaultProps} type="Blog" documentType="Article" />,
        );

        const gp2Supported = screen.getByRole('group', {
          name: /has this output been supported by gp2?/i,
        });

        expect(
          within(gp2Supported).getByRole('radio', { name: 'Yes' }),
        ).toBeChecked();

        expect(
          within(gp2Supported).getByRole('radio', { name: 'No' }),
        ).toBeDisabled();

        expect(
          within(gp2Supported).getByRole('radio', { name: "Don't Know" }),
        ).toBeDisabled();
      });
    });

    describe('Sharing Status', () => {
      test.each`
        sharingStatus | documentType
        ${'Public'}   | ${'Training Materials'}
        ${'GP2 Only'} | ${'GP2 Reports'}
        ${'GP2 Only'} | ${'Procedural Form'}
        ${'GP2 Only'} | ${'Dataset'}
        ${'GP2 Only'} | ${'Code/Software'}
        ${'GP2 Only'} | ${'Article'}
      `(
        'is $sharingStatus by default when document type is $documentType',
        ({ sharingStatus, documentType }) => {
          renderWithRouter(
            <OutputForm {...defaultProps} documentType={documentType} />,
          );

          const sharingStatusElement = screen.getByRole('group', {
            name: /sharing status?/i,
          });
          expect(
            within(sharingStatusElement).getByRole('radio', {
              name: sharingStatus,
            }),
          ).toBeChecked();
        },
      );
    });
    it.each<gp2.OutputDocumentType>(['GP2 Reports', 'Training Materials'])(
      'should not render identifier textbox when docType = %d',
      (type) => {
        renderWithRouter(<OutputForm {...defaultProps} documentType={type} />);

        expect(
          screen.queryByRole('textbox', { name: /identifier type/i }),
        ).not.toBeInTheDocument();
      },
    );
  });

  describe('Extra Information Section', () => {
    describe('Tags', () => {
      const defaultSuggestions = [
        { id: '1', name: '2D Cultures' },
        { id: '2', name: 'Adenosine' },
        { id: '3', name: 'Adrenal' },
      ];

      const defaultTags = [{ id: '5', name: 'Neurology' }];
      const renderWithSuggestions = (
        suggestions = defaultSuggestions,
        tags = defaultTags,
      ) =>
        renderWithRouter(
          <OutputForm
            {...defaultProps}
            tagSuggestions={suggestions}
            tags={tags}
          />,
        );

      it('displays tags empty', () => {
        renderWithSuggestions(defaultSuggestions, []);
        const textbox = screen.getByRole('textbox', {
          name: /tags/i,
        });
        expect(textbox).toBeVisible();
        expect(textbox).toHaveValue('');
        expect(
          screen.getByText('Start typing... (E.g. Neurology)'),
        ).toBeVisible();
      });

      it('displays tags suggestions', async () => {
        const user = userEvent.setup();
        renderWithSuggestions();
        await user.click(screen.getByLabelText(/additional tags/i));
        expect(screen.getByText('2D Cultures')).toBeVisible();
        expect(screen.getByText('Adenosine')).toBeVisible();
        expect(screen.getByText('Adrenal')).toBeVisible();
      });

      it('displays existing tags', () => {
        renderWithSuggestions();
        expect(screen.getByText('Neurology')).toBeVisible();
      });

      it('update tags after adding one', async () => {
        const user = userEvent.setup();
        renderWithSuggestions();
        await user.click(screen.getByLabelText(/additional tags/i));
        await user.click(screen.getByText('2D Cultures'));
        expect(screen.getByText('Neurology')).toBeVisible();
        expect(screen.getByText('2D Cultures')).toBeVisible();
      });
    });

    describe('createIdentifierField', () => {
      it('maps the OutputIdentifierType to fields including the identifier', () => {
        expect(
          createIdentifierField(gp2.OutputIdentifierType.Empty, 'identifier'),
        ).toEqual({});
        expect(
          createIdentifierField(gp2.OutputIdentifierType.RRID, 'identifier'),
        ).toEqual({ rrid: 'identifier' });
        expect(
          createIdentifierField(gp2.OutputIdentifierType.DOI, 'identifier'),
        ).toEqual({ doi: 'identifier' });
        expect(
          createIdentifierField(
            gp2.OutputIdentifierType.AccessionNumber,
            'identifier',
          ),
        ).toEqual({ accessionNumber: 'identifier' });
      });
    });

    describe('identifierType', () => {
      it('returns DOI when doi is present', () => {
        renderWithRouter(<OutputForm {...defaultProps} doi="123" />);

        expect(screen.getByDisplayValue(/doi/i)).toBeTruthy();
      });
      it('returns RRID when rrid is present', () => {
        renderWithRouter(<OutputForm {...defaultProps} rrid="123" />);
        expect(screen.getByDisplayValue(/rrid/i)).toBeTruthy();
      });
      it('returns Accession Number when accession is present', () => {
        renderWithRouter(
          <OutputForm {...defaultProps} accessionNumber="123" />,
        );
        expect(screen.getByDisplayValue(/accession number/i)).toBeTruthy();
      });
      it('returns empty for create mode', () => {
        renderWithRouter(<OutputForm {...defaultProps} />);

        expect(screen.getByText(/choose an identifier.../i)).toBeVisible();
      });
      it('return none for edit mode', () => {
        renderWithRouter(<OutputForm {...defaultProps} title="Output Title" />);
        expect(screen.getByDisplayValue(/none/i)).toBeTruthy();
      });
    });
  });

  describe('Contributors Section', () => {
    describe('Cohorts', () => {
      const defaultCohortSuggestions = [
        { id: '1', name: '2D Cultures' },
        { id: '2', name: 'Adenosine' },
        { id: '3', name: 'Adrenal' },
      ];

      const defaultCohorts = [{ id: '5', name: 'Neurology' }];
      const renderWithSuggestions = (
        suggestions = defaultCohortSuggestions,
        cohorts = defaultCohorts,
      ) =>
        renderWithRouter(
          <OutputForm
            {...defaultProps}
            cohortSuggestions={suggestions}
            contributingCohorts={cohorts}
          />,
        );

      it('displays cohorts empty', () => {
        renderWithSuggestions(defaultCohortSuggestions, []);
        const textbox = screen.getByRole('textbox', {
          name: /cohorts/i,
        });
        expect(textbox).toBeVisible();
        expect(textbox).toHaveValue('');
      });

      it('displays cohorts suggestions', async () => {
        const user = userEvent.setup();
        renderWithSuggestions();
        await user.click(screen.getByLabelText(/cohorts/i));
        expect(screen.getByText('2D Cultures')).toBeVisible();
        expect(screen.getByText('Adenosine')).toBeVisible();
        expect(screen.getByText('Adrenal')).toBeVisible();
      });

      it('displays existing cohorts', () => {
        renderWithSuggestions();
        expect(screen.getByText('Neurology')).toBeVisible();
      });

      it('update cohorts after adding one', async () => {
        const user = userEvent.setup();
        renderWithSuggestions();
        await user.click(screen.getByLabelText(/cohorts/i));
        await user.click(screen.getByText('2D Cultures'));
        expect(screen.getByText('Neurology')).toBeVisible();
        expect(screen.getByText('2D Cultures')).toBeVisible();
      });
    });

    describe('Working Groups', () => {
      const defaultWorkingGroupsSuggestions = [{ id: '1', title: 'WG 1' }];

      const defaultWorkingGroups = [{ id: '5', title: 'A WG title' }];
      const renderWithSuggestions = (
        suggestions = defaultWorkingGroupsSuggestions,
        workingGroups = defaultWorkingGroups,
      ) =>
        renderWithRouter(
          <OutputForm
            {...defaultProps}
            workingGroupSuggestions={suggestions}
            workingGroups={workingGroups}
          />,
        );

      it('displays working groups empty', () => {
        renderWithSuggestions(defaultWorkingGroupsSuggestions, []);
        const textbox = screen.getByRole('textbox', {
          name: /working groups/i,
        });
        expect(textbox).toBeVisible();
        expect(textbox).toHaveValue('');
      });

      it('displays working groups suggestions', async () => {
        const user = userEvent.setup();
        renderWithSuggestions();
        await user.click(screen.getByLabelText(/working groups/i));
        expect(screen.getByText('WG 1')).toBeVisible();
      });

      it('displays existing working groups', () => {
        renderWithSuggestions();
        expect(screen.getByText('A WG title')).toBeVisible();
      });

      it('update working groups after adding one', async () => {
        const user = userEvent.setup();
        renderWithSuggestions();
        await user.click(screen.getByLabelText(/working groups/i));
        await user.click(screen.getByText('WG 1'));
        expect(screen.getByText('A WG title')).toBeVisible();
        expect(screen.getByText('WG 1')).toBeVisible();
      });

      it('shows the custom no options message for working groups', async () => {
        const user = userEvent.setup();
        renderWithSuggestions();

        await user.type(
          screen.getByLabelText(/working groups/i),
          'asdflkjasdflkj',
        );

        expect(
          screen.getByText('Sorry, no working groups match asdflkjasdflkj'),
        ).toBeVisible();
      });
    });

    describe('Projects', () => {
      const defaultProjectsSuggestions = [{ id: '1', title: 'Project 1' }];

      const defaultProjects = [{ id: '5', title: 'A Project title' }];
      const renderWithSuggestions = (
        suggestions = defaultProjectsSuggestions,
        projects = defaultProjects,
      ) =>
        renderWithRouter(
          <OutputForm
            {...defaultProps}
            entityType="project"
            projectSuggestions={suggestions}
            projects={projects}
          />,
        );

      it('displays projects empty', () => {
        renderWithSuggestions(defaultProjectsSuggestions, []);
        const textbox = screen.getByRole('textbox', {
          name: /projects/i,
        });
        expect(textbox).toBeVisible();
        expect(textbox).toHaveValue('');
      });

      it('displays projects suggestions', async () => {
        const user = userEvent.setup();
        renderWithSuggestions();
        await user.click(screen.getByLabelText(/projects/i));
        expect(screen.getByText('Project 1')).toBeVisible();
      });

      it('displays existing projects', () => {
        renderWithSuggestions();
        expect(screen.getByText('A Project title')).toBeVisible();
      });

      it('update projects after adding one', async () => {
        const user = userEvent.setup();
        renderWithSuggestions();
        await user.click(screen.getByLabelText(/projects/i));
        await user.click(screen.getByText('Project 1'));
        expect(screen.getByText('A Project title')).toBeVisible();
        expect(screen.getByText('Project 1')).toBeVisible();
      });

      it('shows the custom no options message for projects', async () => {
        const user = userEvent.setup();
        renderWithSuggestions();

        await user.type(screen.getByLabelText(/projects/i), 'asdflkjasdflkj');

        expect(
          screen.getByText('Sorry, no projects match asdflkjasdflkj'),
        ).toBeVisible();
      });
    });
  });

  describe('Validation', () => {
    it('shows error message for missing value title', async () => {
      renderWithRouter(<OutputForm {...defaultProps} />);
      const input = screen.getByLabelText(/title/i);
      fireEvent.focusOut(input);
      await waitFor(() => {
        expect(screen.getByText('Please enter a title.')).toBeVisible();
      });
    });

    describe('Short Description Validation', () => {
      it('shows error message when short description exceeds 250 characters', async () => {
        renderWithRouter(<OutputForm {...defaultProps} />);
        const input = screen.getByLabelText(/short description/i);
        const longText = 'a'.repeat(251);
        fireEvent.change(input, { target: { value: longText } });
        fireEvent.focusOut(input);
        await waitFor(() => {
          expect(
            screen.getByText(
              'The short description exceeds the character limit. Please limit it to 250 characters.',
            ),
          ).toBeVisible();
        });
      });

      it('shows error message when short description is empty after trimming', async () => {
        renderWithRouter(<OutputForm {...defaultProps} />);
        const input = screen.getByLabelText(/short description/i);
        fireEvent.change(input, { target: { value: '   ' } });
        fireEvent.focusOut(input);
        await waitFor(() => {
          expect(
            screen.getByText('Please enter a short description'),
          ).toBeVisible();
        });
      });

      it('does not show error message when short description is valid', async () => {
        renderWithRouter(<OutputForm {...defaultProps} />);
        const input = screen.getByLabelText(/short description/i);
        fireEvent.change(input, {
          target: { value: 'Valid short description' },
        });
        fireEvent.focusOut(input);
        await waitFor(() => {
          expect(
            screen.queryByText('Please enter a short description'),
          ).not.toBeInTheDocument();
          expect(
            screen.queryByText(
              'The short description exceeds the character limit. Please limit it to 250 characters.',
            ),
          ).not.toBeInTheDocument();
        });
      });
    });

    it('shows the custom error message for a date in the future', async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = mockActWarningsInConsole('error');

      renderWithRouter(<OutputForm {...defaultProps} />);

      const sharingStatus = screen.getByRole('group', {
        name: /sharing status?/i,
      });
      await user.click(
        within(sharingStatus).getByRole('radio', { name: 'Public' }),
      );

      const input = screen.getByLabelText(/public repository published date/i);
      fireEvent.change(input, {
        target: { value: '2050-12-12' },
      });
      fireEvent.focusOut(input);

      await waitFor(() => {
        expect(
          screen.getByText(/publish date cannot be greater than today/i),
        ).toBeVisible();
      });
      // Wait for any pending state updates to settle
      await waitFor(() => {});

      consoleErrorSpy.mockRestore();
    });
  });

  describe('getPublishDateValidationMessage', () => {
    const e: ValidityState = {
      badInput: false,
      rangeOverflow: false,
      rangeUnderflow: false,
      stepMismatch: false,
      tooLong: false,
      tooShort: false,
      typeMismatch: false,
      valid: false,
      valueMissing: false,
      customError: false,
      patternMismatch: false,
    };

    it('returns a message when the date is in the future', () => {
      expect(
        getPublishDateValidationMessage({ ...e, rangeOverflow: true }),
      ).toEqual('Publish date cannot be greater than today');
    });

    it('returns a message when the date is invalid', () => {
      expect(getPublishDateValidationMessage({ ...e, badInput: true })).toEqual(
        'Date published should be complete or removed',
      );
    });
  });

  describe('Notification Errors', () => {
    let addNotification: jest.Mock;
    let getAuthorSuggestions: jest.Mock;
    let getRelatedOutputSuggestions: jest.Mock;
    let shareOutput: jest.Mock;
    let removeNotification: jest.Mock;
    let notifications: Notification[];

    beforeEach(() => {
      addNotification = jest.fn();
      getAuthorSuggestions = jest.fn();
      getAuthorSuggestions.mockResolvedValue([
        {
          author: {
            ...gp2Fixtures.createUserResponse(),
            displayName: 'Chris Blue',
          },
          label: 'Chris Blue',
          value: 'u2',
        },
        {
          author: {
            ...gp2Fixtures.createExternalUserResponse(),
            displayName: 'Chris Reed',
          },
          label: 'Chris Reed (Non CRN)',
          value: 'u1',
        },
      ]);
      getRelatedOutputSuggestions = jest.fn();
      getRelatedOutputSuggestions.mockResolvedValue([
        {
          value: '11',
          label: 'some related output',
          documentType: 'GP2 Reports',
        },
      ]);
      shareOutput = jest.fn();
      shareOutput.mockResolvedValue(gp2Fixtures.createOutputResponse());
      removeNotification = jest.fn();
      notifications = [];
    });

    it('shows error message because of empty required fields', async () => {
      const user = userEvent.setup();

      // Suppress act warnings from async state updates in TextField
      const originalConsoleError = console.error;
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation((...args) => {
          const message = args[0]?.toString() || '';
          if (message.includes('not wrapped in act(')) {
            return; // Suppress act warnings
          }
          originalConsoleError.apply(console, args);
        });

      render(
        <OutputForm
          {...defaultProps}
          documentType="Code/Software"
          shareOutput={shareOutput}
          getAuthorSuggestions={getAuthorSuggestions}
          getRelatedOutputSuggestions={getRelatedOutputSuggestions}
          workingGroupSuggestions={[{ id: '2', title: 'another group' }]}
        />,
        {
          wrapper: ({ children }) => (
            <NotificationContext.Provider
              value={{
                notifications: [],
                addNotification,
                removeNotification,
              }}
            >
              <MemoryRouter>
                <LocationCapture />
                {children}
              </MemoryRouter>
            </NotificationContext.Provider>
          ),
        },
      );

      await user.click(screen.getByRole('button', { name: 'Publish' }));

      await waitFor(() => {
        expect(shareOutput).not.toHaveBeenCalled();
        expect(removeNotification).not.toHaveBeenCalled();
        expect(addNotification).toHaveBeenCalledWith(
          expect.objectContaining({
            message:
              'There are some errors in the form. Please correct the fields below.',
            page: 'output-form',
            type: 'error',
          }),
        );
      });
      // Wait for any pending state updates to settle
      await waitFor(() => {});

      consoleErrorSpy.mockRestore();
    });

    it('does not remove notification if error remains', async () => {
      const user = userEvent.setup();

      // Suppress act warnings from async state updates in TextField
      const originalConsoleError = console.error;
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation((...args) => {
          const message = args[0]?.toString() || '';
          if (message.includes('not wrapped in act(')) {
            return; // Suppress act warnings
          }
          originalConsoleError.apply(console, args);
        });

      render(
        <OutputForm
          {...defaultProps}
          documentType="Code/Software"
          shareOutput={shareOutput}
          getAuthorSuggestions={getAuthorSuggestions}
          getRelatedOutputSuggestions={getRelatedOutputSuggestions}
          workingGroupSuggestions={[{ id: '2', title: 'another group' }]}
        />,
        {
          wrapper: ({ children }) => (
            <NotificationContext.Provider
              value={{
                notifications: [],
                addNotification,
                removeNotification,
              }}
            >
              <MemoryRouter>
                <LocationCapture />
                {children}
              </MemoryRouter>
            </NotificationContext.Provider>
          ),
        },
      );

      await user.click(screen.getByRole('button', { name: 'Publish' }));

      await waitFor(() => {
        expect(
          screen.queryByText('Publish output for the whole hub?'),
        ).not.toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Publish' }));

      await waitFor(() => {
        expect(
          screen.queryByText('Publish output for the whole hub?'),
        ).not.toBeInTheDocument();
        expect(removeNotification).not.toHaveBeenCalled();
      });
      // Wait for any pending state updates to settle
      await waitFor(() => {});

      consoleErrorSpy.mockRestore();
    });

    it('shows error message because of unknown error', async () => {
      const user = userEvent.setup();
      shareOutput.mockRejectedValueOnce(new Error('something went wrong'));
      render(
        <OutputForm
          {...defaultProps}
          shareOutput={shareOutput}
          getAuthorSuggestions={getAuthorSuggestions}
          getRelatedOutputSuggestions={getRelatedOutputSuggestions}
          workingGroupSuggestions={[{ id: '2', title: 'another group' }]}
          {...gp2Fixtures.createOutputResponse()}
          link="https://example.com/output"
          publishDate="2020-03-04"
        />,
        {
          wrapper: ({ children }) => (
            <NotificationContext.Provider
              value={{
                notifications,
                addNotification,
                removeNotification,
              }}
            >
              <MemoryRouter>
                <LocationCapture />
                {children}
              </MemoryRouter>
            </NotificationContext.Provider>
          ),
        },
      );

      await user.click(screen.getByRole('button', { name: /save/i }));
      expect(
        await screen.findByRole('button', { name: /save/i }),
      ).toBeEnabled();

      expect(shareOutput).toHaveBeenCalled();
      await waitFor(async () =>
        expect(addNotification).toHaveBeenCalledWith(
          expect.objectContaining({
            message:
              'There was an error and we were unable to save your changes. Please try again.',
            page: 'output-form',
            type: 'error',
          }),
        ),
      );
    });

    it('changes notification if another error', async () => {
      const user = userEvent.setup();

      // Suppress act warnings from async state updates in TextField
      const originalConsoleError = console.error;
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation((...args) => {
          const message = args[0]?.toString() || '';
          if (message.includes('not wrapped in act(')) {
            return; // Suppress act warnings
          }
          originalConsoleError.apply(console, args);
        });

      shareOutput.mockRejectedValueOnce(new Error('something went wrong'));
      render(
        <OutputForm
          {...defaultProps}
          shareOutput={shareOutput}
          getAuthorSuggestions={getAuthorSuggestions}
          getRelatedOutputSuggestions={getRelatedOutputSuggestions}
          workingGroupSuggestions={[{ id: '2', title: 'another group' }]}
          {...gp2Fixtures.createOutputResponse()}
          link="https://example.com/output"
          publishDate="2020-03-04"
        />,
        {
          wrapper: ({ children }) => (
            <NotificationContext.Provider
              value={{
                notifications,
                addNotification,
                removeNotification,
              }}
            >
              <MemoryRouter>
                <LocationCapture />
                {children}
              </MemoryRouter>
            </NotificationContext.Provider>
          ),
        },
      );

      addNotification.mockImplementationOnce((not: Notification) =>
        notifications.push(not),
      );
      await user.click(screen.getByRole('button', { name: /save/i }));
      expect(
        await screen.findByRole('button', { name: /save/i }),
      ).toBeEnabled();

      await waitFor(() =>
        expect(addNotification).toHaveBeenCalledWith(
          expect.objectContaining({
            message:
              'There was an error and we were unable to save your changes. Please try again.',
            page: 'output-form',
            type: 'error',
          }),
        ),
      );

      await user.clear(screen.getByRole('textbox', { name: /title/i }));

      await waitFor(() => {
        expect(screen.getByRole('textbox', { name: /title/i })).toHaveValue('');
      });

      await user.click(screen.getByRole('button', { name: /save/i }));
      expect(
        await screen.findByRole('button', { name: /save/i }),
      ).toBeEnabled();

      expect(removeNotification).toHaveBeenCalled();

      await waitFor(() =>
        expect(addNotification).toHaveBeenCalledWith(
          expect.objectContaining({
            message:
              'There are some errors in the form. Please correct the fields below.',
            page: 'output-form',
            type: 'error',
          }),
        ),
      );
      // Wait for any pending state updates to settle
      await waitFor(() => {});

      consoleErrorSpy.mockRestore();
    });

    it('displays server side validation error for link and calls clears function when changed', async () => {
      const user = userEvent.setup();
      const mockClearError = jest.fn();

      // Suppress act warnings from async state updates in TextField
      const originalConsoleError = console.error;
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation((...args) => {
          const message = args[0]?.toString() || '';
          if (message.includes('not wrapped in act(')) {
            return; // Suppress act warnings
          }
          originalConsoleError.apply(console, args);
        });

      const { container } = render(
        <OutputForm
          {...defaultProps}
          link="http://example.com"
          serverValidationErrors={[
            {
              instancePath: '/link',
              keyword: '',
              params: {},
              schemaPath: '',
            },
          ]}
          clearServerValidationError={mockClearError}
        />,
        {
          wrapper: ({ children }) => (
            <MemoryRouter>
              <LocationCapture />
              {children}
            </MemoryRouter>
          ),
        },
      );
      expect(
        screen.getByText(
          'An Output with this URL already exists. Please enter a different URL.',
        ),
      ).toBeVisible();

      const linkInput = screen.getByLabelText(/URL/i);
      await user.type(linkInput, 'a');
      await waitFor(() => {
        expect(mockClearError).toHaveBeenCalledWith('/link');
      });
      // Wait for the input value to be updated and component to finish rendering
      await waitFor(() => {
        expect(linkInput).toHaveValue('http://example.coma');
      });
      // Flush any pending timers and state updates
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      consoleErrorSpy.mockRestore();
    });

    it('displays server side validation error for title and calls clears function when changed', async () => {
      const user = userEvent.setup();
      const mockClearError = jest.fn();

      // Suppress act warnings from async state updates in TextField
      const originalConsoleError = console.error;
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation((...args) => {
          const message = args[0]?.toString() || '';
          if (message.includes('not wrapped in act(')) {
            return; // Suppress act warnings
          }
          originalConsoleError.apply(console, args);
        });

      const { container } = render(
        <OutputForm
          {...defaultProps}
          title="Example"
          serverValidationErrors={[
            {
              instancePath: '/title',
              keyword: '',
              params: {},
              schemaPath: '',
            },
          ]}
          clearServerValidationError={mockClearError}
        />,
        {
          wrapper: ({ children }) => (
            <MemoryRouter>
              <LocationCapture />
              {children}
            </MemoryRouter>
          ),
        },
      );
      expect(
        screen.getByText(
          'An Output with this title already exists. Please check if this is repeated and choose a different title.',
        ),
      ).toBeVisible();

      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'a');
      await waitFor(() => {
        expect(mockClearError).toHaveBeenCalledWith('/title');
      });
      // Wait for the input value to be updated and component to finish rendering
      await waitFor(() => {
        expect(titleInput).toHaveValue('Examplea');
      });
      // Flush any pending timers and state updates
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      consoleErrorSpy.mockRestore();
    });
  });
});
