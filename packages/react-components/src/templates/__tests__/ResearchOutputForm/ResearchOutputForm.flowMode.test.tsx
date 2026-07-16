import { render } from '@testing-library/react';
import { StaticRouter } from 'react-router';
import ResearchOutputForm from '../../ResearchOutputForm';
import { defaultProps } from '../../test-utils/research-output-form';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation();
});

it('displays Save Draft button in flow mode when canSaveDraft action is available', () => {
  const { getByRole, queryByRole, rerender } = render(
    <StaticRouter location="/">
      <ResearchOutputForm
        {...defaultProps}
        behaviorMode={'flow'}
        availableActions={{ canSaveDraft: false }}
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
        behaviorMode={'flow'}
        availableActions={{ canSaveDraft: true }}
      />
    </StaticRouter>,
  );
  expect(getByRole('button', { name: /Save Draft/i })).toBeVisible();
});
