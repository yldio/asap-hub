import '@testing-library/jest-dom';
import React, { useState } from 'react';
import Field from '../../locations/Field';
import { render, screen, waitFor } from '@testing-library/react';

import { useSDK, useFieldValue } from '@contentful/react-apps-toolkit';

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: jest.fn(),
  useAutoResizer: jest.fn(),
  useFieldValue: jest.fn(),
}));

type IdMap = {
  user: string | null;
  team: string | null;
};

const mockBaseSdk = () => ({
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
});

const setTitle = jest.fn();
const mockUseFieldValue =
  ({ team, user }: IdMap) =>
  (field: string) => {
    if (field === 'team') {
      return team ? [{ sys: { id: team } }] : [undefined];
    }
    if (field === 'user') {
      return user ? [{ sys: { id: user } }] : [undefined];
    }
    if (field === 'title') {
      const [title, _setTitle] = useState(null);
      return [title, setTitle.mockImplementation(_setTitle)];
    }
    return [null];
  };

describe('Field component', () => {
  it('sets title based on team name and user name', async () => {
    const mockSDK = mockBaseSdk();
    (useSDK as jest.Mock).mockReturnValue(mockSDK);
    (useFieldValue as jest.Mock).mockImplementation(
      mockUseFieldValue({ user: 'user-id', team: 'team-id' }),
    );
    render(<Field />);
    await waitFor(() => {
      expect(setTitle).toHaveBeenCalledWith('Team A - Hub User');
    });
    expect(screen.getByText('Team A - Hub User')).toBeInTheDocument();
  });

  it('sets title based on team name and external author name', async () => {
    const mockSDK = mockBaseSdk();
    (useSDK as jest.Mock).mockReturnValue(mockSDK);
    (useFieldValue as jest.Mock).mockImplementation(
      mockUseFieldValue({
        user: 'external-author-id',
        team: 'team-id',
      }),
    );
    render(<Field />);
    await waitFor(() => {
      expect(setTitle).toHaveBeenCalledWith('Team A - External Author');
    });
    expect(screen.getByText('Team A - External Author')).toBeInTheDocument();
  });

  it('sets title based on team name only', async () => {
    const mockSDK = mockBaseSdk();
    (useSDK as jest.Mock).mockReturnValue(mockSDK);
    (useFieldValue as jest.Mock).mockImplementation(
      mockUseFieldValue({ user: null, team: 'team-id' }),
    );
    render(<Field />);
    await waitFor(() => {
      expect(setTitle).toHaveBeenCalledWith('Team A');
    });
    expect(screen.getByText('Team A')).toBeInTheDocument();
  });

  it('sets title based on user name only', async () => {
    const mockSDK = mockBaseSdk();
    (useSDK as jest.Mock).mockReturnValue(mockSDK);
    (useFieldValue as jest.Mock).mockImplementation(
      mockUseFieldValue({ user: 'user-id', team: null }),
    );
    render(<Field />);
    await waitFor(() => {
      expect(setTitle).toHaveBeenCalledWith('Hub User');
    });
    expect(screen.getByText('Hub User')).toBeInTheDocument();
  });

  it('sets title to empty string if team and user are removed', async () => {
    const mockSDK = mockBaseSdk();
    (useSDK as jest.Mock).mockReturnValue(mockSDK);
    (useFieldValue as jest.Mock).mockImplementation(
      mockUseFieldValue({ user: null, team: null }),
    );
    render(<Field />);
    await waitFor(() => {
      expect(setTitle).toHaveBeenCalledWith('');
    });
  });
});
