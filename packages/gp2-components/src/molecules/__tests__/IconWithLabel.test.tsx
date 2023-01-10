import { render, screen } from '@testing-library/react';
import ProjectIcon from '../../icons/project-icon';
import IconWithLabel from '../IconWithLabel';

describe('IconWithLabel', () => {
  it('should render the icon', () => {
    render(<IconWithLabel icon={<ProjectIcon />} />);
    expect(screen.getByTitle('Projects')).toBeInTheDocument();
  });
  it('should render the children', () => {
    render(<IconWithLabel icon={<svg />}>Content</IconWithLabel>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
