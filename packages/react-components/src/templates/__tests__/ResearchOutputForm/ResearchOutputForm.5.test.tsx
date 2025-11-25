import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';

import { createResearchOutputResponse } from '@asap-hub/fixtures';
import { researchOutputDocumentTypeToType } from '@asap-hub/model';
import { render, screen, waitFor, within } from '@testing-library/react';
import { network } from '@asap-hub/routing';
import { createMemoryHistory, History } from 'history';
import ResearchOutputForm from '../../ResearchOutputForm';
import {
  defaultProps,
  initialResearchOutputData,
} from '../../test-utils/research-output-form';

jest.setTimeout(60000);

describe('on submit', () => {
  let history!: History;
  const id = '42';
  const saveDraftFn = jest.fn();
  const saveFn = jest.fn();
  const getLabSuggestions = jest.fn();
  const getAuthorSuggestions = jest.fn();
  const getRelatedResearchSuggestions = jest.fn();
  const getShortDescriptionFromDescription = jest.fn();

  beforeEach(() => {
    history = createMemoryHistory();
    saveDraftFn.mockResolvedValue({ ...createResearchOutputResponse(), id });
    saveFn.mockResolvedValue({ ...createResearchOutputResponse(), id });
    getLabSuggestions.mockResolvedValue([]);
    getAuthorSuggestions.mockResolvedValue([]);
    getRelatedResearchSuggestions.mockResolvedValue([]);
    getShortDescriptionFromDescription.mockReturnValue('short description');

    // TODO: fix act error
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const submitForm = async () => {
    const button = screen.getByRole('button', { name: /Publish/i });
    await userEvent.click(button);
    await userEvent.click(
      screen.getByRole('button', { name: /Publish Output/i }),
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Publish' })).toBeEnabled();
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeEnabled();
    });
  };

  describe.each`
    fieldName              | selector
    ${'asapFunded'}        | ${/Has this output been funded by ASAP/i}
    ${'usedInPublication'} | ${/Has this output been used in a publication/i}
  `('$fieldName can submit', ({ fieldName, selector }) => {
    it.each`
      value         | expected
      ${'Yes'}      | ${true}
      ${'No'}       | ${false}
      ${'Not Sure'} | ${undefined}
    `('when $value then $expected', async ({ value, expected }) => {
      const documentType = 'Bioinformatics' as const;

      render(
        <Router history={history}>
          <ResearchOutputForm
            {...defaultProps}
            researchOutputData={initialResearchOutputData}
            selectedTeams={[{ value: 'TEAMID', label: 'Example Team' }]}
            documentType={documentType}
            typeOptions={Array.from(
              researchOutputDocumentTypeToType[documentType],
            )}
            onSave={saveFn}
            onSaveDraft={saveDraftFn}
            getLabSuggestions={getLabSuggestions}
            getAuthorSuggestions={getAuthorSuggestions}
            getRelatedResearchSuggestions={getRelatedResearchSuggestions}
            getShortDescriptionFromDescription={
              getShortDescriptionFromDescription
            }
            researchTags={[]}
          />
        </Router>,
      );

      const funded = screen.getByRole('group', {
        name: selector,
      });
      await userEvent.click(within(funded).getByText(value));

      await submitForm();
      expect(saveFn).toHaveBeenLastCalledWith(
        expect.objectContaining({
          [fieldName]: expected,
        }),
      );
    });
  });

  it('should disable "No" and "Not Sure" options', async () => {
    history = createMemoryHistory({
      initialEntries: [
        network({}).teams({}).team({ teamId: 'TEAMID' }).createOutput({
          outputDocumentType: 'article',
        }).$,
      ],
    });

    const documentType = 'Article' as const;

    render(
      <Router history={history}>
        <ResearchOutputForm
          {...defaultProps}
          researchOutputData={{
            ...createResearchOutputResponse(),
            usedInPublication: undefined,
            sharingStatus: 'Network Only',
            documentType: 'Article',
          }}
          selectedTeams={[{ value: 'TEAMID', label: 'Example Team' }]}
          documentType={documentType}
          typeOptions={Array.from(
            researchOutputDocumentTypeToType[documentType],
          )}
          onSave={saveFn}
          onSaveDraft={saveDraftFn}
          getLabSuggestions={getLabSuggestions}
          getAuthorSuggestions={getAuthorSuggestions}
          getRelatedResearchSuggestions={getRelatedResearchSuggestions}
          getShortDescriptionFromDescription={
            getShortDescriptionFromDescription
          }
          researchTags={[]}
        />
      </Router>,
    );

    const usedInPublication = screen.getByRole('group', {
      name: /Has this output been used in a publication/i,
    });

    expect(
      within(usedInPublication).getByRole('radio', { name: 'No' }),
    ).toBeDisabled();
    expect(
      within(usedInPublication).getByRole('radio', { name: 'Not Sure' }),
    ).toBeDisabled();
  });
});
