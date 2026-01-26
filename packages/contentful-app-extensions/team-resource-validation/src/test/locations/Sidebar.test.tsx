import { SidebarAppSDK } from '@contentful/app-sdk';
import { useSDK, useAutoResizer } from '@contentful/react-apps-toolkit';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import Sidebar, { TEAM_RESOURCE_FIELDS_WARNING } from '../../locations/Sidebar';

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: jest.fn(),
  useAutoResizer: jest.fn(),
}));

const unsubscribeFn = jest.fn();

const createMockField = (getValue: () => unknown) => {
  let callback: (() => void) | null = null;
  return {
    id: 'mockField',
    getValue: jest.fn(getValue),
    onValueChanged: jest.fn((cb: () => void) => {
      callback = cb;
      setTimeout(() => callback?.(), 0);
      return unsubscribeFn;
    }),
    triggerChange: () => callback?.(),
  };
};

const mockSdk = (contentTypeId: string) => {
  const fields: Record<string, ReturnType<typeof createMockField>> = {
    resourceTitle: createMockField(() => null),
    resourceDescription: createMockField(() => null),
    resourceButtonCopy: createMockField(() => null),
    resourceContactEmail: createMockField(() => null),
    resourceLink: createMockField(() => null),
  };

  Object.keys(fields).forEach((key) => {
    fields[key].id = key;
  });

  return {
    contentType: { sys: { id: contentTypeId } },
    entry: {
      getSys: jest.fn(() => ({ id: 'entry-1' })),
      getMetadata: jest.fn(() => ({})),
      onSysChanged: jest.fn((cb: () => void) => {
        setTimeout(() => cb(), 0);
        return unsubscribeFn;
      }),
      onMetadataChanged: jest.fn(() => unsubscribeFn),
      fields,
    },
    navigator: { openEntry: jest.fn() },
  };
};

describe('Team resource validation sidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('enables automatic resizing', async () => {
    const sdk = mockSdk('teams') as unknown as jest.Mocked<SidebarAppSDK>;
    (useSDK as jest.Mock).mockReturnValue(sdk);

    render(<Sidebar />);
    await waitFor(() => {
      expect(useAutoResizer).toHaveBeenCalled();
    });
  });

  it('shows empty state when there are no warnings', async () => {
    const sdk = mockSdk('teams') as unknown as jest.Mocked<SidebarAppSDK>;
    (useSDK as jest.Mock).mockReturnValue(sdk);

    render(<Sidebar />);
    await waitFor(() => {
      expect(
        screen.getByText('No additional validation warnings.'),
      ).toBeInTheDocument();
    });
  });

  it('shows warning when one required Resource field is populated but not all are', async () => {
    const sdk = mockSdk('teams') as unknown as jest.Mocked<SidebarAppSDK>;
    (sdk.entry.fields.resourceTitle as any).getValue = jest.fn(
      () => 'Some title',
    );
    (useSDK as jest.Mock).mockReturnValue(sdk);

    render(<Sidebar />);
    await waitFor(() => {
      expect(
        screen.getByText(TEAM_RESOURCE_FIELDS_WARNING),
      ).toBeInTheDocument();
    });
  });

  it('does not show warning when all required Resource fields are populated', async () => {
    const sdk = mockSdk('teams') as unknown as jest.Mocked<SidebarAppSDK>;
    (sdk.entry.fields.resourceTitle as any).getValue = jest.fn(
      () => 'Some title',
    );
    (sdk.entry.fields.resourceDescription as any).getValue = jest.fn(
      () => 'Some description',
    );
    (sdk.entry.fields.resourceButtonCopy as any).getValue = jest.fn(
      () => 'Click',
    );
    (sdk.entry.fields.resourceContactEmail as any).getValue = jest.fn(
      () => 'test@example.com',
    );
    (useSDK as jest.Mock).mockReturnValue(sdk);

    render(<Sidebar />);
    await waitFor(() => {
      expect(
        screen.getByText('No additional validation warnings.'),
      ).toBeInTheDocument();
    });
  });

  it('does not show warning when only Resource Link is populated (optional)', async () => {
    const sdk = mockSdk('teams') as unknown as jest.Mocked<SidebarAppSDK>;
    (sdk.entry.fields.resourceLink as any).getValue = jest.fn(
      () => 'https://example.com',
    );
    (useSDK as jest.Mock).mockReturnValue(sdk);

    render(<Sidebar />);
    await waitFor(() => {
      expect(
        screen.getByText('No additional validation warnings.'),
      ).toBeInTheDocument();
    });
  });

  it('navigates to entry when warning is clicked', async () => {
    const sdk = mockSdk('teams') as unknown as jest.Mocked<SidebarAppSDK>;
    (sdk.entry.fields.resourceTitle as any).getValue = jest.fn(
      () => 'Some title',
    );
    (useSDK as jest.Mock).mockReturnValue(sdk);

    render(<Sidebar />);
    await waitFor(() => {
      expect(
        screen.getByText(TEAM_RESOURCE_FIELDS_WARNING),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(TEAM_RESOURCE_FIELDS_WARNING));

    await waitFor(() => {
      expect(sdk.navigator.openEntry).toHaveBeenCalledWith('entry-1', {
        slideIn: false,
      });
    });
  });
});
