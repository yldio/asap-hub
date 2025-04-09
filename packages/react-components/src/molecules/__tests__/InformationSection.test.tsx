import { render, screen } from '@testing-library/react';
import InformationSection from '../InformationSection';

describe('InformationSection', () => {
  it('renders with children content', () => {
    const testContent = 'Test information message';
    render(<InformationSection>{testContent}</InformationSection>);

    expect(screen.getByText(testContent)).toBeInTheDocument();

    const iconContainer = screen.getByTitle('Information');
    expect(iconContainer).toBeInTheDocument();
  });
});
