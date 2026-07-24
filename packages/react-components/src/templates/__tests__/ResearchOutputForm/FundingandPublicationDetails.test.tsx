import {
  ResearchOutputDocumentType,
  ResearchOutputResponse,
} from '@asap-hub/model';
import { resolveResearchOutputAvailableActions } from '@asap-hub/react-context';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  defaultAvailableActions,
  renderForm,
  renderPrefilledForm,
  submitForm,
} from '../../test-utils/research-output-form';
import { mockActErrorsInConsole } from '../../../test-utils';

describe('ResearchOutputForm publishing decisions', () => {
  const saveFn = jest.fn();
  let consoleMock: ReturnType<typeof mockActErrorsInConsole>;

  beforeEach(() => {
    saveFn.mockResolvedValue({ id: '42' } as ResearchOutputResponse);
    consoleMock = mockActErrorsInConsole();
  });

  afterEach(() => {
    consoleMock.mockRestore();
    jest.resetAllMocks();
  });

  // The Yes/No/Not Sure -> true/false/undefined conversion is unit tested on
  // convertDecisionToBoolean. Here we are just checking if the field
  // is being submitted properly on the form
  it.each`
    fieldName              | selector
    ${'asapFunded'}        | ${/Has this output been funded by ASAP/i}
    ${'usedInPublication'} | ${/Has this output been used in a publication/i}
  `(
    'submits $fieldName from its own control',
    async ({ fieldName, selector }) => {
      renderPrefilledForm({ onSave: saveFn });

      const group = screen.getByRole('group', { name: selector });
      await userEvent.click(within(group).getByText('No'));

      await submitForm();

      expect(saveFn).toHaveBeenLastCalledWith(
        expect.objectContaining({ [fieldName]: false }),
      );
    },
  );

  it('disables the "No" and "Not Sure" used-in-publication options when disableUsedInPublication is true', () => {
    renderForm({
      availableActions: {
        ...defaultAvailableActions,
        disableUsedInPublication: true,
      },
    });

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

  it('disables the "CRN Only" sharing status option when disableNonPublicSharingStatus is true', () => {
    renderForm({
      availableActions: {
        ...defaultAvailableActions,
        disableNonPublicSharingStatus: true,
      },
    });

    const sharingStatus = screen.getByRole('group', {
      name: /sharing status/i,
    });

    expect(
      within(sharingStatus).getByRole('radio', { name: /CRN Only/i }),
    ).toBeDisabled();
    expect(
      within(sharingStatus).getByRole('radio', { name: /Public/i }),
    ).toBeEnabled();
  });

  it('enables the "CRN Only" sharing status option when disableNonPublicSharingStatus is false', () => {
    renderForm({
      availableActions: {
        ...defaultAvailableActions,
        disableNonPublicSharingStatus: false,
      },
    });

    const sharingStatus = screen.getByRole('group', {
      name: /sharing status/i,
    });

    expect(
      within(sharingStatus).getByRole('radio', { name: /CRN Only/i }),
    ).toBeEnabled();
  });

  it('disables the "CRN Only" sharing status option when importing from a manuscript', () => {
    const flowId = 'team-create-imported-from-manuscript';
    const documentType = 'Article' as ResearchOutputDocumentType;
    renderForm({
      documentType,
      flowId,
      availableActions: resolveResearchOutputAvailableActions({
        flowId,
        permissions: { canShareResearchOutput: true },
        documentType,
      }),
    });

    const sharingStatus = screen.getByRole('group', {
      name: /sharing status/i,
    });

    expect(
      within(sharingStatus).getByRole('radio', { name: /CRN Only/i }),
    ).toBeDisabled();
    expect(
      within(sharingStatus).getByRole('radio', { name: /Public/i }),
    ).toBeEnabled();
  });

  it('displays the sharing status from the pre-populated research output data', () => {
    renderPrefilledForm();

    const sharingStatus = screen.getByRole('group', {
      name: /sharing status/i,
    });

    expect(
      within(sharingStatus).getByRole('radio', { name: /Public/i }),
    ).toBeChecked();
  });
});
