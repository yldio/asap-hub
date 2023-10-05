import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 } from '@asap-hub/model';
import { NotificationContext } from '@asap-hub/react-context';
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router, StaticRouter } from 'react-router-dom';
import { createIdentifierField } from '../../utils';
import OutputForm, { getPublishDateValidationMessage } from '../OutputForm';

jest.setTimeout(60_000);

describe('OutputForm', () => {
  const defaultProps = {
    shareOutput: jest.fn(),
    documentType: 'Procedural Form' as const,
    entityType: 'workingGroup' as const,
    getRelatedOutputSuggestions: jest.fn(),
    tagSuggestions: [],
    cohortSuggestions: [],
    workingGroupSuggestions: [],
    projectSuggestions: [],
    mainEntityId: '12',
    workingGroups: [{ id: '12', title: 'a WG title' }],
  };
  afterEach(jest.resetAllMocks);
  it('renders all the base fields', () => {
    render(<OutputForm {...defaultProps} documentType="Dataset" />, {
      wrapper: StaticRouter,
    });
    expect(screen.getByRole('textbox', { name: /title/i })).toBeVisible();
    expect(screen.getByRole('textbox', { name: /url/i })).toBeVisible();
    expect(screen.getByRole('textbox', { name: /description/i })).toBeVisible();
    expect(
      screen.getByRole('group', {
        name: /has this output been supported by gp2?/i,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole('group', {
        name: /sharing status?/i,
      }),
    ).toBeVisible();
    expect(screen.getByRole('textbox', { name: /tags/i })).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: /working groups/i }),
    ).toBeVisible();
    expect(screen.getByRole('textbox', { name: /projects/i })).toBeVisible();
    expect(screen.getByRole('textbox', { name: /cohorts/i })).toBeVisible();
    expect(screen.getByRole('textbox', { name: /authors/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /publish/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeVisible();
  });
  it('publish the form', async () => {
    const getAuthorSuggestions = jest.fn();
    const getRelatedOutputSuggestions = jest.fn();
    const history = createMemoryHistory();
    const shareOutput = jest.fn();
    const addNotification = jest.fn();
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
    getRelatedOutputSuggestions.mockResolvedValue([
      {
        value: '11',
        label: 'related output',
        documentType: 'GP2 Reports',
      },
    ]);
    shareOutput.mockResolvedValueOnce(gp2Fixtures.createOutputResponse());
    render(
      <OutputForm
        {...defaultProps}
        documentType="Code/Software"
        shareOutput={shareOutput}
        getAuthorSuggestions={getAuthorSuggestions}
        getRelatedOutputSuggestions={getRelatedOutputSuggestions}
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
            <Router history={history}>{children}</Router>
          </NotificationContext.Provider>
        ),
      },
    );
    userEvent.type(
      screen.getByRole('textbox', { name: /title/i }),
      'output title',
    );
    userEvent.type(
      screen.getByRole('textbox', { name: /url/i }),
      'https://example.com',
    );
    userEvent.type(
      screen.getByRole('textbox', { name: /description/i }),
      'An interesting article',
    );
    const gp2Supported = screen.getByRole('group', {
      name: /has this output been supported by gp2?/i,
    });
    userEvent.click(within(gp2Supported).getByRole('radio', { name: /yes/i }));
    const sharingStatus = screen.getByRole('group', {
      name: /sharing status?/i,
    });
    userEvent.click(
      within(sharingStatus).getByRole('radio', { name: 'GP2 Only' }),
    );
    userEvent.click(screen.getByRole('textbox', { name: /identifier type/i }));
    userEvent.click(screen.getByText(/^none/i));
    const authors = screen.getByRole('textbox', { name: /Authors/i });
    userEvent.click(authors);

    userEvent.click(await screen.findByText(/Chris Reed/i));
    userEvent.click(authors);
    userEvent.click(screen.getByText('Chris Blue'));
    userEvent.click(authors);
    userEvent.type(authors, 'Alex White');

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    userEvent.click(screen.getAllByText('Alex White')[1]!);
    const relatedOutputs = screen.getByRole('textbox', {
      name: /related output/i,
    });
    userEvent.click(relatedOutputs);
    const relatedOutputOption = await screen.findByText(/GP2 Reports/i);
    userEvent.click(relatedOutputOption);
    userEvent.click(screen.getByRole('button', { name: /publish/i }));
    expect(
      await screen.findByRole('button', { name: /publish/i }),
    ).toBeEnabled();

    expect(shareOutput).toHaveBeenCalledWith({
      title: 'output title',
      link: 'https://example.com',
      documentType: 'Code/Software',
      description: 'An interesting article',
      gp2Supported: 'Yes',
      sharingStatus: 'GP2 Only',
      authors: [
        { externalUserId: 'u1' },
        { userId: 'u2' },
        { externalUserName: 'Alex White' },
      ],
      relatedOutputs: [
        {
          id: '11',
          title: 'related output',
          documentType: 'GP2 Reports',
        },
      ],
      mainEntityId: '12',
      workingGroupIds: [],
    });
    expect(addNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Working group code/software published successfully.',
        page: 'outputs',
        type: 'success',
      }),
    );
    expect(history.location.pathname).toEqual(`/outputs`);
  });

  it('publishes the form with projects', () => {
    const shareOutput = jest.fn();

    shareOutput.mockResolvedValueOnce(gp2Fixtures.createOutputResponse());
    render(
      <OutputForm
        {...defaultProps}
        title="output title"
        link="https://example.com"
        description="An interesting article"
        gp2Supported="Yes"
        sharingStatus="GP2 Only"
        documentType="Code/Software"
        shareOutput={shareOutput}
        entityType="project"
        projects={[{ id: '1', title: 'a project' }]}
        workingGroups={undefined}
        tags={[{ id: 'tag-1', name: 'Tag' }]}
        contributingCohorts={[{ id: 'cohort-1', name: 'Cohort' }]}
      />,
      {
        wrapper: StaticRouter,
      },
    );

    userEvent.click(screen.getByRole('button', { name: /publish/i }));

    expect(shareOutput).toHaveBeenCalledWith({
      title: 'output title',
      link: 'https://example.com',
      documentType: 'Code/Software',
      description: 'An interesting article',
      gp2Supported: 'Yes',
      sharingStatus: 'GP2 Only',
      authors: [],
      mainEntityId: '1',
      projectIds: [],
      tags: [{ id: 'tag-1', name: 'Tag' }],
      contributingCohorts: [{ id: 'cohort-1', name: 'Cohort' }],
    });
  });

  it('can submit published date', async () => {
    const getAuthorSuggestions = jest.fn();
    const history = createMemoryHistory();
    const shareOutput = jest.fn();
    const addNotification = jest.fn();
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
    shareOutput.mockResolvedValueOnce(gp2Fixtures.createOutputResponse());
    render(
      <OutputForm
        {...defaultProps}
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
            <Router history={history}>{children}</Router>
          </NotificationContext.Provider>
        ),
      },
    );
    userEvent.type(
      screen.getByRole('textbox', { name: /title/i }),
      'output title',
    );
    userEvent.type(
      screen.getByRole('textbox', { name: /url/i }),
      'https://example.com',
    );
    userEvent.type(
      screen.getByRole('textbox', { name: /description/i }),
      'An interesting article',
    );
    const sharingStatus = screen.getByRole('group', {
      name: /sharing status?/i,
    });
    userEvent.click(
      within(sharingStatus).getByRole('radio', { name: 'Public' }),
    );
    fireEvent.change(
      screen.getByLabelText(/public repository published date/i),
      {
        target: { value: '2022-03-24' },
      },
    );
    const authors = screen.getByRole('textbox', { name: /Authors/i });
    userEvent.click(authors);

    userEvent.click(await screen.findByText(/Chris Reed/i));
    userEvent.click(authors);
    userEvent.click(screen.getByText('Chris Blue'));
    userEvent.click(authors);
    userEvent.type(authors, 'Alex White');
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    userEvent.click(screen.getAllByText('Alex White')[1]!);
    userEvent.click(screen.getByRole('textbox', { name: /identifier type/i }));
    userEvent.click(screen.getByText('None'));
    userEvent.click(screen.getByRole('button', { name: /publish/i }));
    expect(
      await screen.findByRole('button', { name: /publish/i }),
    ).toBeEnabled();

    expect(shareOutput).toHaveBeenCalledWith({
      title: 'output title',
      link: 'https://example.com',
      documentType: 'Procedural Form',
      description: 'An interesting article',
      sharingStatus: 'Public',
      publishDate: new Date('2022-03-24').toISOString(),
      authors: [
        { externalUserId: 'u1' },
        { userId: 'u2' },
        { externalUserName: 'Alex White' },
      ],
      relatedOutputs: [],
      mainEntityId: '12',
      workingGroupIds: [],
    });
  });

  describe('article', () => {
    it('renders type', () => {
      render(<OutputForm {...defaultProps} documentType="Article" />, {
        wrapper: StaticRouter,
      });
      expect(screen.getByRole('textbox', { name: /^type/i })).toBeVisible();
    });
    it.each<gp2.OutputType>(['Blog', 'Hot Topic', 'Letter', 'Review'])(
      '%d does not render subtype',
      (type) => {
        render(<OutputForm {...defaultProps} documentType="Article" />, {
          wrapper: StaticRouter,
        });
        userEvent.click(screen.getByRole('textbox', { name: /^type/i }));
        userEvent.click(screen.getByText(type));
        expect(
          screen.queryByRole('textbox', { name: /subtype/i }),
        ).not.toBeInTheDocument();
      },
    );
    it.each<gp2.OutputType>(['Research'])('%d renders subtype', (type) => {
      render(<OutputForm {...defaultProps} documentType="Article" />, {
        wrapper: StaticRouter,
      });
      userEvent.click(screen.getByRole('textbox', { name: /^type/i }));
      userEvent.click(screen.getByText(type));
      expect(screen.getByRole('textbox', { name: /subtype/i })).toBeVisible();
    });
    it('publishes with type and subtype', async () => {
      const history = createMemoryHistory();
      const getAuthorSuggestions = jest.fn();
      getAuthorSuggestions.mockResolvedValueOnce([
        {
          author: {
            ...gp2Fixtures.createUserResponse(),
            displayName: 'Chris Blue',
          },
          label: 'Chris Blue',
          value: 'u2',
        },
      ]);
      const shareOutput = jest.fn();
      shareOutput.mockResolvedValueOnce(gp2Fixtures.createOutputResponse());
      render(
        <OutputForm
          {...defaultProps}
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
              <Router history={history}>{children}</Router>
            </NotificationContext.Provider>
          ),
        },
      );

      userEvent.type(
        screen.getByRole('textbox', { name: /title/i }),
        'output title',
      );
      userEvent.type(
        screen.getByRole('textbox', { name: /url/i }),
        'https://example.com',
      );
      userEvent.type(
        screen.getByRole('textbox', { name: /description/i }),
        'Research description',
      );
      userEvent.click(screen.getByRole('textbox', { name: /^type/i }));
      userEvent.click(screen.getByText('Research'));
      userEvent.click(screen.getByRole('textbox', { name: /subtype/i }));
      userEvent.click(screen.getByText('Published'));
      const authors = screen.getByRole('textbox', { name: /Authors/i });
      userEvent.click(authors);
      await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
      userEvent.click(screen.getByText('Chris Blue'));
      userEvent.click(
        screen.getByRole('textbox', { name: /identifier type/i }),
      );
      userEvent.click(screen.getByText('None'));

      userEvent.click(screen.getByRole('button', { name: /publish/i }));
      expect(
        await screen.findByRole('button', { name: /publish/i }),
      ).toBeEnabled();

      expect(shareOutput).toHaveBeenCalledWith({
        title: 'output title',
        link: 'https://example.com',
        documentType: 'Article',
        type: 'Research',
        subtype: 'Published',
        description: 'Research description',
        gp2Supported: "Don't Know",
        sharingStatus: 'GP2 Only',
        authors: [{ userId: 'u2' }],
        relatedOutputs: [],
        mainEntityId: '12',
        workingGroupIds: [],
      });
      expect(history.location.pathname).toEqual(`/outputs`);
    });
  });

  describe('GP2 Supported', () => {
    test.each`
      documentType
      ${'Procedural Form'}
      ${'Training Materials'}
    `(
      'is not displayed when document type is $documentType',
      ({ documentType }) => {
        render(<OutputForm {...defaultProps} documentType={documentType} />, {
          wrapper: StaticRouter,
        });

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
        render(<OutputForm {...defaultProps} documentType={documentType} />, {
          wrapper: StaticRouter,
        });

        const gp2Supported = screen.getByRole('group', {
          name: /has this output been supported by gp2?/i,
        });
        expect(
          within(gp2Supported).getByRole('radio', { name: gp2SupportedValue }),
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
        render(
          <OutputForm {...defaultProps} documentType="Article" type={type} />,
          {
            wrapper: StaticRouter,
          },
        );

        const gp2Supported = screen.getByRole('group', {
          name: /has this output been supported by gp2?/i,
        });
        expect(
          within(gp2Supported).getByRole('radio', { name: gp2SupportedValue }),
        ).toBeChecked();
      },
    );

    test("is set to 'Yes' and make the gp2 supported disabled when type Blog is selected", () => {
      render(<OutputForm {...defaultProps} documentType="Article" />, {
        wrapper: StaticRouter,
      });

      const gp2Supported = screen.getByRole('group', {
        name: /has this output been supported by gp2?/i,
      });
      expect(
        within(gp2Supported).getByRole('radio', { name: "Don't Know" }),
      ).toBeChecked();

      const input = screen.getByRole('textbox', { name: /^type/i });
      userEvent.click(input);
      userEvent.click(screen.getByText('Blog'));
      fireEvent.focusOut(input);

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
        render(<OutputForm {...defaultProps} documentType={documentType} />, {
          wrapper: StaticRouter,
        });

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
      render(<OutputForm {...defaultProps} documentType={type} />, {
        wrapper: StaticRouter,
      });

      expect(
        screen.queryByRole('textbox', { name: /identifier type/i }),
      ).not.toBeInTheDocument();
    },
  );

  describe('validation', () => {
    it('shows error message for missing value title', () => {
      render(<OutputForm {...defaultProps} documentType="Article" />, {
        wrapper: StaticRouter,
      });

      const input = screen.getByLabelText(/title/i);
      fireEvent.focusOut(input);
      expect(screen.getByText('Please fill out this field.')).toBeVisible();
    });

    it('shows the custom error message for a date in the future', async () => {
      render(<OutputForm {...defaultProps} />, { wrapper: StaticRouter });

      const sharingStatus = screen.getByRole('group', {
        name: /sharing status?/i,
      });
      userEvent.click(
        within(sharingStatus).getByRole('radio', { name: 'Public' }),
      );

      const input = screen.getByLabelText(/public repository published date/i);
      fireEvent.change(input, {
        target: { value: '2050-12-12' },
      });
      fireEvent.focusOut(input);

      expect(
        screen.getByText(/publish date cannot be greater than today/i),
      ).toBeVisible();
    });
  });
  describe('edit output', () => {
    it('renders all the base fields', () => {
      const publishDate = '2020-03-04';
      const title = 'Output Title';
      const link = 'https://example.com/output';
      const { authors } = gp2Fixtures.createOutputResponse();
      authors[0]!.displayName = 'Tony Stark';
      const output = {
        ...defaultProps,
        ...gp2Fixtures.createOutputResponse(),
        publishDate,
        title,
        link,
        authors,
      };
      render(<OutputForm {...output} />, { wrapper: StaticRouter });

      const sharingStatus = screen.getByRole('group', {
        name: /sharing status?/i,
      });
      userEvent.click(
        within(sharingStatus).getByRole('radio', { name: 'Public' }),
      );

      expect(
        screen.getByRole('textbox', { name: /title/i }),
      ).toHaveDisplayValue(title);
      expect(screen.getByRole('textbox', { name: /url/i })).toHaveDisplayValue(
        link,
      );
      expect(
        screen.getByLabelText(/public repository published date/i),
      ).toHaveDisplayValue('2020-03-04');
      expect(screen.getByRole('textbox', { name: /authors/i })).toBeVisible();
      expect(screen.getByText('Tony Stark')).toBeVisible();
      expect(screen.getByRole('textbox', { name: /tags/i })).toBeVisible();
      expect(
        screen.getByRole('textbox', { name: /identifier type/i }),
      ).toBeVisible();
      expect(screen.getByText('None')).toBeVisible();
      expect(screen.getByRole('button', { name: /save/i })).toBeVisible();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeVisible();
    });
  });

  describe('getPublishDateValidationMessage returns', () => {
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

    it('a message when the date is in the future', () => {
      expect(
        getPublishDateValidationMessage({ ...e, rangeOverflow: true }),
      ).toEqual('Publish date cannot be greater than today');
    });

    it('a message when the date is invalid', () => {
      expect(getPublishDateValidationMessage({ ...e, badInput: true })).toEqual(
        'Date published should be complete or removed',
      );
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

  describe('tags', () => {
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
      render(
        <OutputForm
          {...defaultProps}
          tagSuggestions={suggestions}
          tags={tags}
        />,
        {
          wrapper: StaticRouter,
        },
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
    it('displays tags suggestions', () => {
      renderWithSuggestions();
      userEvent.click(screen.getByLabelText(/additional tags/i));
      expect(screen.getByText('2D Cultures')).toBeVisible();
      expect(screen.getByText('Adenosine')).toBeVisible();
      expect(screen.getByText('Adrenal')).toBeVisible();
    });

    it('displays existing tags', () => {
      renderWithSuggestions();
      expect(screen.getByText('Neurology')).toBeVisible();
    });
    it('update tags after adding one', () => {
      renderWithSuggestions();
      userEvent.click(screen.getByLabelText(/additional tags/i));
      userEvent.click(screen.getByText('2D Cultures'));
      expect(screen.getByText('Neurology')).toBeVisible();
      expect(screen.getByText('2D Cultures')).toBeVisible();
    });
  });

  describe('cohorts', () => {
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
      render(
        <OutputForm
          {...defaultProps}
          cohortSuggestions={suggestions}
          contributingCohorts={cohorts}
        />,
        {
          wrapper: StaticRouter,
        },
      );

    it('displays cohorts empty', () => {
      renderWithSuggestions(defaultCohortSuggestions, []);
      const textbox = screen.getByRole('textbox', {
        name: /cohorts/i,
      });
      expect(textbox).toBeVisible();
      expect(textbox).toHaveValue('');
    });
    it('displays cohorts suggestions', () => {
      renderWithSuggestions();
      userEvent.click(screen.getByLabelText(/cohorts/i));
      expect(screen.getByText('2D Cultures')).toBeVisible();
      expect(screen.getByText('Adenosine')).toBeVisible();
      expect(screen.getByText('Adrenal')).toBeVisible();
    });

    it('displays existing cohorts', () => {
      renderWithSuggestions();
      expect(screen.getByText('Neurology')).toBeVisible();
    });
    it('update cohorts after adding one', () => {
      renderWithSuggestions();
      userEvent.click(screen.getByLabelText(/cohorts/i));
      userEvent.click(screen.getByText('2D Cultures'));
      expect(screen.getByText('Neurology')).toBeVisible();
      expect(screen.getByText('2D Cultures')).toBeVisible();
    });
  });

  describe('working Groups', () => {
    const defaultWorkingGroupsSuggestions = [{ id: '1', title: 'WG 1' }];

    const defaultWorkingGroups = [{ id: '5', title: 'A WG title' }];
    const renderWithSuggestions = (
      suggestions = defaultWorkingGroupsSuggestions,
      workingGroups = defaultWorkingGroups,
    ) =>
      render(
        <OutputForm
          {...defaultProps}
          workingGroupSuggestions={suggestions}
          workingGroups={workingGroups}
        />,
        {
          wrapper: StaticRouter,
        },
      );

    it('displays working groups empty', () => {
      renderWithSuggestions(defaultWorkingGroupsSuggestions, []);
      const textbox = screen.getByRole('textbox', {
        name: /working groups/i,
      });
      expect(textbox).toBeVisible();
      expect(textbox).toHaveValue('');
    });
    it('displays working groups suggestions', () => {
      renderWithSuggestions();
      userEvent.click(screen.getByLabelText(/working groups/i));
      expect(screen.getByText('WG 1')).toBeVisible();
    });

    it('displays existing working groups', () => {
      renderWithSuggestions();
      expect(screen.getByText('A WG title')).toBeVisible();
    });
    it('update working groups after adding one', () => {
      renderWithSuggestions();
      userEvent.click(screen.getByLabelText(/working groups/i));
      userEvent.click(screen.getByText('WG 1'));
      expect(screen.getByText('A WG title')).toBeVisible();
      expect(screen.getByText('WG 1')).toBeVisible();
    });

    it('shows the custom no options message for working groups', async () => {
      renderWithSuggestions();

      userEvent.type(
        screen.getByLabelText(/working groups/i),
        'asdflkjasdflkj',
      );

      expect(
        screen.getByText('Sorry, no working groups match asdflkjasdflkj'),
      ).toBeVisible();
    });
  });

  describe('projects', () => {
    const defaultProjectsSuggestions = [{ id: '1', title: 'Project 1' }];

    const defaultProjects = [{ id: '5', title: 'A Project title' }];
    const renderWithSuggestions = (
      suggestions = defaultProjectsSuggestions,
      projects = defaultProjects,
    ) =>
      render(
        <OutputForm
          {...defaultProps}
          entityType="project"
          projectSuggestions={suggestions}
          projects={projects}
        />,
        {
          wrapper: StaticRouter,
        },
      );

    it('displays projects empty', () => {
      renderWithSuggestions(defaultProjectsSuggestions, []);
      const textbox = screen.getByRole('textbox', {
        name: /projects/i,
      });
      expect(textbox).toBeVisible();
      expect(textbox).toHaveValue('');
    });
    it('displays projects suggestions', () => {
      renderWithSuggestions();
      userEvent.click(screen.getByLabelText(/projects/i));
      expect(screen.getByText('Project 1')).toBeVisible();
    });

    it('displays existing projects', () => {
      renderWithSuggestions();
      expect(screen.getByText('A Project title')).toBeVisible();
    });
    it('update projects after adding one', () => {
      renderWithSuggestions();
      userEvent.click(screen.getByLabelText(/projects/i));
      userEvent.click(screen.getByText('Project 1'));
      expect(screen.getByText('A Project title')).toBeVisible();
      expect(screen.getByText('Project 1')).toBeVisible();
    });

    it('shows the custom no options message for projects', async () => {
      renderWithSuggestions();

      userEvent.type(screen.getByLabelText(/projects/i), 'asdflkjasdflkj');

      expect(
        screen.getByText('Sorry, no projects match asdflkjasdflkj'),
      ).toBeVisible();
    });
  });

  describe('identifierType', () => {
    it('returns DOI when doi is present', () => {
      render(<OutputForm {...defaultProps} doi="123" />, {
        wrapper: StaticRouter,
      });

      expect(screen.getByDisplayValue(/doi/i)).toBeTruthy();
    });
    it('returns RRID when rrid is present', () => {
      render(<OutputForm {...defaultProps} rrid="123" />, {
        wrapper: StaticRouter,
      });
      expect(screen.getByDisplayValue(/rrid/i)).toBeTruthy();
    });
    it('returns Accession Number when accession is present', () => {
      render(<OutputForm {...defaultProps} accessionNumber="123" />, {
        wrapper: StaticRouter,
      });
      expect(screen.getByDisplayValue(/accession number/i)).toBeTruthy();
    });
    it('returns empty for create mode', () => {
      render(<OutputForm {...defaultProps} />, {
        wrapper: StaticRouter,
      });

      expect(screen.getByText(/choose an identifier.../i)).toBeVisible();
    });
    it('return none for edit mode', () => {
      render(<OutputForm {...defaultProps} title="Output Title" />, {
        wrapper: StaticRouter,
      });
      expect(screen.getByDisplayValue(/none/i)).toBeTruthy();
    });
  });
});
