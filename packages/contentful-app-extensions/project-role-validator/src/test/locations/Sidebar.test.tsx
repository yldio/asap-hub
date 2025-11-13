import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Sidebar from '../../locations/Sidebar';

import { useSDK, useAutoResizer } from '@contentful/react-apps-toolkit';

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: jest.fn(),
  useAutoResizer: jest.fn(),
}));

describe('Sidebar component', () => {
  beforeEach(() => {
    (useSDK as jest.Mock).mockImplementation(() => ({
      contentType: {
        sys: {
          id: 'projects',
        },
      },
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
    }));
  });

  it('enables automatic resizing', async () => {
    render(<Sidebar />);
    await waitFor(() => {
      expect(useAutoResizer).toHaveBeenCalled();
    });
  });

  it('renders warning when no project type is set', async () => {
    render(<Sidebar />);
    await waitFor(() => {
      expect(screen.getByText(/no project type/i)).toBeInTheDocument();
    });
  });

  it('renders message when no members are added', async () => {
    (useSDK as jest.Mock).mockImplementation(() => ({
      contentType: {
        sys: {
          id: 'projects',
        },
      },
      entry: {
        fields: {
          projectType: {
            getValue: jest.fn().mockReturnValue('Discovery Project'),
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
    }));

    render(<Sidebar />);
    await waitFor(() => {
      expect(screen.getByText(/no members/i)).toBeInTheDocument();
    });
  });

  it('returns null when content type is not projects', async () => {
    (useSDK as jest.Mock).mockImplementation(() => ({
      contentType: {
        sys: {
          id: 'teams',
        },
      },
      entry: {
        fields: {
          projectType: {
            getValue: jest.fn().mockReturnValue('Discovery Project'),
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
    }));

    const { container } = render(<Sidebar />);
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });
});
