import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { Router } from 'react-router-dom';
import { InnerToastContext } from '@asap-hub/react-context';

import { createResearchOutputResponse } from '@asap-hub/fixtures';
import {
  researchOutputDocumentTypeToType,
  ResearchOutputResponse,
  ResearchTagResponse,
} from '@asap-hub/model';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory, History } from 'history';
import ResearchOutputForm from '../ResearchOutputForm';
import { fern, paper } from '../../colors';

const defaultProps: ComponentProps<typeof ResearchOutputForm> = {
  onSave: jest.fn(() => Promise.resolve()),
  onSaveDraft: jest.fn(() => Promise.resolve()),
  published: false,
  tagSuggestions: [],
  researchTags: [],
  documentType: 'Article',
  selectedTeams: [],
  typeOptions: Array.from(researchOutputDocumentTypeToType.Article.values()),
  permissions: {
    canEditResearchOutput: true,
    canPublishResearchOutput: true,
    canShareResearchOutput: true,
  },
  getRelatedResearchSuggestions: jest.fn(),
  getRelatedEventSuggestions: jest.fn(),
  getShortDescriptionFromDescription: jest.fn(),
};

jest.setTimeout(60000);

describe('form buttons', () => {
  let history!: History;
  const id = '42';
  const saveFn = jest.fn();
  const getLabSuggestions = jest.fn();
  const getAuthorSuggestions = jest.fn();

  beforeEach(() => {
    history = createMemoryHistory();
    saveFn.mockResolvedValue({ id } as ResearchOutputResponse);
    getLabSuggestions.mockResolvedValue([]);
    getAuthorSuggestions.mockResolvedValue([]);

    // TODO: fix act error
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
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
    } = {
      documentType: 'Article',
      researchTags: [],
    },
  ) => {
    render(
      <InnerToastContext.Provider value={jest.fn()}>
        <Router history={history}>
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
            permissions={{
              canEditResearchOutput,
              canPublishResearchOutput,
              canShareResearchOutput: true,
            }}
          />
        </Router>
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
      userEvent.click(screen.getByRole('button', { name: /Save Draft/i }));
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
      userEvent.click(screen.getByRole('button', { name: /Publish/i }));
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
      userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(screen.getByText(/Keep the same description/i)).toBeVisible();
      userEvent.click(screen.getAllByRole('button', { name: /Cancel/i })[0]!);
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
      userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(screen.getByText(/Keep the same description/i)).toBeVisible();
      userEvent.click(
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
      userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(screen.getByText(/Keep the same description/i)).toBeVisible();
      userEvent.click(
        screen.getByRole('button', { name: /Keep and publish/i }),
      );
      await waitFor(() => {
        expect(screen.queryByText(/Keep the same description/i)).toBeNull();
        expect(screen.getByText(/Please enter a valid URL/i)).toBeVisible();
      });
      userEvent.click(screen.getByRole('button', { name: /Publish/i }));
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
      userEvent.click(screen.getByRole('button', { name: /Publish/i }));
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
      userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(
        screen.getByText(/Publish new version for the whole hub?/i),
      ).toBeVisible();
      userEvent.click(screen.getAllByRole('button', { name: /Cancel/i })[0]!);
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
      userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(
        screen.getByText(/Publish new version for the whole hub?/i),
      ).toBeVisible();
      userEvent.click(
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
      userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(
        screen.getByText(/Publish new version for the whole hub?/i),
      ).toBeVisible();
      userEvent.click(
        screen.getByRole('button', { name: /Publish new version/i }),
      );
      await waitFor(() => {
        expect(
          screen.queryByText(/Publish new version for the whole hub?/i),
        ).toBeNull();
        expect(screen.getByText(/Please enter a valid URL/i)).toBeVisible();
      });
      userEvent.click(screen.getByRole('button', { name: /Publish/i }));
      expect(
        screen.queryByText(/Publish new version for the whole hub?/i),
      ).toBeNull();
    });
  });
});
