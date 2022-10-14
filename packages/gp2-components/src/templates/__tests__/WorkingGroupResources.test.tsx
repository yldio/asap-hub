import { gp2 } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import WorkingGroupResources from '../WorkingGroupResources';

describe('WorkingGroupResources', () => {
  const getResource = (): gp2.WorkingGroupResource => ({
    id: '42',
    type: 'Link' as const,
    title: 'test resource title',
    description: 'test resource description',
    externalLink: 'http://a-link-some-where',
  });
  const defaultProps = {
    resources: [getResource()],
  };
  it('renders heading', () => {
    render(<WorkingGroupResources {...defaultProps}></WorkingGroupResources>);
    expect(
      screen.getByRole('heading', { name: /Resource List/i }),
    ).toBeVisible();
  });
  it('renders a resource title', () => {
    const resource = getResource();
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
    const resource = getResource();
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
    const resource = getResource();
    resource.type = 'Link';
    resource.id = '11';
    resource.externalLink = 'http://a-link';
    render(
      <WorkingGroupResources
        {...defaultProps}
        resources={[resource]}
      ></WorkingGroupResources>,
    );
    expect(screen.getByTestId('external-link-11')).toHaveAttribute(
      'href',
      'http://a-link',
    );
  });

  it('renders a link resource pill for a link', () => {
    const resource = getResource();
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
    const resource = getResource();
    resource.type = 'Note';
    resource.id = '11';
    render(
      <WorkingGroupResources
        {...defaultProps}
        resources={[resource]}
      ></WorkingGroupResources>,
    );
    expect(screen.queryByTestId('external-link-11')).not.toBeInTheDocument();
  });

  it('renders a note resource pill for a note', () => {
    const resource = getResource();
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
    const resource1 = getResource();
    resource1.id = '7';
    resource1.title = 'resource title 1';
    const resource2 = getResource();
    resource2.id = '11';
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
  test.todo('show more');
  test.todo('no resources');
});
