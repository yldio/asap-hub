import { ResearchOutputResponse } from '@asap-hub/model';
import { screen } from '@testing-library/react';

import {
  initialResearchOutputData,
  renderPrefilledForm,
  submitForm,
} from '../../test-utils/research-output-form';
import { mockActErrorsInConsole } from '../../../test-utils';

describe('ResearchOutputForm type field', () => {
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

  // A CRN Report has no selectable types, so the type field is never rendered
  // and its form value stays untouched. The payload must send `undefined`, not
  // an empty string, so the backend does not persist a blank type.
  it('submits type as undefined for a Report with no type options', async () => {
    renderPrefilledForm({
      onSave: saveFn,
      documentType: 'Report',
      typeOptions: [],
      researchOutputData: {
        ...initialResearchOutputData,
        documentType: 'Report',
        type: undefined,
        subtype: undefined,
      },
    });

    expect(
      screen.queryByRole('combobox', { name: /Select the type/i }),
    ).not.toBeInTheDocument();

    await submitForm();

    expect(saveFn).toHaveBeenCalledTimes(1);
    expect(saveFn.mock.calls[0][0].type).toBeUndefined();
  });
});
