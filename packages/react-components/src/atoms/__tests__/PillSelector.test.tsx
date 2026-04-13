import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PillSelector from '../PillSelector';

const options = [
  { value: '1', label: 'One' },
  { value: '2', label: 'Two' },
];

describe('PillSelector', () => {
  it('renders all options', () => {
    render(<PillSelector options={options} value={[]} onChange={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'One' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Two' })).toBeInTheDocument();
  });

  it('calls onChange when selecting a pill', async () => {
    const onChange = jest.fn();

    render(<PillSelector options={options} value={[]} onChange={onChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'One' }));

    expect(onChange).toHaveBeenCalledWith(['1']);
  });

  it('adds to existing selection', async () => {
    const onChange = jest.fn();
    render(
      <PillSelector options={options} value={['1']} onChange={onChange} />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Two' }));

    expect(onChange).toHaveBeenCalledWith(['1', '2']);
  });

  it('removes item when clicking an already selected pill', async () => {
    const onChange = jest.fn();

    render(
      <PillSelector options={options} value={['1']} onChange={onChange} />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'One' }));

    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('does not call onChange when disabled', async () => {
    const onChange = jest.fn();

    render(
      <PillSelector
        options={options}
        value={[]}
        onChange={onChange}
        enabled={false}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'One' }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('calls onBlur when a pill loses focus', async () => {
    const onBlur = jest.fn();

    render(
      <PillSelector
        options={options}
        value={[]}
        onChange={jest.fn()}
        onBlur={onBlur}
      />,
    );

    const button = screen.getByRole('button', { name: 'One' });

    await userEvent.click(button);
    await userEvent.tab();

    expect(onBlur).toHaveBeenCalled();
  });
});
