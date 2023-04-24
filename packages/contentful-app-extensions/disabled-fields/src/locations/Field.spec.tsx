import React from 'react';
import Field from './Field';
import { render } from '@testing-library/react';

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
    const { getByText } = render(<Field />);

    expect(getByText('Hello World')).toBeInTheDocument();
  });
});
