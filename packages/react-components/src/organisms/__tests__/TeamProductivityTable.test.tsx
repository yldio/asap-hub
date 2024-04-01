import { render } from '@testing-library/react';
import TeamProductivityTable from '../TeamProductivityTable';

describe('TeamProductivityTable', () => {
  it('renders data', () => {
    const data = [
      {
        id: '1',
        name: 'Test Team',
        articles: 1,
        bioinformatics: 2,
        datasets: 3,
        labResources: 4,
        protocols: 5,
      },
    ];
    const { getByText } = render(<TeamProductivityTable data={data} />);
    expect(getByText('Test Team')).toBeInTheDocument();
  });
});
