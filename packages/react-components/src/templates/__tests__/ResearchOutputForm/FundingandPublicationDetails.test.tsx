import { ResearchOutputResponse } from '@asap-hub/model';
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
});
