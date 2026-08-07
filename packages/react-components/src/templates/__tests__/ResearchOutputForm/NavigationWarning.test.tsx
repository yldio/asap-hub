import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ENTER_KEYCODE } from '../../../atoms/Dropdown';
import {
  initialResearchOutputData,
  renderPrefilledForm,
} from '../../test-utils/research-output-form';

describe('ResearchOutputForm navigation warning', () => {
  let addSpy: jest.SpyInstance;
  let removeSpy: jest.SpyInstance;

  beforeEach(() => {
    addSpy = jest.spyOn(window, 'addEventListener');
    removeSpy = jest.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const hasUnsavedChangesWarning = () => {
    const countFor = (spy: jest.SpyInstance) =>
      spy.mock.calls.filter(([event]) => event === 'beforeunload').length;
    return countFor(addSpy) - countFor(removeSpy) > 0;
  };

  const selectType = (value: string) => {
    const typeDropdown = screen.getByRole('combobox', {
      name: /Select the type/i,
    });
    fireEvent.change(typeDropdown, { target: { value } });
    fireEvent.keyDown(typeDropdown, { keyCode: ENTER_KEYCODE });
  };

  it('does not warn about unsaved changes on a freshly rendered form', async () => {
    renderPrefilledForm();

    expect(await screen.findByDisplayValue('Output')).toBeVisible();
    expect(hasUnsavedChangesWarning()).toBe(false);
  });

  it('warns about unsaved changes once a field is edited', async () => {
    renderPrefilledForm();

    await userEvent.type(await screen.findByDisplayValue('Output'), '!');

    await waitFor(() => {
      expect(hasUnsavedChangesWarning()).toBe(true);
    });
  });

  it('stops warning when the edit is reverted', async () => {
    renderPrefilledForm();

    const title = await screen.findByDisplayValue('Output');
    await userEvent.type(title, '!');
    await waitFor(() => {
      expect(hasUnsavedChangesWarning()).toBe(true);
    });

    await userEvent.type(title, '{backspace}');

    await waitFor(() => {
      expect(hasUnsavedChangesWarning()).toBe(false);
    });
  });

  it('stops warning when a type change that cleared an empty subtype is reverted', async () => {
    renderPrefilledForm({
      researchOutputData: {
        ...initialResearchOutputData,
        subtype: undefined,
      },
    });

    selectType('Software');
    await waitFor(() => {
      expect(hasUnsavedChangesWarning()).toBe(true);
    });

    selectType('Code');

    await waitFor(() => {
      expect(hasUnsavedChangesWarning()).toBe(false);
    });
  });
});
