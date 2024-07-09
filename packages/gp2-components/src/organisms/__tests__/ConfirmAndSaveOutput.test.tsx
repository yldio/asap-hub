import { createOutputResponse } from '@asap-hub/fixtures/src/gp2';
import { OutputResponse } from '@asap-hub/model/src/gp2';
import { Button } from '@asap-hub/react-components';
import { NotificationContext } from '@asap-hub/react-context';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import {
  ConfirmAndSaveOutput,
  ConfirmAndSaveOutputProps,
} from '../ConfirmAndSaveOutput';
import Form, { GetWrappedOnSave } from '../Form';

describe('ConfirmAndSaveOutput', () => {
  const addNotification = jest.fn();
  const history = createMemoryHistory();
  const shareOutput = jest.fn();

  const wrapper: React.ComponentType = ({ children }) => (
    <NotificationContext.Provider
      value={{
        notifications: [],
        addNotification,
        removeNotification: jest.fn(),
      }}
    >
      <Router navigator={history}>{children}</Router>
    </NotificationContext.Provider>
  );

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
      userEvent.click(screen.getByRole('button', { name: 'Publish' }));

      expect(
        screen.getByText('Publish output for the whole hub?'),
      ).toBeVisible();

      userEvent.click(
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

      userEvent.click(screen.getByRole('button', { name: 'Publish' }));

      expect(
        screen.getByText('Publish new version for the whole hub?'),
      ).toBeVisible();

      userEvent.click(
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

      userEvent.click(screen.getByRole('button', { name: 'Publish' }));

      expect(
        screen.getByText('Publish output for the whole hub?'),
      ).toBeVisible();

      userEvent.click(screen.getByRole('button', { name: /Publish output/i }));

      await waitFor(() => {
        expect(
          screen.queryByText('Publish output for the whole hub?'),
        ).not.toBeInTheDocument();
      });
    });
    it('closes the version modal when user clicks on save and there are server side errors', async () => {
      shareOutput.mockRejectedValueOnce(new Error('something went wrong'));
      renderElement({ isEditing: true, createVersion: true });

      userEvent.click(screen.getByRole('button', { name: 'Publish' }));

      expect(
        screen.getByText('Publish new version for the whole hub?'),
      ).toBeVisible();

      userEvent.click(
        screen.getByRole('button', { name: /Publish new version/i }),
      );

      await waitFor(() => {
        expect(
          screen.queryByText('Publish new version for the whole hub?'),
        ).not.toBeInTheDocument();
      });
    });
  });
});
