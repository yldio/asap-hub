import { gp2 } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkingGroupResources from '../WorkingGroupResources';

describe('WorkingGroupResources', () => {
  const getResources = (length = 1): gp2.WorkingGroupResource[] =>
    Array.from({ length }, (_, itemIndex) => ({
      type: 'Link' as const,
      title: `resource title ${itemIndex}`,
      description: 'resource description',
      externalLink: 'http://a-link-some-where',
    }));
  const defaultProps = {
    resources: getResources(),
  };

  it('renders heading', () => {
    render(<WorkingGroupResources {...defaultProps}></WorkingGroupResources>);
    expect(
      screen.getByRole('heading', { name: /Resource List/i }),
    ).toBeVisible();
  });
  it('renders a resource title', () => {
    const [resource] = getResources();
    resource.title = 'resource title';
    render(
      <WorkingGroupResources
        {...defaultProps}
        resources={[resource]}
      ></WorkingGroupResources>,
    );
    expect(
      screen.getByRole('heading', { name: /resource title/i }),
    ).toBeVisible();
  });
  it('renders a resource description', () => {
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
  it('renders a link resource external link', () => {
    const [resource] = getResources();
    resource.type = 'Link';
    resource.externalLink = 'http://a-link';
    render(
      <WorkingGroupResources
        {...defaultProps}
        resources={[resource]}
      ></WorkingGroupResources>,
    );
    expect(
      screen.getByRole('link', { name: /external link/i }),
    ).toHaveAttribute('href', 'http://a-link');
  });

  it('renders a link resource pill for a link', () => {
    const [resource] = getResources();
    resource.type = 'Link';
    render(
      <WorkingGroupResources
        {...defaultProps}
        resources={[resource]}
      ></WorkingGroupResources>,
    );
    expect(screen.getByText('Link')).toBeVisible();
  });

  it('should not render a note resource external link', () => {
    const [resource] = getResources();
    resource.type = 'Note';
    render(
      <WorkingGroupResources
        {...defaultProps}
        resources={[resource]}
      ></WorkingGroupResources>,
    );
    expect(screen.queryByTestId('external-link-0')).not.toBeInTheDocument();
  });

  it('renders a note resource pill for a note', () => {
    const [resource] = getResources();
    resource.type = 'Note';
    render(
      <WorkingGroupResources
        {...defaultProps}
        resources={[resource]}
      ></WorkingGroupResources>,
    );
    expect(screen.getByText('Note')).toBeVisible();
  });

  it('renders multiple resources', () => {
    const [resource1, resource2] = getResources(2);
    resource1.title = 'resource title 1';
    resource2.title = 'resource title 2';
    render(
      <WorkingGroupResources
        {...defaultProps}
        resources={[resource1, resource2]}
      ></WorkingGroupResources>,
    );
    expect(
      screen.getByRole('heading', { name: /resource title 1/i }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: /resource title 2/i }),
    ).toBeVisible();
  });

  it('Renders show more button for more than 3 milestones', async () => {
    const resources = getResources(4);

    render(<WorkingGroupResources resources={resources} />);

    expect(screen.getByRole('button', { name: /Show more/i })).toBeVisible();
  });
  it('Renders show less button when the show more button is clicked', async () => {
    const resources = getResources(4);

    render(<WorkingGroupResources resources={resources} />);

    const button = screen.getByRole('button', { name: /Show more/i });
    userEvent.click(button);
    expect(screen.getByRole('button', { name: /Show less/i })).toBeVisible();
  });
  it('does not show a more button for less than 3 milestones', async () => {
    const resources = getResources(3);

    render(<WorkingGroupResources resources={resources} />);

    expect(
      screen.queryByRole('button', { name: /Show more/i }),
    ).not.toBeInTheDocument();
  });
  it('displays the hidden milestones if the button is clicked', () => {
    const resources = getResources(4);

    render(<WorkingGroupResources resources={resources} />);
    expect(
      screen.getByRole('heading', { name: 'resource title 2' }),
    ).toBeInTheDocument();
    expect(screen.getByText('resource title 3')).not.toBeVisible();
    const button = screen.getByRole('button', { name: /Show more/i });
    userEvent.click(button);
    expect(screen.getByText('resource title 3')).toBeVisible();
  });
});
