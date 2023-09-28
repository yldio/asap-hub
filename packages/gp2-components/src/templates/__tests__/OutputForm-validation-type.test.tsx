import { fireEvent, render, screen } from '@testing-library/react';

import { StaticRouter } from 'react-router-dom';
import OutputForm from '../OutputForm';

describe('OutputForm', () => {
  const defaultProps = {
    shareOutput: jest.fn(),
    documentType: 'Procedural Form' as const,
    entityType: 'workingGroup' as const,
    getRelatedOutputSuggestions: jest.fn(),
    tagSuggestions: [],
    cohortSuggestions: [],
  };

  describe('validation', () => {
    it('shows error message for missing value type', () => {
      render(<OutputForm {...defaultProps} documentType="Article" />, {
        wrapper: StaticRouter,
      });

      const input = screen.getByLabelText(/^type/i);
      fireEvent.focusOut(input);
      expect(screen.getByText('Please fill out this field.')).toBeVisible();
    });
  });
});
