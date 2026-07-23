import { render } from '@testing-library/react';
import { StaticRouter } from 'react-router';
import ResearchOutputForm from '../../ResearchOutputForm';
import {
  defaultProps,
  defaultAvailableActions,
} from '../../test-utils/research-output-form';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation();
});

it('displays Save Draft button when canSaveDraft action is available', () => {
  const { getByRole, queryByRole, rerender } = render(
    <StaticRouter location="/">
      <ResearchOutputForm
        {...defaultProps}
        availableActions={{ ...defaultAvailableActions, canSaveDraft: false }}
      />
    </StaticRouter>,
  );
  expect(
    queryByRole('button', { name: /Save Draft/i }),
  ).not.toBeInTheDocument();
  rerender(
    <StaticRouter location="/">
      <ResearchOutputForm
        {...defaultProps}
        availableActions={{ ...defaultAvailableActions, canSaveDraft: true }}
      />
    </StaticRouter>,
  );
  expect(getByRole('button', { name: /Save Draft/i })).toBeVisible();
});
