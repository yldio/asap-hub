import { createManuscriptResponse } from '@asap-hub/fixtures';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import ManuscriptCard from '../ManuscriptCard';

const props: ComponentProps<typeof ManuscriptCard> = {
  ...createManuscriptResponse(),
  teamIdCode: 'TI1',
  grantId: '000123',
  isComplianceReviewer: false,
};

it('displays manuscript version card when expanded', () => {
  const { getByText, queryByText, getByTestId, rerender } = render(
    <ManuscriptCard {...props} />,
  );

  expect(queryByText(/Original Research/i)).not.toBeInTheDocument();

  expect(queryByText(/Preprint/i)).not.toBeInTheDocument();

  userEvent.click(getByTestId('collapsible-button'));

  rerender(
    <ManuscriptCard
      {...props}
      versions={[
        {
          ...props.versions[0]!,
          type: 'Original Research',
          lifecycle: 'Preprint',
        },
      ]}
    />,
  );

  expect(getByText(/Original Research/i)).toBeVisible();
  expect(getByText(/Preprint/i)).toBeVisible();
});

it('displays share compliance report button if user has permission', () => {
  const { queryByRole, getByRole, rerender } = render(
    <ManuscriptCard {...props} />,
  );

  expect(
    queryByRole('button', { name: /Share Compliance Report Icon/i }),
  ).not.toBeInTheDocument();

  rerender(<ManuscriptCard {...props} isComplianceReviewer />);

  expect(
    getByRole('button', { name: /Share Compliance Report Icon/i }),
  ).toBeVisible();
});

it('redirects to compliance report form when user clicks on share compliance report button', () => {
  const history = createMemoryHistory({});
  const { getByRole } = render(
    <Router history={history}>
      <Route path="">
        <ManuscriptCard {...props} isComplianceReviewer />
      </Route>
    </Router>,
  );

  userEvent.click(
    getByRole('button', { name: /Share Compliance Report Icon/i }),
  );

  expect(history.location.pathname).toBe(
    `/network/teams/${props.teamId}/workspace/create-compliance-report/${props.id}`,
  );
});

it('allows to change the manuscript status if isComplianceReviewer is true', () => {
  const { getByRole, getByTestId } = render(
    <ManuscriptCard {...props} isComplianceReviewer />,
  );

  const statusButton = getByTestId('status-button');
  expect(statusButton).toBeEnabled();
  userEvent.click(statusButton);
  userEvent.click(getByRole('button', { name: /Compliant/i }));
  expect(statusButton.textContent).toContain('Compliant');
});

it('does not allow to change the manuscript status if isComplianceReviewer is false', () => {
  const { getByTestId } = render(<ManuscriptCard {...props} />);

  const statusButton = getByTestId('status-button');
  expect(statusButton).toBeDisabled();
});
