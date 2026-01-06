import { createOutputResponse } from '@asap-hub/fixtures/src/gp2';
import { OutputResponse } from '@asap-hub/model/src/gp2';
import { Button } from '@asap-hub/react-components';
import { NotificationContext } from '@asap-hub/react-context';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import {
  ConfirmAndSaveOutput,
  ConfirmAndSaveOutputProps,
} from '../ConfirmAndSaveOutput';
import Form, { GetWrappedOnSave } from '../Form';

describe('ConfirmAndSaveOutput', () => {
  const addNotification = jest.fn();
  const shareOutput = jest.fn();

  const wrapper: React.ComponentType<{ children?: React.ReactNode }> = ({
    children,
  }) => {
    const router = createMemoryRouter(
      [
        {
          path: '/*',
          element: children,
        },
      ],
      { initialEntries: ['/'] },
    );

    return (
      <NotificationContext.Provider
        value={{
          notifications: [],
          addNotification,
          removeNotification: jest.fn(),
        }}
      >
        <RouterProvider router={router} />
      </NotificationContext.Provider>
    );
  };

  const renderElement = (props?: Partial<ConfirmAndSaveOutputProps>) =>
    render(
      <Form dirty={false}>
        {({ getWrappedOnSave }) => (
          <ConfirmAndSaveOutput
            path={(id: string) => id}
            documentType="Article"
            title="title"
            currentPayload={{
              ...createOutputResponse(),
              tagIds: [],
              contributingCohortIds: [],
              mainEntityId: '',
              relatedOutputIds: [],
              relatedEventIds: [],
              authors: [],
            }}
            shareOutput={shareOutput}
            setRedirectOnSave={(url: string) => {}}
            entityType="project"
            isEditing={false}
            createVersion={false}
            getWrappedOnSave={
              getWrappedOnSave as unknown as GetWrappedOnSave<OutputResponse>
            }
            {...props}
          >
            {({ save }) => <Button onClick={save}>Publish</Button>}
          </ConfirmAndSaveOutput>
        )}
      </Form>,
      { wrapper },
    );

  describe('cancel', () => {
    it('closes the publish modal when user clicks on cancel', async () => {
      renderElement();
      await userEvent.click(screen.getByRole('button', { name: 'Publish' }));

      expect(
        screen.getByText('Publish output for the whole hub?'),
      ).toBeVisible();

      await userEvent.click(
        within(screen.getByRole('dialog')).getByRole('button', {
          name: 'Cancel',
        }),
      );

      await waitFor(() => {
        expect(
          screen.queryByText('Publish output for the whole hub?'),
        ).not.toBeInTheDocument();
      });
    });

    it('closes the version modal when user clicks on cancel', async () => {
      renderElement({ isEditing: true, createVersion: true });

      await userEvent.click(screen.getByRole('button', { name: 'Publish' }));

      expect(
        screen.getByText('Publish new version for the whole hub?'),
      ).toBeVisible();

      await userEvent.click(
        within(screen.getByRole('dialog')).getByRole('button', {
          name: 'Cancel',
        }),
      );

      await waitFor(() => {
        expect(
          screen.queryByText('Publish new version for the whole hub?'),
        ).not.toBeInTheDocument();
      });
    });
  });
  describe('server side errors', () => {
    it('closes the publish modal when user clicks on save and there are server side errors', async () => {
      shareOutput.mockRejectedValueOnce(new Error('something went wrong'));
      renderElement();

      await userEvent.click(screen.getByRole('button', { name: 'Publish' }));

      expect(
        screen.getByText('Publish output for the whole hub?'),
      ).toBeVisible();

      await userEvent.click(
        screen.getByRole('button', { name: /Publish output/i }),
      );

      await waitFor(() => {
        expect(
          screen.queryByText('Publish output for the whole hub?'),
        ).not.toBeInTheDocument();
      });
    });
    it('closes the version modal when user clicks on save and there are server side errors', async () => {
      shareOutput.mockRejectedValueOnce(new Error('something went wrong'));
      renderElement({ isEditing: true, createVersion: true });

      await userEvent.click(screen.getByRole('button', { name: 'Publish' }));

      expect(
        screen.getByText('Publish new version for the whole hub?'),
      ).toBeVisible();

      await userEvent.click(
        screen.getByRole('button', { name: /Publish new version/i }),
      );

      await waitFor(() => {
        expect(
          screen.queryByText('Publish new version for the whole hub?'),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('successful save', () => {
    const renderWithRouter = (props?: Partial<ConfirmAndSaveOutputProps>) => {
      const router = createMemoryRouter(
        [
          {
            path: '/*',
            element: (
              <NotificationContext.Provider
                value={{
                  notifications: [],
                  addNotification,
                  removeNotification: jest.fn(),
                }}
              >
                <Form dirty={false}>
                  {({ getWrappedOnSave }) => (
                    <ConfirmAndSaveOutput
                      path={(id: string) => `/outputs/${id}`}
                      documentType="Article"
                      title="title"
                      currentPayload={{
                        ...createOutputResponse(),
                        tagIds: [],
                        contributingCohortIds: [],
                        mainEntityId: '',
                        relatedOutputIds: [],
                        relatedEventIds: [],
                        authors: [],
                      }}
                      shareOutput={shareOutput}
                      setRedirectOnSave={jest.fn()}
                      entityType="project"
                      isEditing={false}
                      createVersion={false}
                      getWrappedOnSave={
                        getWrappedOnSave as unknown as GetWrappedOnSave<OutputResponse>
                      }
                      {...props}
                    >
                      {({ save }) => <Button onClick={save}>Publish</Button>}
                    </ConfirmAndSaveOutput>
                  )}
                </Form>
              </NotificationContext.Provider>
            ),
          },
        ],
        { initialEntries: ['/outputs/new'] },
      );

      render(<RouterProvider router={router} />);
      return { router };
    };

    it('navigates to output page after successful publish', async () => {
      const outputId = 'output-123';
      shareOutput.mockResolvedValueOnce({ id: outputId });

      const { router } = renderWithRouter();

      await userEvent.click(screen.getByRole('button', { name: 'Publish' }));
      await userEvent.click(
        screen.getByRole('button', { name: /Publish output/i }),
      );

      await waitFor(() => {
        expect(router.state.location.pathname).toBe(`/outputs/${outputId}`);
      });
    });

    it('navigates to output page after successful version publish', async () => {
      const outputId = 'output-456';
      shareOutput.mockResolvedValueOnce({ id: outputId });

      const { router } = renderWithRouter({
        isEditing: true,
        createVersion: true,
      });

      await userEvent.click(screen.getByRole('button', { name: 'Publish' }));
      await userEvent.click(
        screen.getByRole('button', { name: /Publish new version/i }),
      );

      await waitFor(() => {
        expect(router.state.location.pathname).toBe(`/outputs/${outputId}`);
      });
    });
  });
});
