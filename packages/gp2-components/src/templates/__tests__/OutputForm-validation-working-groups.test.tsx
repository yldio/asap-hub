import { fireEvent, render, screen } from '@testing-library/react';

import { StaticRouter } from 'react-router-dom';
import OutputForm from '../OutputForm';

describe('OutputForm', () => {
  const defaultProps = {
    shareOutput: jest.fn(),
    documentType: 'Procedural Form' as const,
    entityType: 'workingGroup' as const,
    keywordSuggestions: [],
    cohortSuggestions: [],
    workingGroupSuggestions: [],
    projectSuggestions: [],
    mainEntityId: '12',
    getRelatedOutputSuggestions: jest.fn(),
  };

  describe('validation', () => {
    it('shows error message for missing value working group', () => {
      render(<OutputForm {...defaultProps} documentType="Article" />, {
        wrapper: StaticRouter,
      });

      const input = screen.getByLabelText(/working groups/i);

      fireEvent.focusOut(input);
      expect(screen.getByText('Please fill out this field.')).toBeVisible();
    });
  });
});
