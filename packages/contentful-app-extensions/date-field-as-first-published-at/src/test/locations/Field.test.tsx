import '@testing-library/jest-dom';
import React, { useState } from 'react';
import Field from '../../locations/Field';
import { render, screen, waitFor } from '@testing-library/react';

import { useSDK, useFieldValue } from '@contentful/react-apps-toolkit';

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: jest.fn(),
  useFieldValue: jest.fn(),
}));

beforeEach(() => {
  (useFieldValue as jest.Mock).mockImplementation(() => {
    return useState('2024-01-01T08:08:00.000Z');
  });
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('Field component', () => {
  it('updates to current timestamp if entry has not been published', async () => {
    (useSDK as jest.Mock).mockImplementation(() => ({
      entry: {
        getSys: () => ({}),
      },
    }));
    render(<Field />);
    expect(screen.getByText(new Date().toISOString())).toBeInTheDocument();
  });

  it('does not update to current timestamp if entry has been published', async () => {
    (useSDK as jest.Mock).mockImplementation(() => ({
      entry: {
        getSys: () => ({ firstPublishedAt: '2024-03-01T08:08:00.000Z' }),
      },
    }));
    render(<Field />);
    expect(screen.getByText('2024-01-01T08:08:00.000Z')).toBeInTheDocument();
  });
});
