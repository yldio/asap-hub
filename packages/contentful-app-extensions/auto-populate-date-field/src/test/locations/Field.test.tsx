import '@testing-library/jest-dom';
import React, { useState } from 'react';
import Field from '../../locations/Field';
import { render, screen, waitFor } from '@testing-library/react';

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

describe('Field component', () => {
  beforeEach(() => {
    (useSDK as jest.Mock).mockImplementation(() => ({
      entry: {
        getSys: () => ({ createdAt: '2023-10-11T16:05:00.000Z' }),
      },
    }));
  });

  it('enables automatic resizing', async () => {
    (useFieldValue as jest.Mock).mockImplementation(() => {
      return useState(undefined);
    });
    render(<Field />);
    await waitFor(() => {
      expect(useAutoResizer).toHaveBeenCalled();
    });
  });

  it('sets field value to the entry`s createdAt if undefined', () => {
    (useFieldValue as jest.Mock).mockImplementation(() => {
      return useState(undefined);
    });
    render(<Field />);
    expect(screen.getByText('2023-10-11T16:05:00.000Z')).toBeInTheDocument();
  });

  it('does not sets field value to the entry`s createdAt when value already defined', () => {
    (useFieldValue as jest.Mock).mockImplementation(() => {
      return useState('2020-10-11T16:05:00.000Z');
    });
    render(<Field />);
    expect(screen.getByText('2020-10-11T16:05:00.000Z')).toBeInTheDocument();
  });
});
