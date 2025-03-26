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
  jest.spyOn(console, 'error').mockImplementation();
});

const defaultProps = {
  onSave: jest.fn(() => Promise.resolve()),
  onSuccess: jest.fn(),
  setManuscript: jest.fn(),
  manuscriptTitle: 'manuscript title',
  manuscriptVersionId: 'manuscript-version-1',
} as unknown as ComponentProps<typeof ComplianceReportForm>;

it('renders the form', async () => {
  render(
    <StaticRouter>
      <ComplianceReportForm {...defaultProps} />
    </StaticRouter>,
  );
  expect(screen.getByText(/Title of Manuscript/i)).toBeVisible();
  expect(screen.getByRole('button', { name: /Share/i })).toBeVisible();
});

it('data is sent on form submission and calls setManuscript', async () => {
  const onSave = jest.fn().mockResolvedValue({
    complianceReport: {
      id: 'compliance-report-id',
    },
    status: 'Review Compliance Report',
  });

  const initialManuscript = {
    versions: [
      {
        id: 'version-1',
        complianceReport: null,
      },
    ],
  };
  const setManuscript = jest.fn();
  render(
    <StaticRouter>
      <ComplianceReportForm
        {...defaultProps}
        url="http://example.com"
        description="manuscript description"
        setManuscript={setManuscript}
        onSave={onSave}
        manuscriptId="manuscript-id"
      />
    </StaticRouter>,
  );

  userEvent.click(screen.getByLabelText(/Status/i));
  await act(async () => {
    await userEvent.click(screen.getByText(/Review Compliance Report/i));
  });

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
      status: 'Review Compliance Report',
      manuscriptId: 'manuscript-id',
    });
    expect(setManuscript).toHaveBeenCalled();

    const manuscriptUpdater = setManuscript.mock.calls[0][0];
    const updatedManuscript = manuscriptUpdater(initialManuscript);

    expect(updatedManuscript.versions[0].complianceReport).toEqual({
      id: 'compliance-report-id',
    });
  });
});

it('data is sent on form submission without calling setManuscript', async () => {
  const onSave = jest.fn().mockResolvedValue(undefined);
  const setManuscript = jest.fn();

  render(
    <StaticRouter>
      <ComplianceReportForm
        {...defaultProps}
        url="http://example.com"
        description="manuscript description"
        setManuscript={setManuscript}
        onSave={onSave}
        manuscriptId="manuscript-id"
      />
    </StaticRouter>,
  );

  userEvent.click(screen.getByLabelText(/Status/i));
  await act(async () => {
    await userEvent.click(screen.getByText(/Review Compliance Report/i));
  });

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
      manuscriptId: 'manuscript-id',
      status: 'Review Compliance Report',
    });
    expect(setManuscript).not.toHaveBeenCalled();
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
  const { getByTestId, queryByText, getAllByText } = render(
    <StaticRouter>
      <ComplianceReportForm {...defaultProps} />
    </StaticRouter>,
  );

  const editor = await waitFor(() => getByTestId('editor'));

  fireEvent.blur(editor);

  await waitFor(() => {
    expect(
      getAllByText(/Please enter a description/i).length,
    ).toBeGreaterThanOrEqual(1);
  });

  await act(async () => {
    userEvent.click(editor);
    userEvent.tab();
    userEvent.type(editor, 'manuscription description');
    userEvent.tab();
  });

  fireEvent.blur(editor);
  await waitFor(() => {
    expect(queryByText(/Please enter a description/i)).toBeNull();
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

it('should focus the Lexical editor when pressing Tab on the URL input', async () => {
  render(
    <StaticRouter>
      <ComplianceReportForm {...defaultProps} />
    </StaticRouter>,
  );

  const urlInput = screen.getByRole('textbox', { name: /url/i });
  const editor = screen.getByTestId('editor');

  const keyDownEvent = new KeyboardEvent('keydown', {
    key: 'Tab',
    bubbles: true, // Ensure event propagates to parent elements
    cancelable: true,
  });
  jest.spyOn(keyDownEvent, 'preventDefault');

  urlInput.focus();
  fireEvent(urlInput, keyDownEvent);

  await waitFor(() => {
    expect(keyDownEvent.preventDefault).toHaveBeenCalled();
    expect(editor).toHaveFocus();
  });
});

it('should show compliant modal when compliant status is selected', async () => {
  render(
    <StaticRouter>
      <ComplianceReportForm
        {...defaultProps}
        url="http://example.com"
        description="manuscript description"
        setManuscript={jest.fn()}
        onSave={jest.fn()}
        manuscriptId="manuscript-id"
      />
    </StaticRouter>,
  );

  userEvent.click(screen.getByLabelText(/Status/i));
  await act(async () => {
    await userEvent.click(screen.getByText(/Compliant/i));
  });

  const shareButton = screen.getByRole('button', { name: /Share/i });
  await waitFor(() => expect(shareButton).toBeEnabled());

  userEvent.click(shareButton);

  const compliantModal = screen.getByText(
    /Share compliance report and set status to <compliant\/closed \(other\)>\?/i,
  );

  expect(compliantModal).toBeInTheDocument();
});

it('should show "closed (other)" modal when compliant status is selected', async () => {
  render(
    <StaticRouter>
      <ComplianceReportForm
        {...defaultProps}
        url="http://example.com"
        description="manuscript description"
        setManuscript={jest.fn()}
        onSave={jest.fn()}
        manuscriptId="manuscript-id"
      />
    </StaticRouter>,
  );

  userEvent.click(screen.getByLabelText(/Status/i));
  await act(async () => {
    await userEvent.click(screen.getByText(/Closed \(other\)/i));
  });

  const shareButton = screen.getByRole('button', { name: /Share/i });
  await waitFor(() => expect(shareButton).toBeEnabled());

  userEvent.click(shareButton);

  const compliantModal = screen.getByText(
    /Share compliance report and set status to <compliant\/closed \(other\)>\?/i,
  );

  expect(compliantModal).toBeInTheDocument();
});
