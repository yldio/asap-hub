import { gp2 } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import WorkingGroupResources from '../WorkingGroupResources';

describe('WorkingGroupResources', () => {
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
    render(
      <WorkingGroupResources
        {...defaultProps}
        resources={[resource]}
      ></WorkingGroupResources>,
    );
    expect(screen.getByText(/resource description/i)).toBeVisible();
  });
});
