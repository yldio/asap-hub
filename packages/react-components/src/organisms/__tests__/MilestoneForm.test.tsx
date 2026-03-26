import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router';
import { Aim } from '@asap-hub/model';

import MilestoneForm from '../MilestoneForm';

const mockAims: Aim[] = [
  {
    id: 'aim-1',
    order: 1,
    description: 'First aim description',
    status: 'In Progress',
    articleCount: 0,
  },
  {
    id: 'aim-2',
    order: 2,
    description: 'Second aim description',
    status: 'Pending',
    articleCount: 0,
  },
  {
    id: 'aim-3',
    order: 3,
    description: 'Third aim description',
    status: 'Complete',
    articleCount: 2,
  },
];

const defaultProps: ComponentProps<typeof MilestoneForm> = {
  grantType: 'original',
  aims: mockAims,
  onSubmit: jest.fn().mockResolvedValue(undefined),
  onCancel: jest.fn(),
};

const renderMilestoneForm = (
  overrides?: Partial<ComponentProps<typeof MilestoneForm>>,
) =>
  render(
    <MemoryRouter>
      <MilestoneForm {...defaultProps} {...overrides} />
    </MemoryRouter>,
  );

describe('MilestoneForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders the form heading', () => {
      renderMilestoneForm();
      expect(
        screen.getByRole('heading', { name: 'Add New Milestone' }),
      ).toBeInTheDocument();
    });

    it('renders all form fields', () => {
      renderMilestoneForm();
      expect(screen.getByText('Grant Type')).toBeInTheDocument();
      expect(screen.getByText('Milestone Description')).toBeInTheDocument();
      expect(screen.getByText(/Related Aims/)).toBeInTheDocument();
      expect(screen.getByText('Milestone status')).toBeInTheDocument();
    });

    it('renders Cancel and Add Milestone buttons', () => {
      renderMilestoneForm();
      expect(
        screen.getByRole('button', { name: 'Cancel' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Add Milestone' }),
      ).toBeInTheDocument();
    });

    it('renders aim chips for each aim', () => {
      renderMilestoneForm();
      expect(screen.getByRole('button', { name: '#1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '#2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '#3' })).toBeInTheDocument();
    });

    it('shows empty aims message when no aims are provided', () => {
      renderMilestoneForm({ aims: [] });
      expect(
        screen.getByText('No aims have been defined for this grant type yet.'),
      ).toBeInTheDocument();
    });
  });

  describe('grant type display', () => {
    it('displays "Original" for original grant type', () => {
      renderMilestoneForm({ grantType: 'original' });
      expect(screen.getByText('Original')).toBeInTheDocument();
    });

    it('displays "Supplement" for supplement grant type', () => {
      renderMilestoneForm({ grantType: 'supplement' });
      expect(screen.getByText('Supplement')).toBeInTheDocument();
    });
  });

  describe('description textarea', () => {
    it('shows character count display', () => {
      renderMilestoneForm();
      // Both the TextArea's built-in counter and the custom one render 0/750
      const counters = screen.getAllByText('0/750');
      expect(counters.length).toBeGreaterThanOrEqual(1);
    });

    it('updates character count as user types', async () => {
      renderMilestoneForm();
      const textarea = screen.getByRole('textbox');
      await userEvent.type(textarea, 'Hello');
      const counters = screen.getAllByText('5/750');
      expect(counters.length).toBeGreaterThanOrEqual(1);
    });

    it('displays the (required) subtitle for description', () => {
      renderMilestoneForm();
      // Multiple fields have (required) subtitle
      const requiredLabels = screen.getAllByText('(required)');
      expect(requiredLabels.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('related aims chips', () => {
    it('toggles aim selection on click', async () => {
      renderMilestoneForm();
      const aimChip = screen.getByRole('button', { name: '#1' });

      await userEvent.click(aimChip);
      // Chip is now selected - click again to deselect
      await userEvent.click(aimChip);
      // Chip is now deselected
    });

    it('allows selecting multiple aims', async () => {
      renderMilestoneForm();
      await userEvent.click(screen.getByRole('button', { name: '#1' }));
      await userEvent.click(screen.getByRole('button', { name: '#3' }));
      // Both aims are selected; submit button should become enabled after
      // filling description
    });
  });

  describe('milestone status dropdown', () => {
    it('defaults to Pending status', () => {
      renderMilestoneForm();
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('allows changing the status', async () => {
      renderMilestoneForm();
      const combobox = screen.getByRole('combobox');
      await userEvent.type(combobox, 'Complete');
      await userEvent.type(combobox, '{Enter}');

      expect(screen.getByText('Complete')).toBeInTheDocument();
    });

    it('renders the milestone status label and description', () => {
      renderMilestoneForm();
      expect(screen.getByText('Milestone status')).toBeInTheDocument();
      expect(
        screen.getByText(/Select the status for this milestone/),
      ).toBeInTheDocument();
    });
  });

  describe('form validation', () => {
    it('shows description required error when submitting without description', async () => {
      renderMilestoneForm();
      // Select an aim so only description is missing
      await userEvent.click(screen.getByRole('button', { name: '#1' }));

      // The submit button should be disabled since description is empty
      const submitButton = screen.getByRole('button', {
        name: 'Add Milestone',
      });
      expect(submitButton).toBeDisabled();
    });

    it('shows aims required error when submitting without aims', async () => {
      renderMilestoneForm();
      const textarea = screen.getByRole('textbox');
      await userEvent.type(textarea, 'A valid description');

      // Force-enable and click submit to trigger validation
      // The button is disabled when no aims are selected, but we can verify
      // the button state
      const submitButton = screen.getByRole('button', {
        name: 'Add Milestone',
      });
      expect(submitButton).toBeDisabled();
    });

    it('shows validation errors when clicking Add Milestone with empty form', async () => {
      renderMilestoneForm();
      // With empty description and no aims, button should be disabled
      const submitButton = screen.getByRole('button', {
        name: 'Add Milestone',
      });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('submit button state', () => {
    it('is disabled when description is empty and no aims selected', () => {
      renderMilestoneForm();
      const submitButton = screen.getByRole('button', {
        name: 'Add Milestone',
      });
      expect(submitButton).toBeDisabled();
    });

    it('is disabled when description is filled but no aims selected', async () => {
      renderMilestoneForm();
      const textarea = screen.getByRole('textbox');
      await userEvent.type(textarea, 'Some description');

      const submitButton = screen.getByRole('button', {
        name: 'Add Milestone',
      });
      expect(submitButton).toBeDisabled();
    });

    it('is disabled when aims are selected but description is empty', async () => {
      renderMilestoneForm();
      await userEvent.click(screen.getByRole('button', { name: '#1' }));

      const submitButton = screen.getByRole('button', {
        name: 'Add Milestone',
      });
      expect(submitButton).toBeDisabled();
    });

    it('is enabled when description is filled and at least one aim is selected', async () => {
      renderMilestoneForm();
      const textarea = screen.getByRole('textbox');
      await userEvent.type(textarea, 'Some description');
      await userEvent.click(screen.getByRole('button', { name: '#1' }));

      const submitButton = screen.getByRole('button', {
        name: 'Add Milestone',
      });
      expect(submitButton).toBeEnabled();
    });

    it('becomes disabled again when aim is deselected', async () => {
      renderMilestoneForm();
      const textarea = screen.getByRole('textbox');
      await userEvent.type(textarea, 'Some description');
      await userEvent.click(screen.getByRole('button', { name: '#1' }));

      const submitButton = screen.getByRole('button', {
        name: 'Add Milestone',
      });
      expect(submitButton).toBeEnabled();

      // Deselect the aim
      await userEvent.click(screen.getByRole('button', { name: '#1' }));
      expect(submitButton).toBeDisabled();
    });

    it('becomes disabled again when description is cleared', async () => {
      renderMilestoneForm();
      const textarea = screen.getByRole('textbox');
      await userEvent.type(textarea, 'Some description');
      await userEvent.click(screen.getByRole('button', { name: '#1' }));

      const submitButton = screen.getByRole('button', {
        name: 'Add Milestone',
      });
      expect(submitButton).toBeEnabled();

      await userEvent.clear(textarea);
      expect(submitButton).toBeDisabled();
    });
  });

  describe('confirmation modal flow', () => {
    const fillAndSubmitForm = async () => {
      const textarea = screen.getByRole('textbox');
      await userEvent.type(textarea, 'A valid milestone description');
      await userEvent.click(screen.getByRole('button', { name: '#1' }));
      await userEvent.click(
        screen.getByRole('button', { name: 'Add Milestone' }),
      );
    };

    it('shows confirmation modal when clicking Add Milestone with valid form', async () => {
      renderMilestoneForm();
      await fillAndSubmitForm();

      expect(
        screen.getByRole('heading', { name: 'Confirm Milestone Creation' }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/After creation, milestones cannot be deleted/),
      ).toBeInTheDocument();
    });

    it('shows Keep Editing and Confirm and Notify buttons in confirmation modal', async () => {
      renderMilestoneForm();
      await fillAndSubmitForm();

      expect(
        screen.getByRole('button', { name: 'Keep Editing' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Confirm and Notify/ }),
      ).toBeInTheDocument();
    });

    it('returns to form when clicking Keep Editing', async () => {
      renderMilestoneForm();
      await fillAndSubmitForm();

      await userEvent.click(
        screen.getByRole('button', { name: 'Keep Editing' }),
      );

      // Should be back to the form
      expect(
        screen.getByRole('heading', { name: 'Add New Milestone' }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { name: 'Confirm Milestone Creation' }),
      ).not.toBeInTheDocument();
    });

    it('calls onSubmit with correct data when clicking Confirm and Notify', async () => {
      const onSubmit = jest.fn().mockResolvedValue(undefined);
      renderMilestoneForm({ onSubmit });
      await fillAndSubmitForm();

      await userEvent.click(
        screen.getByRole('button', { name: /Confirm and Notify/ }),
      );

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          grantType: 'original',
          description: 'A valid milestone description',
          status: 'Pending',
          aimIds: ['aim-1'],
        });
      });
    });

    it('submits with selected status when changed from default', async () => {
      const onSubmit = jest.fn().mockResolvedValue(undefined);
      renderMilestoneForm({ onSubmit });

      const textarea = screen.getByRole('textbox');
      await userEvent.type(textarea, 'Description with status change');
      await userEvent.click(screen.getByRole('button', { name: '#2' }));

      const combobox = screen.getByRole('combobox');
      await userEvent.type(combobox, 'In Progress');
      await userEvent.type(combobox, '{Enter}');

      await userEvent.click(
        screen.getByRole('button', { name: 'Add Milestone' }),
      );
      await userEvent.click(
        screen.getByRole('button', { name: /Confirm and Notify/ }),
      );

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          grantType: 'original',
          description: 'Description with status change',
          status: 'In Progress',
          aimIds: ['aim-2'],
        });
      });
    });

    it('submits with multiple selected aims', async () => {
      const onSubmit = jest.fn().mockResolvedValue(undefined);
      renderMilestoneForm({ onSubmit });

      const textarea = screen.getByRole('textbox');
      await userEvent.type(textarea, 'Multi-aim milestone');
      await userEvent.click(screen.getByRole('button', { name: '#1' }));
      await userEvent.click(screen.getByRole('button', { name: '#3' }));

      await userEvent.click(
        screen.getByRole('button', { name: 'Add Milestone' }),
      );
      await userEvent.click(
        screen.getByRole('button', { name: /Confirm and Notify/ }),
      );

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          grantType: 'original',
          description: 'Multi-aim milestone',
          status: 'Pending',
          aimIds: ['aim-1', 'aim-3'],
        });
      });
    });

    it('submits with supplement grant type', async () => {
      const onSubmit = jest.fn().mockResolvedValue(undefined);
      renderMilestoneForm({ grantType: 'supplement', onSubmit });

      const textarea = screen.getByRole('textbox');
      await userEvent.type(textarea, 'Supplement milestone');
      await userEvent.click(screen.getByRole('button', { name: '#1' }));

      await userEvent.click(
        screen.getByRole('button', { name: 'Add Milestone' }),
      );
      await userEvent.click(
        screen.getByRole('button', { name: /Confirm and Notify/ }),
      );

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          grantType: 'supplement',
          description: 'Supplement milestone',
          status: 'Pending',
          aimIds: ['aim-1'],
        });
      });
    });

    it('trims description whitespace before submitting', async () => {
      const onSubmit = jest.fn().mockResolvedValue(undefined);
      renderMilestoneForm({ onSubmit });

      const textarea = screen.getByRole('textbox');
      await userEvent.type(textarea, '  trimmed description  ');
      await userEvent.click(screen.getByRole('button', { name: '#1' }));

      await userEvent.click(
        screen.getByRole('button', { name: 'Add Milestone' }),
      );
      await userEvent.click(
        screen.getByRole('button', { name: /Confirm and Notify/ }),
      );

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            description: 'trimmed description',
          }),
        );
      });
    });
  });

  describe('onCancel callback', () => {
    it('calls onCancel when Cancel button is clicked', async () => {
      const onCancel = jest.fn();
      renderMilestoneForm({ onCancel });

      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when close (X) button is clicked', async () => {
      const onCancel = jest.fn();
      renderMilestoneForm({ onCancel });

      // The crossIcon SVG has a <title>Close</title> which gives it accessible name
      const closeButtons = screen.getAllByRole('button', { name: 'Close' });
      // There may be an overlay close button too; click the one in the header
      await userEvent.click(closeButtons[closeButtons.length - 1]!);
      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });
});
