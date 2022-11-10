import { gp2 } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import ProjectResources from '../ProjectResources';

describe('ProjectResources', () => {
  const getResources = (length = 1): gp2.Resource[] =>
    Array.from({ length }, (_, itemIndex) => ({
      type: 'Link' as const,
      title: `resource title ${itemIndex}`,
      description: 'resource description',
      externalLink: 'http://a-link-some-where',
    }));
  const defaultProps = {
    resources: getResources(),
  };

  it('renders a resource', () => {
    const [resource] = getResources();
    resource.description = 'resource description';
    render(<ProjectResources {...defaultProps} resources={[resource]} />);
    expect(screen.getByText(/resource description/i)).toBeVisible();
  });
});
