import { render } from '@testing-library/react';
import TeamProductivityTable from '../TeamProductivityTable';

describe('TeamProductivityTable', () => {
  const team = {
    id: '1',
    name: 'Test Team',
    active: true,
    articles: 1,
    bioinformatics: 2,
    datasets: 3,
    labResources: 4,
    protocols: 5,
  };

  it('renders data', () => {
    const data = [
      team
    ];
    const { getByText } = render(<TeamProductivityTable data={data} />);
    expect(getByText('Test Team')).toBeInTheDocument();
  });

  it('renders inactive badge', () => {
    const data = [
      {
        ...team,
        active: false,
      }
    ];
    const { getByTitle } = render(<TeamProductivityTable data={data} />);
    expect(getByTitle('Inactive')).toBeInTheDocument();
  });
});
