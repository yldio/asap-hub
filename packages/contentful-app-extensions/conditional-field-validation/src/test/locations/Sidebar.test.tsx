import { SidebarAppSDK } from '@contentful/app-sdk';
import { useSDK, useAutoResizer } from '@contentful/react-apps-toolkit';
import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';

import Sidebar from '../../locations/Sidebar';
import {
  TEAM_RESEARCH_THEME_WARNING,
  PROJECT_END_DATE_WARNING,
  PROJECT_RESOURCE_TYPE_WARNING,
} from '../../locations/Field';

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

const mockBaseSdk = (contentTypeId: string) => {
  const fields: Record<string, ReturnType<typeof createMockField>> = {
    teamType: createMockField(() => null),
    researchTheme: createMockField(() => null),
    status: createMockField(() => null),
    endDate: createMockField(() => null),
    projectType: createMockField(() => null),
    resourceType: createMockField(() => null),
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

describe('Sidebar component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('enables automatic resizing', async () => {
    const sdk = mockBaseSdk('teams') as unknown as jest.Mocked<SidebarAppSDK>;
    (useSDK as jest.Mock).mockReturnValue(sdk);

    render(<Sidebar />);
    await waitFor(() => {
      expect(useAutoResizer).toHaveBeenCalled();
    });
  });

  it('returns null when there are no warnings', async () => {
    const sdk = mockBaseSdk('teams') as unknown as jest.Mocked<SidebarAppSDK>;
    (sdk.entry.fields.teamType as any).getValue = jest.fn(() => 'Regular Team');
    (useSDK as jest.Mock).mockReturnValue(sdk);

    const { container } = render(<Sidebar />);
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  describe('teams validation', () => {
    it('shows warning for Discovery Team without Research Theme', async () => {
      const sdk = mockBaseSdk('teams') as unknown as jest.Mocked<SidebarAppSDK>;
      (sdk.entry.fields.teamType as any).getValue = jest.fn(
        () => 'Discovery Team',
      );
      (sdk.entry.fields.researchTheme as any).getValue = jest.fn(() => null);
      (useSDK as jest.Mock).mockReturnValue(sdk);

      render(<Sidebar />);
      await waitFor(() => {
        expect(
          screen.getByText(TEAM_RESEARCH_THEME_WARNING),
        ).toBeInTheDocument();
      });
    });

    it('navigates to entry when warning is clicked', async () => {
      const sdk = mockBaseSdk('teams') as unknown as jest.Mocked<SidebarAppSDK>;
      (sdk.entry.fields.teamType as any).getValue = jest.fn(
        () => 'Discovery Team',
      );
      (sdk.entry.fields.researchTheme as any).getValue = jest.fn(() => null);
      (useSDK as jest.Mock).mockReturnValue(sdk);

      render(<Sidebar />);
      await waitFor(() => {
        expect(
          screen.getByText(TEAM_RESEARCH_THEME_WARNING),
        ).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText(TEAM_RESEARCH_THEME_WARNING));

      await waitFor(() => {
        expect(sdk.navigator.openEntry).toHaveBeenCalledWith('entry-1', {
          slideIn: false,
        });
      });
    });
  });

  describe('projects validation', () => {
    it.each(['Closed', 'Completed'])(
      'shows warning for %s project without End Date',
      async (status) => {
        const sdk = mockBaseSdk(
          'projects',
        ) as unknown as jest.Mocked<SidebarAppSDK>;
        (sdk.entry.fields.status as any).getValue = jest.fn(() => status);
        (sdk.entry.fields.endDate as any).getValue = jest.fn(() => null);
        (useSDK as jest.Mock).mockReturnValue(sdk);

        render(<Sidebar />);
        await waitFor(() => {
          expect(
            screen.getByText(PROJECT_END_DATE_WARNING),
          ).toBeInTheDocument();
        });
      },
    );

    it('shows warning for Resource Project without Resource Type', async () => {
      const sdk = mockBaseSdk(
        'projects',
      ) as unknown as jest.Mocked<SidebarAppSDK>;
      (sdk.entry.fields.projectType as any).getValue = jest.fn(
        () => 'Resource Project',
      );
      (sdk.entry.fields.resourceType as any).getValue = jest.fn(() => null);
      (useSDK as jest.Mock).mockReturnValue(sdk);

      render(<Sidebar />);
      await waitFor(() => {
        expect(
          screen.getByText(PROJECT_RESOURCE_TYPE_WARNING),
        ).toBeInTheDocument();
      });
    });

    it('displays multiple warnings simultaneously', async () => {
      const sdk = mockBaseSdk(
        'projects',
      ) as unknown as jest.Mocked<SidebarAppSDK>;
      (sdk.entry.fields.status as any).getValue = jest.fn(() => 'Closed');
      (sdk.entry.fields.endDate as any).getValue = jest.fn(() => null);
      (sdk.entry.fields.projectType as any).getValue = jest.fn(
        () => 'Resource Project',
      );
      (sdk.entry.fields.resourceType as any).getValue = jest.fn(() => null);
      (useSDK as jest.Mock).mockReturnValue(sdk);

      render(<Sidebar />);
      await waitFor(() => {
        expect(screen.getByText(PROJECT_END_DATE_WARNING)).toBeInTheDocument();
        expect(
          screen.getByText(PROJECT_RESOURCE_TYPE_WARNING),
        ).toBeInTheDocument();
      });
    });
  });
});
