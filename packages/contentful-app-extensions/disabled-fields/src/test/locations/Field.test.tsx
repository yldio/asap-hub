import React from 'react';
import Field from '../../locations/Field';
import { render, screen } from '@testing-library/react';

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: () => ({
    field: {
      getValue: jest.fn(() => 'Hello World'),
    },
    window: {
      startAutoResizer: jest.fn(),
    },
  }),
}));

describe('Field component', () => {
  it('displays field text', () => {
    render(<Field />);

    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
