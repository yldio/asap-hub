import { render, screen } from '@testing-library/react';
import LabsList from '../LabsList';

describe('LabsList', () => {
  it('renders nothing for empty labs', () => {
    const { container } = render(<LabsList labs={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders single lab with "Lab" suffix', () => {
    render(<LabsList labs={[{ id: 'lab-1', name: 'Bhatt' }]} />);
    expect(screen.getByText('Bhatt Lab')).toBeVisible();
    expect(screen.queryByText(/\+/)).not.toBeInTheDocument();
  });

  it('renders three labs with +1 overflow badge', () => {
    render(
      <LabsList
        labs={[
          { id: 'lab-1', name: 'Bhatt' },
          { id: 'lab-2', name: 'Anderson' },
          { id: 'lab-3', name: 'Smith' },
        ]}
      />,
    );
    expect(screen.getByText('Bhatt Lab')).toBeVisible();
    expect(screen.getByText(/Anderson Lab/)).toBeVisible();
    expect(screen.getByText('+1')).toBeVisible();
    expect(screen.queryByText('Smith Lab')).not.toBeInTheDocument();
  });

  it('respects custom maxVisible', () => {
    render(
      <LabsList
        labs={[
          { id: 'lab-1', name: 'Bhatt' },
          { id: 'lab-2', name: 'Anderson' },
          { id: 'lab-3', name: 'Smith' },
          { id: 'lab-4', name: 'Olsen' },
        ]}
        maxVisible={1}
      />,
    );
    expect(screen.getByText(/Bhatt Lab/)).toBeVisible();
    expect(screen.getByText('+3')).toBeVisible();
    expect(screen.queryByText('Anderson Lab')).not.toBeInTheDocument();
  });
});
