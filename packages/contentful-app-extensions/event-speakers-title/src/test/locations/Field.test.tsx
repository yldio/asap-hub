import '@testing-library/jest-dom';
import React from 'react';
import Field from '../../locations/Field';
import { render, screen, waitFor } from '@testing-library/react';

import { useSDK } from '@contentful/react-apps-toolkit';

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: jest.fn(),
}));

describe('Field component', () => {
  it('sets title based on team name and user name', async () => {
    const mockBaseSdk = {
      window: {
        startAutoResizer: jest.fn(),
      },
      field: {
        getValue: jest.fn(),
        setValue: jest.fn(),
      },
      space: {
        getEntry: jest.fn().mockImplementation((entryId) => {
          if (entryId === 'team-id') {
            return Promise.resolve({
              fields: {
                displayName: {
                  'en-US': 'Team A',
                },
              },
            });
          }

          if (entryId === 'user-id') {
            return Promise.resolve({
              fields: {
                name: {
                  'en-US': 'User B',
                },
              },
            });
          }
        }),
      },
      entry: {
        onSysChanged: jest.fn((cb) => {
          cb(jest.fn());
          return jest.fn();
        }),
        fields: {
          team: {
            getValue: jest.fn(() => ({
              sys: {
                id: 'team-id',
              },
            })),
          },
          user: {
            getValue: jest.fn(() => ({
              sys: {
                id: 'user-id',
              },
            })),
          },
        },
      },
    };
    (useSDK as jest.Mock).mockReturnValue(mockBaseSdk);
    render(<Field />);
    await waitFor(() => {
      expect(mockBaseSdk.field.setValue).toHaveBeenCalledWith(
        'Team A - User B',
      );
    });

    expect(screen.getByText('Team A - User B')).toBeInTheDocument();
  });
});
