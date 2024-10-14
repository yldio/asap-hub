import { render, screen, waitFor } from '@testing-library/react';
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
  const shareButton = screen.getByRole('button', { name: /Share/i });

  userEvent.click(shareButton);

  await waitFor(() => {
    expect(shareButton).toBeEnabled();
  });
  expect(
    screen.getAllByText(/Please enter a url/i).length,
  ).toBeGreaterThanOrEqual(1);

  userEvent.type(input, 'http://example.com');

  userEvent.click(shareButton);

  await waitFor(() => {
    expect(shareButton).toBeEnabled();
  });
  expect(screen.queryByText(/Please enter a url/i)).toBeNull();
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
  const shareButton = screen.getByRole('button', { name: /Share/i });

  userEvent.click(shareButton);

  await waitFor(() => {
    expect(shareButton).toBeEnabled();
  });
  expect(
    screen.getAllByText(/Please enter a description/i).length,
  ).toBeGreaterThanOrEqual(1);

  userEvent.type(input, 'manuscription description');

  userEvent.click(shareButton);

  await waitFor(() => {
    expect(shareButton).toBeEnabled();
  });
  expect(screen.queryByText(/Please enter a description/i)).toBeNull();
});

it('should go back when cancel button is clicked', () => {
  const { getByText } = render(
    <Router history={history}>
      <Route path="/form">
        <ComplianceReportForm {...defaultProps} />
      </Route>
    </Router>,
    { wrapper: MemoryRouter },
  );

  history.push('/another-url');
  history.push('/form');

  const cancelButton = getByText(/cancel/i);
  expect(cancelButton).toBeInTheDocument();
  userEvent.click(cancelButton);

  expect(history.location.pathname).toBe('/another-url');
});
