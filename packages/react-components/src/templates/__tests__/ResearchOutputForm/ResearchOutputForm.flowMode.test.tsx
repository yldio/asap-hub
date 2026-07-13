import { InnerToastContext } from '@asap-hub/react-context';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router';
import ResearchOutputForm from '../../ResearchOutputForm';
import { defaultProps } from '../../test-utils/research-output-form';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation();
});

it('displays Save Draft button when canSaveDraft action is available', () => {
  const { getByRole, queryByRole, rerender } = render(
    <StaticRouter location="/">
      <ResearchOutputForm
        {...defaultProps}
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
        availableActions={{ canSaveDraft: true }}
      />
    </StaticRouter>,
  );
  expect(getByRole('button', { name: /Save Draft/i })).toBeVisible();
});

describe('new version confirmation', () => {
  const renderFlowForm = (
    props: Partial<React.ComponentProps<typeof ResearchOutputForm>>,
  ) =>
    render(
      <InnerToastContext.Provider value={jest.fn()}>
        <StaticRouter location="/">
          <ResearchOutputForm
            {...defaultProps}
            availableActions={{ canSaveDraft: false }}
            {...props}
          />
        </StaticRouter>
      </InnerToastContext.Provider>,
    );

  it('shows the confirmation on an add-version flow without relying on versionAction', async () => {
    renderFlowForm({ flowId: 'team-add-version' });
    await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
    expect(
      screen.getByText(/Publish new version for the whole hub?/i),
    ).toBeVisible();
  });

  it('does not show the confirmation when the flow does not require it, even with versionAction set', async () => {
    renderFlowForm({ flowId: 'team-create-manual', versionAction: 'create' });
    await userEvent.click(screen.getByRole('button', { name: /Publish/i }));
    expect(
      screen.queryByText(/Publish new version for the whole hub?/i),
    ).toBeNull();
  });
});
