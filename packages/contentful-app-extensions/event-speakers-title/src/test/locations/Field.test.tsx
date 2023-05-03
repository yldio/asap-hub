import '@testing-library/jest-dom';
import React from 'react';
import Field from '../../locations/Field';
import { render, screen, waitFor } from '@testing-library/react';

import { useSDK } from '@contentful/react-apps-toolkit';

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: jest.fn(),
}));

type IdMap = {
  user: string | null;
  team: string | null;
};

const mockBaseSdk = ({ user, team }: IdMap) => ({
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

      if (entryId === 'external-author-id') {
        return Promise.resolve({
          fields: {
            name: {
              'en-US': 'External Author',
            },
          },
        });
      }

      if (entryId === 'user-id') {
        return Promise.resolve({
          fields: {
            firstName: {
              'en-US': 'Hub',
            },
            lastName: {
              'en-US': 'User',
            },
          },
        });
      }
      return Promise.resolve(null);
    }),
  },
  entry: {
    onSysChanged: jest.fn((cb) => {
      cb(jest.fn());
      return jest.fn();
    }),
    fields: {
      team: {
        getValue: jest.fn(() => (team ? { sys: { id: team } } : null)),
      },
      user: {
        getValue: jest.fn(() => (user ? { sys: { id: user } } : null)),
      },
    },
  },
});

describe('Field component', () => {
  it('sets title based on team name and user name', async () => {
    const mockSDK = mockBaseSdk({ user: 'user-id', team: 'team-id' });
    (useSDK as jest.Mock).mockReturnValue(mockSDK);
    render(<Field />);
    await waitFor(() => {
      expect(mockSDK.field.setValue).toHaveBeenCalledWith('Team A - Hub User');
    });
    expect(screen.getByText('Team A - Hub User')).toBeInTheDocument();
  });

  it('sets title based on team name and external author name', async () => {
    const mockSDK = mockBaseSdk({
      user: 'external-author-id',
      team: 'team-id',
    });
    (useSDK as jest.Mock).mockReturnValue(mockSDK);
    render(<Field />);
    await waitFor(() => {
      expect(mockSDK.field.setValue).toHaveBeenCalledWith(
        'Team A - External Author',
      );
    });
    expect(screen.getByText('Team A - External Author')).toBeInTheDocument();
  });

  it('sets title based on team name only', async () => {
    const mockSDK = mockBaseSdk({ user: null, team: 'team-id' });
    (useSDK as jest.Mock).mockReturnValue(mockSDK);
    render(<Field />);
    await waitFor(() => {
      expect(mockSDK.field.setValue).toHaveBeenCalledWith('Team A');
    });
    expect(screen.getByText('Team A')).toBeInTheDocument();
  });

  it('sets title based on user name only', async () => {
    const mockSDK = mockBaseSdk({ user: 'user-id', team: null });
    (useSDK as jest.Mock).mockReturnValue(mockSDK);
    render(<Field />);
    await waitFor(() => {
      expect(mockSDK.field.setValue).toHaveBeenCalledWith('Hub User');
    });
    expect(screen.getByText('Hub User')).toBeInTheDocument();
  });
});
