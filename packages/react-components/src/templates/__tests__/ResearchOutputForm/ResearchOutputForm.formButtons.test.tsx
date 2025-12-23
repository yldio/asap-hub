import userEvent from '@testing-library/user-event';
import { ComponentProps, useEffect } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { InnerToastContext } from '@asap-hub/react-context';

import { createResearchOutputResponse } from '@asap-hub/fixtures';
import {
  researchOutputDocumentTypeToType,
  ResearchOutputResponse,
  ResearchTagResponse,
} from '@asap-hub/model';
import { render, screen, waitFor } from '@testing-library/react';
import ResearchOutputForm from '../../ResearchOutputForm';
import { fern, paper } from '../../../colors';
import { defaultProps } from '../../test-utils/research-output-form';
import { mockActErrorsInConsole } from '../../../test-utils';

jest.setTimeout(60000);

let currentLocation: { pathname: string; search: string } | null = null;
const LocationCapture = () => {
  const location = useLocation();
  useEffect(() => {
    currentLocation = { pathname: location.pathname, search: location.search };
  }, [location]);
  return null;
};

let consoleMock: ReturnType<typeof mockActErrorsInConsole>;

describe('form buttons', () => {
  const id = '42';
  const saveFn = jest.fn();
  const getLabSuggestions = jest.fn();
  const getAuthorSuggestions = jest.fn();

  beforeEach(() => {
    currentLocation = null;
    saveFn.mockResolvedValue({ id } as ResearchOutputResponse);
    getLabSuggestions.mockResolvedValue([]);
    getAuthorSuggestions.mockResolvedValue([]);

    consoleMock = mockActErrorsInConsole();
  });

  afterEach(() => {
    consoleMock.mockRestore();
    jest.resetAllMocks();
  });

  const setupForm = async (
    {
      canEditResearchOutput = false,
      canPublishResearchOutput = false,
      published = false,
      documentType = 'Article',
      researchTags = [{ id: '1', name: 'research tag 1' }],
      descriptionUnchangedWarning = false,
      researchOutputData = undefined,
      versionAction = undefined,
      isImportedFromManuscript = false,
    }: {
      canEditResearchOutput?: boolean;
      canPublishResearchOutput?: boolean;

      published?: boolean;
      documentType?: ComponentProps<typeof ResearchOutputForm>['documentType'];
      versionAction?: ComponentProps<
        typeof ResearchOutputForm
      >['versionAction'];
      researchTags?: ResearchTagResponse[];
      descriptionUnchangedWarning?: ComponentProps<
        typeof ResearchOutputForm
      >['descriptionUnchangedWarning'];
      researchOutputData?: ComponentProps<
        typeof ResearchOutputForm
      >['researchOutputData'];
      isImportedFromManuscript?: ComponentProps<
        typeof ResearchOutputForm
      >['isImportedFromManuscript'];
    } = {
      documentType: 'Article',
      researchTags: [],
    },
  ) => {
    render(
      <InnerToastContext.Provider value={jest.fn()}>
        <MemoryRouter>
          <LocationCapture />
          <ResearchOutputForm
            {...defaultProps}
            versionAction={versionAction}
            researchOutputData={researchOutputData}
            descriptionUnchangedWarning={descriptionUnchangedWarning}
            selectedTeams={[{ value: 'TEAMID', label: 'Example Team' }]}
            documentType={documentType}
            typeOptions={Array.from(
              researchOutputDocumentTypeToType[documentType],
            )}
            onSave={saveFn}
            getLabSuggestions={getLabSuggestions}
            getAuthorSuggestions={getAuthorSuggestions}
            researchTags={researchTags}
            published={published}
            isImportedFromManuscript={isImportedFromManuscript}
            permissions={{
              canEditResearchOutput,
              canPublishResearchOutput,
              canShareResearchOutput: true,
            }}
          />
        </MemoryRouter>
      </InnerToastContext.Provider>,
    );
  };

  const primaryButtonBg = fern.rgb;
  const notPrimaryButtonBg = paper.rgb;

  it('shows Cancel, Save Draft and Publish buttons when user has editing and publishing permissions and the research output has not been published yet', async () => {
    await setupForm({
      canEditResearchOutput: true,
      canPublishResearchOutput: true,
      published: false,
    });

    const publishButton = screen.getByRole('button', {
      name: /Publish/i,
    });
    expect(publishButton).toBeInTheDocument();
    expect(publishButton).toHaveStyle(`background-color:${primaryButtonBg}`);

    const saveDraftButton = screen.getByRole('button', { name: /Save Draft/i });
    expect(saveDraftButton).toBeInTheDocument();
    expect(saveDraftButton).toHaveStyle(
      `background-color:${notPrimaryButtonBg}`,
    );

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveStyle(`background-color:${notPrimaryButtonBg}`);
  });

  it('shows only Cancel and Save buttons when user has editing and publishing permission and the research output has already been published', async () => {
    await setupForm({
      canEditResearchOutput: true,
      canPublishResearchOutput: true,
      published: true,
    });

    expect(
      screen.queryByRole('button', { name: /Publish/i }),
    ).not.toBeInTheDocument();

    const saveDraftButton = screen.getByRole('button', { name: /Save/i });
    expect(saveDraftButton).toBeInTheDocument();
    expect(saveDraftButton).toHaveStyle(`background-color:${primaryButtonBg}`);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveStyle(`background-color:${notPrimaryButtonBg}`);
  });

  it('shows only Cancel and Save buttons when research output is manuscript output and the research output has already been published', async () => {
    await setupForm({
      isImportedFromManuscript: true,
      canPublishResearchOutput: true,
      published: true,
    });

    expect(
      screen.queryByRole('button', { name: /Publish/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Save Draft/i }),
    ).not.toBeInTheDocument();

    const saveButton = screen.getByRole('button', { name: /Save/i });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveStyle(`background-color:${primaryButtonBg}`);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveStyle(`background-color:${notPrimaryButtonBg}`);
  });

  it('shows only Cancel and Publish buttons when research output is manuscript output and the research output has not been published', async () => {
    await setupForm({
      isImportedFromManuscript: true,
      canPublishResearchOutput: true,
      published: false,
    });

    expect(
      screen.queryByRole('button', { name: /Save/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Save Draft/i }),
    ).not.toBeInTheDocument();

    const saveButton = screen.getByRole('button', { name: /Publish/i });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveStyle(`background-color:${primaryButtonBg}`);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveStyle(`background-color:${notPrimaryButtonBg}`);
  });

  it('shows only Cancel and Save Draft buttons when user has editing permission and the research output has not been published yet', async () => {
    await setupForm({
      canEditResearchOutput: true,
      canPublishResearchOutput: false,
      published: false,
    });

    expect(
      screen.queryByRole('button', { name: /Publish/i }),
    ).not.toBeInTheDocument();

    const saveDraftButton = screen.getByRole('button', { name: /Save Draft/i });
    expect(saveDraftButton).toBeInTheDocument();
    expect(saveDraftButton).toHaveStyle(`background-color:${primaryButtonBg}`);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveStyle(`background-color:${notPrimaryButtonBg}`);
  });
  describe('descriptionUnchangedWarning', () => {
    it('Shows correct button for draft save warning', async () => {
      await setupForm({
        descriptionUnchangedWarning: true,
        canEditResearchOutput: true,
        canPublishResearchOutput: true,
        published: false,
        researchOutputData: createResearchOutputResponse(),
      });
      await userEvent.click(
        screen.getByRole('button', { name: /Save Draft/i }),
      );
      expect(screen.getByText(/Keep the same description/i)).toBeVisible();
      expect(screen.getByText(/Keep and save/i)).toBeVisible();
    });
    it('Shows correct button for publish save warning', async () => {
      await setupForm({
        descriptionUnchangedWarning: true,
        canEditResearchOutput: true,
        canPublishResearchOutput: true,
        researchOutputData: createResearchOutputResponse(),
        published: false,
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(screen.getByText(/Keep the same description/i)).toBeVisible();
      expect(screen.getByText(/Keep and publish/i)).toBeVisible();
    });
    it('is cancelable', async () => {
      await setupForm({
        descriptionUnchangedWarning: true,
        canEditResearchOutput: true,
        canPublishResearchOutput: true,
        researchOutputData: createResearchOutputResponse(),
        published: false,
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(screen.getByText(/Keep the same description/i)).toBeVisible();
      await userEvent.click(
        screen.getAllByRole('button', { name: /Cancel/i })[0]!,
      );
      expect(screen.queryByText(/Keep the same description/i)).toBeNull();
    });

    it('Will be dismissed if there are errors on the form', async () => {
      await setupForm({
        descriptionUnchangedWarning: true,
        canEditResearchOutput: true,
        canPublishResearchOutput: true,

        researchOutputData: {
          ...createResearchOutputResponse(),
          link: '',
        },
        published: false,
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(screen.getByText(/Keep the same description/i)).toBeVisible();
      await userEvent.click(
        screen.getByRole('button', { name: /Keep and publish/i }),
      );
      await waitFor(() => {
        expect(screen.queryByText(/Keep the same description/i)).toBeNull();
        expect(screen.getByText(/Please enter a valid URL/i)).toBeVisible();
      });
    });
    it('Will not reappear once dismissed', async () => {
      await setupForm({
        descriptionUnchangedWarning: true,
        canEditResearchOutput: true,
        canPublishResearchOutput: true,

        researchOutputData: {
          ...createResearchOutputResponse(),
          link: '',
        },
        published: false,
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(screen.getByText(/Keep the same description/i)).toBeVisible();
      await userEvent.click(
        screen.getByRole('button', { name: /Keep and publish/i }),
      );
      await waitFor(() => {
        expect(screen.queryByText(/Keep the same description/i)).toBeNull();
        expect(screen.getByText(/Please enter a valid URL/i)).toBeVisible();
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(screen.queryByText(/Keep the same description/i)).toBeNull();
    });
  });

  describe('Create Version Warning', () => {
    it('Shows warning', async () => {
      await setupForm({
        versionAction: 'create',
        canEditResearchOutput: true,
        canPublishResearchOutput: true,
        researchOutputData: createResearchOutputResponse(),
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(
        screen.getByText(/Publish new version for the whole hub?/i),
      ).toBeVisible();
      expect(
        screen.getByRole('button', { name: /Publish new version/i }),
      ).toBeVisible();
    });

    it('is cancelable', async () => {
      await setupForm({
        versionAction: 'create',
        canEditResearchOutput: true,
        canPublishResearchOutput: true,
        researchOutputData: createResearchOutputResponse(),
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(
        screen.getByText(/Publish new version for the whole hub?/i),
      ).toBeVisible();
      await userEvent.click(
        screen.getAllByRole('button', { name: /Cancel/i })[0]!,
      );
      expect(
        screen.queryByText(/Publish new version for the whole hub?/i),
      ).toBeNull();
    });

    it('Will be dismissed if there are errors on the form', async () => {
      await setupForm({
        versionAction: 'create',
        canEditResearchOutput: true,
        canPublishResearchOutput: true,
        researchOutputData: {
          ...createResearchOutputResponse(),
          link: '',
        },
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(
        screen.getByText(/Publish new version for the whole hub?/i),
      ).toBeVisible();
      await userEvent.click(
        screen.getByRole('button', { name: /Publish new version/i }),
      );
      await waitFor(() => {
        expect(
          screen.queryByText(/Publish new version for the whole hub?/i),
        ).toBeNull();
        expect(screen.getByText(/Please enter a valid URL/i)).toBeVisible();
      });
    });
    it('Will not reappear once dismissed', async () => {
      await setupForm({
        versionAction: 'create',
        canEditResearchOutput: true,
        canPublishResearchOutput: true,

        researchOutputData: {
          ...createResearchOutputResponse(),
          link: '',
        },
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(
        screen.getByText(/Publish new version for the whole hub?/i),
      ).toBeVisible();
      await userEvent.click(
        screen.getByRole('button', { name: /Publish new version/i }),
      );
      await waitFor(() => {
        expect(
          screen.queryByText(/Publish new version for the whole hub?/i),
        ).toBeNull();
        expect(screen.getByText(/Please enter a valid URL/i)).toBeVisible();
      });
      await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(
        screen.queryByText(/Publish new version for the whole hub?/i),
      ).toBeNull();
    });
  });

  it('disables CRN Only option when importing from manuscript', async () => {
    await setupForm({
      isImportedFromManuscript: true,
    });

    expect(screen.getByRole('radio', { name: /CRN Only/i })).toBeDisabled();
    expect(screen.getByRole('radio', { name: /Public/i })).toBeEnabled();
  });

  it('pre-selects DOI on identifier type when importing from manuscript', async () => {
    await setupForm({ isImportedFromManuscript: true });

    const identifierType = await screen.findByDisplayValue('DOI');
    expect(identifierType).toHaveValue('DOI');
  });

  it('shows placeholder text when not importing from manuscript', async () => {
    await setupForm({ isImportedFromManuscript: false });

    expect(await screen.findByText('Choose an identifier')).toBeInTheDocument();
  });
});
