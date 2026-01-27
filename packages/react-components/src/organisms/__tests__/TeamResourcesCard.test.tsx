import { render, screen } from '@testing-library/react';
import TeamResourcesCard from '../TeamResourcesCard';

const baseProps = {
  resourceTitle: undefined,
  resourceDescription: undefined,
  resourceButtonCopy: undefined,
  resourceContactEmail: undefined,
  resourceLink: undefined,
};

describe('TeamResourcesCard', () => {
  it('renders nothing when no resource fields are populated', () => {
    const { container } = render(<TeamResourcesCard {...baseProps} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders resource title as heading when provided', () => {
    render(<TeamResourcesCard {...baseProps} resourceTitle="Test Resource" />);

    expect(
      screen.getByRole('heading', { name: 'Test Resource' }),
    ).toBeInTheDocument();
  });

  it('renders resource description when provided', () => {
    render(
      <TeamResourcesCard
        {...baseProps}
        resourceDescription="This is a resource description"
      />,
    );

    expect(
      screen.getByText('This is a resource description'),
    ).toBeInTheDocument();
  });

  it('renders primary button when button copy and contact email are provided', () => {
    render(
      <TeamResourcesCard
        {...baseProps}
        resourceButtonCopy="Contact Us"
        resourceContactEmail="test@example.com"
      />,
    );

    const button = screen.getByRole('link', { name: 'Contact Us' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', 'mailto:test@example.com');
  });

  it('renders external link when resource link is provided', () => {
    render(
      <TeamResourcesCard
        {...baseProps}
        resourceTitle="Test Resource"
        resourceLink="https://example.com"
      />,
    );

    const link = screen.getByRole('link', { name: /access drive/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('renders both buttons when all fields are provided', () => {
    render(
      <TeamResourcesCard
        {...baseProps}
        resourceTitle="Resource Title"
        resourceDescription="Resource description"
        resourceButtonCopy="Get Started"
        resourceContactEmail="contact@example.com"
        resourceLink="https://drive.google.com"
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Resource Title' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Resource description')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Get Started' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /access drive/i }),
    ).toBeInTheDocument();
  });

  it('does not render primary button when only button copy is provided', () => {
    render(
      <TeamResourcesCard {...baseProps} resourceButtonCopy="Contact Us" />,
    );

    expect(
      screen.queryByRole('link', { name: 'Contact Us' }),
    ).not.toBeInTheDocument();
  });

  it('does not render primary button when only contact email is provided', () => {
    render(
      <TeamResourcesCard
        {...baseProps}
        resourceContactEmail="test@example.com"
      />,
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
