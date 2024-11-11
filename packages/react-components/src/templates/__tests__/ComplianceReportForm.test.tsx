import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { ComponentProps } from 'react';
import { MemoryRouter, Route, Router, StaticRouter } from 'react-router-dom';
import { createMemoryHistory, History } from 'history';
import userEvent from '@testing-library/user-event';
import ComplianceReportForm from '../ComplianceReportForm';

let history!: History;

beforeEach(() => {
  history = createMemoryHistory();
});

const defaultProps: ComponentProps<typeof ComplianceReportForm> = {
  onSave: jest.fn(() => Promise.resolve()),
  onSuccess: jest.fn(),
  manuscriptTitle: 'manuscript title',
  manuscriptVersionId: 'manuscript-version-1',
};

it('renders the form', async () => {
  render(
    <StaticRouter>
      <ComplianceReportForm {...defaultProps} />
    </StaticRouter>,
  );
  expect(screen.getByText(/Title of Manuscript/i)).toBeVisible();
  expect(screen.getByRole('button', { name: /Share/i })).toBeVisible();
});

it('data is sent on form submission', async () => {
  const onSave = jest.fn();
  render(
    <StaticRouter>
      <ComplianceReportForm
        {...defaultProps}
        url="http://example.com"
        description="manuscript description"
        onSave={onSave}
      />
    </StaticRouter>,
  );

  const shareButton = screen.getByRole('button', { name: /Share/i });
  await waitFor(() => expect(shareButton).toBeEnabled());
  userEvent.click(shareButton);

  const confirmButton = screen.getByRole('button', {
    name: /Share Compliance Report/i,
  });
  userEvent.click(confirmButton);

  await waitFor(() => {
    expect(onSave).toHaveBeenCalledWith({
      url: 'http://example.com',
      description: 'manuscript description',
      manuscriptVersionId: defaultProps.manuscriptVersionId,
    });
  });
});

it('displays error message when url is missing', async () => {
  render(
    <StaticRouter>
      <ComplianceReportForm {...defaultProps} />
    </StaticRouter>,
  );

  const input = screen.getByRole('textbox', { name: /url/i });
  fireEvent.blur(input);

  await waitFor(() => {
    expect(
      screen.getAllByText(/Please enter a url/i).length,
    ).toBeGreaterThanOrEqual(1);
  });

  userEvent.type(input, 'http://example.com');
  fireEvent.blur(input);

  await waitFor(() => {
    expect(screen.queryByText(/Please enter a url/i)).toBeNull();
  });
});

it('displays error message when description is missing', async () => {
  render(
    <StaticRouter>
      <ComplianceReportForm {...defaultProps} />
    </StaticRouter>,
  );

  const input = screen.getByRole('textbox', {
    name: /compliance report description/i,
  });
  fireEvent.blur(input);

  await waitFor(() => {
    expect(
      screen.getAllByText(/Please enter a description/i).length,
    ).toBeGreaterThanOrEqual(1);
  });

  userEvent.type(input, 'manuscription description');
  fireEvent.blur(input);

  await waitFor(() => {
    expect(screen.queryByText(/Please enter a description/i)).toBeNull();
  });
});

it('should go back when cancel button is clicked', () => {
  const { getByRole } = render(
    <MemoryRouter>
      <Router history={history}>
        <Route path="/form">
          <ComplianceReportForm {...defaultProps} />
        </Route>
      </Router>
    </MemoryRouter>,
  );

  history.push('/another-url');
  history.push('/form');

  const cancelButton = getByRole('button', {
    name: /cancel/i,
  });
  userEvent.click(cancelButton);

  const confirmCancellationButton = getByRole('button', {
    name: /cancel compliance report sharing/i,
  });

  act(() => userEvent.click(confirmCancellationButton));
  expect(history.location.pathname).toBe('/another-url');
});

it('should dismiss confirmation modal when Keep Editing button is clicked', () => {
  const { getByText, getByRole, queryByText } = render(
    <StaticRouter>
      <ComplianceReportForm {...defaultProps} />
    </StaticRouter>,
  );

  const cancelButton = getByRole('button', {
    name: /cancel/i,
  });
  userEvent.click(cancelButton);

  expect(getByText(/Cancel sharing of compliance report?/i)).toBeVisible();

  const keepEditingButton = getByRole('button', {
    name: /keep editing/i,
  });
  userEvent.click(keepEditingButton);

  expect(
    queryByText(/Cancel sharing of compliance report?/i),
  ).not.toBeInTheDocument();
});
