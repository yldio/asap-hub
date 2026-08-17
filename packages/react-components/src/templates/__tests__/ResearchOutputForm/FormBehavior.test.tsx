import { InnerToastContext } from '@asap-hub/react-context';
import {
  researchOutputDocumentTypeToType,
  ResearchOutputResponse,
  ServerValidationError,
} from '@asap-hub/model';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter, useLocation } from 'react-router';

import { Anchor } from '../../../atoms';
import { NavigationBlockerProvider } from '../../../navigation';
import { mockActErrorsInConsole } from '../../../test-utils';
import ResearchOutputForm from '../../ResearchOutputForm';
import {
  defaultAvailableActions,
  getDefaultProps,
  initialResearchOutputData,
} from '../../test-utils/research-output-form';

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
};

type RenderOptions = {
  initialEntries?: string[];
  toast?: jest.Mock;
  propOverride?: Partial<ComponentProps<typeof ResearchOutputForm>>;
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
};

const renderOutputForm = ({
  initialEntries = ['/first', '/form'],
  toast = jest.fn(),
  propOverride = {},
  wrapper,
}: RenderOptions = {}) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <NavigationBlockerProvider>
        <InnerToastContext.Provider value={toast}>
          <Anchor href="/another-url">Navigate away</Anchor>
          <ResearchOutputForm
            {...getDefaultProps()}
            researchOutputData={initialResearchOutputData}
            documentType="Bioinformatics"
            typeOptions={Array.from(
              researchOutputDocumentTypeToType.Bioinformatics,
            )}
            selectedTeams={[{ value: 'TEAMID', label: 'Example Team' }]}
            flowId="team-edit-published"
            published
            availableActions={{
              ...defaultAvailableActions,
              canSaveDraft: false,
            }}
            {...propOverride}
          />
        </InnerToastContext.Provider>
        <LocationDisplay />
      </NavigationBlockerProvider>
    </MemoryRouter>,
    { wrapper },
  );

const ScrollableMain: React.ComponentType<{ children: React.ReactNode }> = ({
  children,
}) => <main data-testid="scrollable-container">{children}</main>;

const editTitle = async () =>
  userEvent.type(await screen.findByDisplayValue('Output'), '!');

const saveButton = () => screen.getByRole('button', { name: /^Save/i });

describe('ResearchOutputForm form behavior', () => {
  beforeEach(() => {
    jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    jest.spyOn(window.history, 'pushState').mockImplementation(() => {});
    jest.spyOn(window.history, 'go').mockImplementation(() => {});
    jest.spyOn(window.history, 'back').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('navigation blocking', () => {
    it('does not prompt when leaving an untouched form', async () => {
      renderOutputForm();
      expect(await screen.findByDisplayValue('Output')).toBeVisible();

      await userEvent.click(screen.getByText(/navigate away/i));

      expect(window.confirm).not.toHaveBeenCalled();
    });

    it('prompts when leaving after making edits', async () => {
      renderOutputForm();
      await editTitle();

      await userEvent.click(screen.getByText(/navigate away/i));

      expect(window.confirm).toHaveBeenCalled();
    });

    it('prompts when leaving while saving', async () => {
      const onSave = jest.fn(
        () =>
          new Promise<never>(() => {
            /* never settles, to hold the saving state */
          }),
      );
      renderOutputForm({ propOverride: { onSave } });
      await editTitle();

      await userEvent.click(saveButton());
      await waitFor(() => expect(saveButton()).toBeDisabled());

      await userEvent.click(screen.getByText(/navigate away/i));

      expect(window.confirm).toHaveBeenCalled();
    });

    it('prompts when leaving while a modal-confirmed save is in flight', async () => {
      const onSave = jest.fn(
        () =>
          new Promise<never>(() => {
            /* never settles, to hold the saving state */
          }),
      );
      renderOutputForm({
        propOverride: { onSave, flowId: 'team-add-version' },
      });

      await userEvent.click(saveButton());
      await userEvent.click(
        await screen.findByRole('button', { name: /Publish new version/i }),
      );
      await waitFor(() => expect(onSave).toHaveBeenCalled());

      await userEvent.click(screen.getByText(/navigate away/i));

      expect(window.confirm).toHaveBeenCalled();
    });

    it('prompts when leaving after a failed save', async () => {
      let rejectSave: (error: Error) => void = () => {};
      const onSave = jest.fn(
        () =>
          new Promise<never>((_resolve, reject) => {
            rejectSave = reject;
          }),
      );
      renderOutputForm({ propOverride: { onSave } });
      await editTitle();

      await userEvent.click(saveButton());
      await act(async () => {
        rejectSave(new Error('Save failed'));
      });
      await waitFor(() => expect(saveButton()).toBeEnabled());

      (window.confirm as jest.Mock).mockClear();
      await userEvent.click(screen.getByText(/navigate away/i));

      expect(window.confirm).toHaveBeenCalled();
    });
  });

  describe('on cancel', () => {
    const cancelButton = () => screen.getByRole('button', { name: /Cancel/i });

    it('prompts after making edits', async () => {
      renderOutputForm();
      await editTitle();

      await userEvent.click(cancelButton());

      expect(window.confirm).toHaveBeenCalled();
    });

    it('navigates back when the user confirms', async () => {
      jest.spyOn(window, 'confirm').mockReturnValue(true);
      const goSpy = jest.spyOn(window.history, 'go');
      Object.defineProperty(window.history, 'length', {
        value: 2,
        writable: true,
        configurable: true,
      });

      renderOutputForm();
      await editTitle();
      expect(screen.getByTestId('location')).toHaveTextContent('/form');

      await userEvent.click(cancelButton());

      expect(window.confirm).toHaveBeenCalled();
      // The warning pushes a dummy history entry, so going back one page
      // means going back two entries.
      expect(goSpy).toHaveBeenCalledWith(-2);
    });

    it('stays on the form when the user dismisses the prompt', async () => {
      jest.spyOn(window, 'confirm').mockReturnValue(false);

      renderOutputForm();
      await editTitle();
      expect(screen.getByTestId('location')).toHaveTextContent('/form');

      await userEvent.click(cancelButton());

      expect(screen.getByTestId('location')).toHaveTextContent('/form');
    });
  });

  describe('when saving', () => {
    it('does not save while the form is invalid', async () => {
      const onSave = jest.fn();
      const toast = jest.fn();
      renderOutputForm({
        toast,
        propOverride: {
          onSave,
          researchOutputData: { ...initialResearchOutputData, link: '' },
        },
      });

      await userEvent.click(saveButton());

      expect(onSave).not.toHaveBeenCalled();
      await waitFor(() =>
        expect(toast).toHaveBeenCalledWith(
          'There are some errors in the form. Please correct the fields below.',
        ),
      );
    });

    it('shows an error toast when saving rejects', async () => {
      const toast = jest.fn();
      const onSave = jest.fn().mockRejectedValue(new Error('Save failed'));
      renderOutputForm({ toast, propOverride: { onSave } });

      await userEvent.click(saveButton());

      await waitFor(() =>
        expect(toast).toHaveBeenCalledWith(
          'There was an error and we were unable to save your changes. Please try again.',
        ),
      );
    });

    it('shows an error toast when saving resolves without an output', async () => {
      const toast = jest.fn();
      const onSave = jest.fn().mockResolvedValue(undefined);
      renderOutputForm({ toast, propOverride: { onSave } });

      await userEvent.click(saveButton());

      await waitFor(() =>
        expect(toast).toHaveBeenCalledWith(
          'There was an error and we were unable to save your changes. Please try again.',
        ),
      );
    });

    it('re-enables the save button after a failed save', async () => {
      const onSave = jest.fn().mockRejectedValue(new Error('Save failed'));
      renderOutputForm({ propOverride: { onSave } });

      await userEvent.click(saveButton());

      await waitFor(() => expect(saveButton()).toBeEnabled());
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeEnabled();
    });

    it('keeps the footer disabled while a modal-confirmed save is in flight', async () => {
      const onSave = jest.fn(
        () =>
          new Promise<never>(() => {
            /* never settles, to hold the saving state */
          }),
      );
      renderOutputForm({
        propOverride: { onSave, flowId: 'team-add-version' },
      });

      await userEvent.click(saveButton());
      await userEvent.click(
        await screen.findByRole('button', { name: /Publish new version/i }),
      );

      await waitFor(() => expect(onSave).toHaveBeenCalled());
      expect(saveButton()).toBeDisabled();
    });

    it('disables the form fields while a modal-confirmed save is in flight', async () => {
      const onSave = jest.fn(
        () =>
          new Promise<never>(() => {
            /* never settles, to hold the saving state */
          }),
      );
      renderOutputForm({
        propOverride: { onSave, flowId: 'team-add-version' },
      });

      const titleField = await screen.findByDisplayValue('Output');
      expect(titleField).toBeEnabled();

      await userEvent.click(saveButton());
      await userEvent.click(
        await screen.findByRole('button', { name: /Publish new version/i }),
      );

      await waitFor(() => expect(onSave).toHaveBeenCalled());
      expect(titleField).toBeDisabled();
    });

    it('rebaselines to the values it saved, not to a field that settled mid-save', async () => {
      let resolveShortDescription: (value: string) => void = () => {};
      const getShortDescriptionFromDescription = jest.fn(
        () =>
          new Promise<string>((resolve) => {
            resolveShortDescription = resolve;
          }),
      );

      let resolveSave: (value: ResearchOutputResponse) => void = () => {};
      const onSave = jest.fn(
        () =>
          new Promise<ResearchOutputResponse>((resolve) => {
            resolveSave = resolve;
          }),
      );

      renderOutputForm({
        propOverride: { onSave, getShortDescriptionFromDescription },
      });

      const shortDescriptionField =
        await screen.findByDisplayValue('shortDescription');

      // Start an async short-description generation that will settle after the
      // save request has already gone out.
      await userEvent.click(screen.getByRole('button', { name: /generate/i }));

      await userEvent.click(saveButton());
      await waitFor(() => expect(onSave).toHaveBeenCalled());

      // The generation settles while the save is still in flight, changing the
      // field's value after the request was sent.
      await act(async () => {
        resolveShortDescription('AI generated description');
      });

      await act(async () => {
        resolveSave({ id: 'ro-1' } as ResearchOutputResponse);
      });

      // The form rebaselines to the short description it actually saved, not to
      // the value that settled mid-flight.
      await waitFor(() =>
        expect(shortDescriptionField).toHaveValue('shortDescription'),
      );
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ shortDescription: 'shortDescription' }),
      );
    });
  });

  describe('server errors', () => {
    let consoleMock: ReturnType<typeof mockActErrorsInConsole>;
    beforeEach(() => {
      consoleMock = mockActErrorsInConsole();
    });
    afterEach(() => {
      consoleMock.mockRestore();
    });

    const rejectWithServerErrors = (...instancePaths: string[]) =>
      jest.fn().mockRejectedValue(
        new ServerValidationError(
          instancePaths.map((instancePath) => ({
            instancePath,
            keyword: 'unique',
            message: 'Error',
            params: {},
            schemaPath: `#/properties${instancePath}/unique`,
          })),
        ),
      );

    it.each`
      instancePath | label       | message
      ${'/link'}   | ${/URL/i}   | ${'A Research Output with this URL already exists. Please enter a different URL.'}
      ${'/title'}  | ${/title/i} | ${'A Research Output with this title already exists. Please check if this is repeated and choose a different title.'}
    `(
      'shows the $instancePath server error on its field and clears it when the field changes',
      async ({ instancePath, label, message }) => {
        const toast = jest.fn();
        renderOutputForm({
          toast,
          propOverride: { onSave: rejectWithServerErrors(instancePath) },
        });

        await userEvent.click(saveButton());

        expect(await screen.findByText(message)).toBeVisible();
        expect(toast).toHaveBeenCalledWith(
          'There are some errors in the form. Please correct the fields below.',
        );

        await userEvent.type(screen.getByLabelText(label), 'a');

        await waitFor(() =>
          expect(screen.queryByText(message)).not.toBeInTheDocument(),
        );
      },
    );

    it('scrolls back to the top so the errors are in view', async () => {
      renderOutputForm({
        propOverride: { onSave: rejectWithServerErrors('/link') },
      });

      await userEvent.click(saveButton());

      await waitFor(() =>
        expect(window.scrollTo).toHaveBeenCalledWith({
          top: 0,
          behavior: 'smooth',
        }),
      );
    });

    it('scrolls the surrounding container instead of the window when the form is inside one', async () => {
      renderOutputForm({
        propOverride: { onSave: rejectWithServerErrors('/link') },
        wrapper: ScrollableMain,
      });

      const scrollableContainer = screen.getByTestId('scrollable-container');
      const scrollTo = jest.fn();
      scrollableContainer.scrollTo = scrollTo;

      await userEvent.click(saveButton());

      await waitFor(() =>
        expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' }),
      );
      expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it('falls back to the generic error toast for unsupported server errors', async () => {
      const toast = jest.fn();
      renderOutputForm({
        toast,
        propOverride: { onSave: rejectWithServerErrors('/unknown') },
      });

      await userEvent.click(saveButton());

      await waitFor(() =>
        expect(toast).toHaveBeenCalledWith(
          'There was an error and we were unable to save your changes. Please try again.',
        ),
      );
    });
  });
});
