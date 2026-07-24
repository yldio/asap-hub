import { ResearchOutputResponse } from '@asap-hub/model';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

import ResearchOutputForm from '../../ResearchOutputForm';
import {
  getDefaultProps,
  initialResearchOutputData,
  renderPrefilledForm,
  submitForm,
} from '../../test-utils/research-output-form';
import { mockActErrorsInConsole } from '../../../test-utils';

describe('date made public field', () => {
  let researchOutputFormProps: ReturnType<typeof getDefaultProps>;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation();
    researchOutputFormProps = getDefaultProps();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should disable the date made public field when available action disableDateMadePublic is true', () => {
    const { rerender } = render(
      <MemoryRouter>
        <ResearchOutputForm
          {...researchOutputFormProps}
          researchOutputData={initialResearchOutputData}
          availableActions={{
            ...researchOutputFormProps.availableActions,
            disableDateMadePublic: true,
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText(/date made public/i)).toBeDisabled();

    rerender(
      <MemoryRouter>
        <ResearchOutputForm
          {...researchOutputFormProps}
          researchOutputData={initialResearchOutputData}
          availableActions={{
            ...researchOutputFormProps.availableActions,
            disableDateMadePublic: false,
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText(/date made public/i)).toBeEnabled();
  });
});

describe('submitting the date made public', () => {
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

  it('can submit published date', async () => {
    renderPrefilledForm({ onSave: saveFn });

    const sharingStatus = screen.getByRole('group', {
      name: /sharing status/i,
    });
    await userEvent.click(
      within(sharingStatus).getByRole('radio', { name: 'Public' }),
    );
    fireEvent.change(screen.getByLabelText(/date made public/i), {
      target: { value: '2022-03-24' },
    });

    await submitForm();

    expect(saveFn).toHaveBeenLastCalledWith(
      expect.objectContaining({
        sharingStatus: 'Public',
        publishDate: new Date('2022-03-24').toISOString(),
      }),
    );
  });
});
