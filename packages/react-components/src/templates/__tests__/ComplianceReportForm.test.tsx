import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { ComponentProps } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import userEvent from '@testing-library/user-event';
import ComplianceReportForm from '../ComplianceReportForm';

beforeEach(() => {
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
    <StaticRouter location="/">
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
    status: 'Addendum Required',
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
    <StaticRouter location="/">
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

  // Trigger validation by blurring fields with initial values
  const urlInput = screen.getByRole('textbox', { name: /url/i });
  fireEvent.focus(urlInput);
  fireEvent.blur(urlInput);

  const editor = screen.getByTestId('editor');
  fireEvent.focus(editor);
  fireEvent.blur(editor);

  // Select status
  const statusLabel = screen.getByLabelText(/Status/i);

  // Find the dropdown button - it's the element returned by getByLabelText
  const statusButton = statusLabel as HTMLElement;

  await userEvent.click(statusButton);

  await act(async () => {
    await userEvent.click(screen.getByText(/Addendum Required/i));
  });

  // Manually blur the dropdown button to trigger validation in onBlur mode
  await act(async () => {
    fireEvent.blur(statusButton);
  });

  // Wait for all validations to complete and form to become valid
  const shareButton = screen.getByRole('button', { name: /Share/i });
  await waitFor(() => expect(shareButton).toBeEnabled(), { timeout: 3000 });

  await userEvent.click(shareButton);

  const confirmButton = screen.getByRole('button', {
    name: /Share Compliance Report/i,
  });
  await userEvent.click(confirmButton);

  await waitFor(() => {
    expect(onSave).toHaveBeenCalledWith({
      url: 'http://example.com',
      description: 'manuscript description',
      manuscriptVersionId: defaultProps.manuscriptVersionId,
      status: 'Addendum Required',
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
    <StaticRouter location="/">
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

  // Trigger validation by blurring fields with initial values
  const urlInput = screen.getByRole('textbox', { name: /url/i });
  fireEvent.focus(urlInput);
  fireEvent.blur(urlInput);

  const editor = screen.getByTestId('editor');
  fireEvent.focus(editor);
  fireEvent.blur(editor);

  // Select status
  const statusLabel = screen.getByLabelText(/Status/i);

  // Find the dropdown button - it's the element returned by getByLabelText
  const statusButton = statusLabel as HTMLElement;

  await userEvent.click(statusButton);

  await act(async () => {
    await userEvent.click(screen.getByText(/Addendum Required/i));
  });

  // Manually blur the dropdown button to trigger validation in onBlur mode
  await act(async () => {
    fireEvent.blur(statusButton);
  });

  // Wait for all validations to complete and form to become valid
  const shareButton = screen.getByRole('button', { name: /Share/i });
  await waitFor(() => expect(shareButton).toBeEnabled(), { timeout: 3000 });

  await userEvent.click(shareButton);

  const confirmButton = screen.getByRole('button', {
    name: /Share Compliance Report/i,
  });
  await userEvent.click(confirmButton);

  await waitFor(() => {
    expect(onSave).toHaveBeenCalledWith({
      url: 'http://example.com',
      description: 'manuscript description',
      manuscriptVersionId: defaultProps.manuscriptVersionId,
      manuscriptId: 'manuscript-id',
      status: 'Addendum Required',
    });
    expect(setManuscript).not.toHaveBeenCalled();
  });
});

it('displays error message when url is missing', async () => {
  render(
    <StaticRouter location="/">
      <ComplianceReportForm {...defaultProps} />
    </StaticRouter>,
  );

  const input = screen.getByRole('textbox', { name: /url/i });

  // Blur empty field to trigger validation
  await act(async () => {
    fireEvent.blur(input);
  });

  await waitFor(() => {
    expect(
      screen.getAllByText(/Please enter a url/i).length,
    ).toBeGreaterThanOrEqual(1);
  });

  // Type a valid URL and blur to trigger revalidation
  await act(async () => {
    await userEvent.type(input, 'http://example.com');
  });
  fireEvent.blur(input);

  await waitFor(() => {
    expect(screen.queryByText(/Please enter a url/i)).toBeNull();
  });
});

it('displays error message when description is missing', async () => {
  const { getByTestId, queryByText, getAllByText } = render(
    <StaticRouter location="/">
      <ComplianceReportForm {...defaultProps} />
    </StaticRouter>,
  );

  const editor = await waitFor(() => getByTestId('editor'));

  // Blur empty editor to trigger validation
  await act(async () => {
    fireEvent.blur(editor);
  });

  await waitFor(() => {
    expect(
      getAllByText(/Please enter a description/i).length,
    ).toBeGreaterThanOrEqual(1);
  });

  // Type description using fireEvent.input (required for Lexical editor)
  await act(async () => {
    await userEvent.click(editor);
    await userEvent.tab();
    fireEvent.input(editor, { data: 'manuscript description' });
  });

  // Wait for Lexical's onChange to propagate to react-hook-form
  // then blur to trigger validation with the updated value
  await act(async () => {
    fireEvent.blur(editor);
  });

  await waitFor(
    () => {
      expect(queryByText(/Please enter a description/i)).toBeNull();
    },
    { timeout: 3000 },
  );
});

it('should go back when cancel button is clicked', async () => {
  const router = createMemoryRouter(
    [
      {
        path: '/form',
        element: <ComplianceReportForm {...defaultProps} />,
      },
      {
        path: '/another-url',
        element: <div>Another page</div>,
      },
    ],
    { initialEntries: ['/another-url', '/form'], initialIndex: 1 },
  );

  const { getByRole } = render(<RouterProvider router={router} />);

  const cancelButton = getByRole('button', {
    name: /cancel/i,
  });
  await userEvent.click(cancelButton);

  const confirmCancellationButton = getByRole('button', {
    name: /cancel compliance report sharing/i,
  });

  await userEvent.click(confirmCancellationButton);

  await waitFor(() => {
    expect(router.state.location.pathname).toBe('/another-url');
  });
});

it('should dismiss confirmation modal when Keep Editing button is clicked', async () => {
  const { getByText, getByRole, queryByText } = render(
    <StaticRouter location="/">
      <ComplianceReportForm {...defaultProps} />
    </StaticRouter>,
  );

  const cancelButton = getByRole('button', {
    name: /cancel/i,
  });
  await userEvent.click(cancelButton);

  expect(getByText(/Cancel sharing of compliance report?/i)).toBeVisible();

  const keepEditingButton = getByRole('button', {
    name: /keep editing/i,
  });
  await userEvent.click(keepEditingButton);

  expect(
    queryByText(/Cancel sharing of compliance report?/i),
  ).not.toBeInTheDocument();
});

it('should focus the Lexical editor when pressing Tab on the URL input', async () => {
  render(
    <StaticRouter location="/">
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
    <StaticRouter location="/">
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

  // Trigger validation by blurring fields with initial values
  const urlInput = screen.getByRole('textbox', { name: /url/i });
  fireEvent.focus(urlInput);
  fireEvent.blur(urlInput);

  const editor = screen.getByTestId('editor');
  fireEvent.focus(editor);
  fireEvent.blur(editor);

  // Select status
  const statusLabel = screen.getByLabelText(/Status/i);

  // Find the dropdown button - it's the element returned by getByLabelText
  const statusButton = statusLabel as HTMLElement;

  await userEvent.click(statusButton);

  await act(async () => {
    await userEvent.click(screen.getByText(/Compliant/i));
  });

  // Manually blur the dropdown button to trigger validation in onBlur mode
  await act(async () => {
    fireEvent.blur(statusButton);
  });

  // Wait for all validations to complete and form to become valid
  const shareButton = screen.getByRole('button', { name: /Share/i });
  await waitFor(() => expect(shareButton).toBeEnabled(), { timeout: 3000 });

  await userEvent.click(shareButton);

  const compliantModal = screen.getByText(
    /Share compliance report and set status to compliant\?/i,
  );

  expect(compliantModal).toBeInTheDocument();
});

it('should show "closed (other)" modal when compliant status is selected', async () => {
  render(
    <StaticRouter location="/">
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

  // Trigger validation by blurring fields with initial values
  const urlInput = screen.getByRole('textbox', { name: /url/i });
  fireEvent.focus(urlInput);
  fireEvent.blur(urlInput);

  const editor = screen.getByTestId('editor');
  fireEvent.focus(editor);
  fireEvent.blur(editor);

  // Select status
  const statusLabel = screen.getByLabelText(/Status/i);

  // Find the dropdown button - it's the element returned by getByLabelText
  const statusButton = statusLabel as HTMLElement;

  await userEvent.click(statusButton);

  await act(async () => {
    await userEvent.click(screen.getByText(/Closed \(other\)/i));
  });

  // Manually blur the dropdown button to trigger validation in onBlur mode
  await act(async () => {
    fireEvent.blur(statusButton);
  });

  // Wait for all validations to complete and form to become valid
  const shareButton = screen.getByRole('button', { name: /Share/i });
  await waitFor(() => expect(shareButton).toBeEnabled(), { timeout: 3000 });

  await userEvent.click(shareButton);

  const compliantModal = screen.getByText(
    /Share compliance report and set status to closed \(other\)\?/i,
  );

  expect(compliantModal).toBeInTheDocument();
});
