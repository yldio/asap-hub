import { MilestoneStatus } from '@asap-hub/model';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MilestoneStatusDropdown from '../MilestoneStatusDropdown';

describe('MilestoneStatusDropdown', () => {
  it('renders an editable trigger for Pending when canEdit is true', () => {
    render(
      <MilestoneStatusDropdown status="Pending" canEdit onChange={jest.fn()} />,
    );
    expect(
      screen.getByRole('button', { name: /Change status/i }),
    ).toBeInTheDocument();
  });

  it('renders an editable trigger for In Progress when canEdit is true', () => {
    render(
      <MilestoneStatusDropdown
        status="In Progress"
        canEdit
        onChange={jest.fn()}
      />,
    );
    expect(
      screen.getByRole('button', { name: /Change status/i }),
    ).toBeInTheDocument();
  });

  it('renders a read-only pill for Complete even when canEdit is true', () => {
    render(
      <MilestoneStatusDropdown
        status="Complete"
        canEdit
        onChange={jest.fn()}
      />,
    );
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Change status/i }),
    ).not.toBeInTheDocument();
  });

  it('renders a read-only pill for Terminated even when canEdit is true', () => {
    render(
      <MilestoneStatusDropdown
        status="Terminated"
        canEdit
        onChange={jest.fn()}
      />,
    );
    expect(screen.getByText('Terminated')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Change status/i }),
    ).not.toBeInTheDocument();
  });

  it('renders a read-only pill when canEdit is false', () => {
    render(<MilestoneStatusDropdown status="Pending" canEdit={false} />);
    expect(
      screen.queryByRole('button', { name: /Change status/i }),
    ).not.toBeInTheDocument();
  });

  it('opens the menu, lists default options for Pending, and calls onChange', async () => {
    const onChange = jest.fn();
    render(
      <MilestoneStatusDropdown status="Pending" canEdit onChange={onChange} />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: /Change status/i }),
    );
    expect(
      screen.getByRole('option', { name: /In Progress/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: /Complete/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: /Terminated/i }),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('option', { name: /Complete/i }));
    expect(onChange).toHaveBeenCalledWith('Complete');
  });

  it('lists default options for In Progress', async () => {
    render(
      <MilestoneStatusDropdown
        status="In Progress"
        canEdit
        onChange={jest.fn()}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: /Change status/i }),
    );
    expect(
      screen.getByRole('option', { name: /Complete/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: /Terminated/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: /Pending/i }),
    ).toBeInTheDocument();
  });

  it('shows a spinner instead of the chevron and disables the trigger when isPending is true', async () => {
    const onChange = jest.fn();
    render(
      <MilestoneStatusDropdown
        status="Pending"
        canEdit
        isPending
        onChange={onChange}
      />,
    );
    const trigger = screen.getByRole('button', { name: /Updating status/i });
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByTestId('milestone-status-spinner')).toBeInTheDocument();

    await userEvent.click(trigger);
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes the menu when clicking outside of it', async () => {
    render(
      <div>
        <MilestoneStatusDropdown
          status="Pending"
          canEdit
          onChange={jest.fn()}
        />
        <button type="button">Outside</button>
      </div>,
    );
    await userEvent.click(
      screen.getByRole('button', { name: /Change status/i }),
    );
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByRole('button', { name: 'Outside' }));
    await waitFor(() =>
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument(),
    );
  });

  it('keeps the menu open when mousing down inside the menu or on the trigger', async () => {
    render(
      <MilestoneStatusDropdown status="Pending" canEdit onChange={jest.fn()} />,
    );
    const trigger = screen.getByRole('button', { name: /Change status/i });
    await userEvent.click(trigger);
    const listbox = screen.getByRole('listbox');
    fireEvent.mouseDown(listbox);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.mouseDown(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('falls back to the neutral accent for an unrecognised status', () => {
    render(
      <MilestoneStatusDropdown
        status={'Unknown' as MilestoneStatus}
        canEdit={false}
      />,
    );
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('closes the menu after selecting an option', async () => {
    render(
      <MilestoneStatusDropdown status="Pending" canEdit onChange={jest.fn()} />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: /Change status/i }),
    );
    await userEvent.click(screen.getByRole('option', { name: /In Progress/i }));
    await waitFor(() =>
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument(),
    );
  });
});
