import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Sidebar from '../../locations/Sidebar';

import { useSDK } from '@contentful/react-apps-toolkit';

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: jest.fn(),
}));

describe('Sidebar component', () => {
  let mockSdk: any;

  beforeEach(() => {
    mockSdk = {
      entry: {
        fields: {
          projectType: {
            getValue: jest.fn().mockReturnValue(undefined),
            onValueChanged: jest.fn().mockReturnValue(jest.fn()),
          },
          members: {
            getValue: jest.fn().mockReturnValue([]),
            onValueChanged: jest.fn().mockReturnValue(jest.fn()),
          },
        },
      },
      space: {
        getEntry: jest.fn(),
      },
      locales: {
        default: 'en-US',
      },
    };

    (useSDK as jest.Mock).mockReturnValue(mockSdk);
  });

  it('renders warning when no project type is set', async () => {
    render(<Sidebar />);
    await waitFor(() => {
      expect(screen.getByText(/no project type/i)).toBeInTheDocument();
    });
  });

  it('renders message when no members are added', async () => {
    mockSdk.entry.fields.projectType.getValue.mockReturnValue(
      'Discovery Project',
    );

    render(<Sidebar />);
    await waitFor(() => {
      expect(
        screen.getByText(/no members have been added to this project yet/i),
      ).toBeInTheDocument();
    });
  });
});
