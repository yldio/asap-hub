import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LabeledPillSelector from '../LabeledPillSelector';

const options = [
  { value: '1', label: 'One' },
  { value: '2', label: 'Two' },
];

describe('LabeledPillSelector', () => {
  it('renders title, subtitle and description', () => {
    render(
      <LabeledPillSelector
        title="Related Aims"
        subtitle="(required)"
        description="Select aims"
        options={options}
        value={[]}
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByText('Related Aims')).toBeInTheDocument();
    expect(screen.getByText('(required)')).toBeInTheDocument();
    expect(screen.getByText('Select aims')).toBeInTheDocument();
  });

  it('renders pill options', () => {
    render(
      <LabeledPillSelector
        title="Test"
        options={options}
        value={[]}
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'One' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Two' })).toBeInTheDocument();
  });

  it('calls onChange when a pill is selected', async () => {
    const onChange = jest.fn();

    render(
      <LabeledPillSelector
        title="Test"
        options={options}
        value={[]}
        onChange={onChange}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'One' }));

    expect(onChange).toHaveBeenCalledWith(['1']);
  });

  it('displays validation message when provided', () => {
    render(
      <LabeledPillSelector
        title="Test"
        options={options}
        value={[]}
        onChange={jest.fn()}
        validationMessage="This field is required"
      />,
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('does not display validation message when not provided', () => {
    render(
      <LabeledPillSelector
        title="Test"
        options={options}
        value={[]}
        onChange={jest.fn()}
      />,
    );

    expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
  });

  it('disables interaction when enabled is false', async () => {
    const onChange = jest.fn();

    render(
      <LabeledPillSelector
        title="Test"
        options={options}
        value={[]}
        onChange={onChange}
        enabled={false}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'One' }));

    expect(onChange).not.toHaveBeenCalled();
  });
});
