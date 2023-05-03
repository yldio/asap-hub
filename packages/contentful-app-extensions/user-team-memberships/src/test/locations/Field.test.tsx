import '@testing-library/jest-dom';
import React, { useState } from 'react';
import Field from '../../locations/Field';
import { render, screen, waitFor } from '@testing-library/react';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import {
  useSDK,
  useAutoResizer,
  useFieldValue,
} from '@contentful/react-apps-toolkit';

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: jest.fn(),
  useAutoResizer: jest.fn(),
  useFieldValue: jest.fn(),
}));

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
    }),
  },
});

const setTitle = jest.fn();
const mockUseFieldValue = (field: string) => {
  if (field === 'team') {
    return [{ sys: { id: 'team-id' } }];
  }
  if (field === 'title') {
    const [title, _setTitle] = useState(null);
    return [title, setTitle.mockImplementation(_setTitle)];
  }
  return [null];
};

describe('Field component', () => {
  let sdk: jest.Mocked<FieldExtensionSDK>;

  beforeEach(() => {
    sdk = mockBaseSdk() as unknown as jest.Mocked<FieldExtensionSDK>;
    (useSDK as jest.Mock).mockReturnValue(sdk);
    (useFieldValue as jest.Mock).mockImplementation(mockUseFieldValue);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('enables automatic resizing', async () => {
    render(<Field />);

    await waitFor(() => {
      expect(screen.getByText('Team A')).toBeInTheDocument();
      expect(useAutoResizer).toHaveBeenCalled();
    });
  });

  it('sets the title with the team name', async () => {
    render(<Field />);

    await waitFor(() => {
      expect(screen.getByText('Team A')).toBeInTheDocument();
      // make sure that the title is not set with `null` on first render
      expect(setTitle).toHaveBeenCalledTimes(1);
      expect(setTitle).toHaveBeenCalledWith('Team A');
    });
  });

  it('sets the title with an inactive marker if inactiveDate is set', async () => {
    (useFieldValue as jest.Mock).mockImplementation((field) => {
      if (field === 'inactiveSinceDate') {
        return ['2020-01-01T12:00:00.000Z'];
      }
      return mockUseFieldValue(field);
    });

    render(<Field />);

    await waitFor(() => {
      expect(screen.getByText('Team A (inactive)')).toBeInTheDocument();
      expect(setTitle).toHaveBeenCalledWith('Team A (inactive)');
    });
  });

  it('does nothing if team is not defined', async () => {
    (useFieldValue as jest.Mock).mockImplementation((field) => {
      if (field === 'team') {
        return [null];
      }
      return mockUseFieldValue(field);
    });

    render(<Field />);

    expect(sdk.space.getEntry).not.toHaveBeenCalled();
    expect(setTitle).not.toHaveBeenCalled();
  });
});
