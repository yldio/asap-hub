import { render, screen } from '@testing-library/react';
import UserQuestions from '../UserQuestions';

describe('UserQuestions', () => {
  it('renders the title', () => {
    render(<UserQuestions questions={[]} firstName="" />);
    expect(
      screen.getByRole('heading', { name: 'Open Questions' }),
    ).toBeVisible();
  });
  it('renders the subtitle', () => {
    render(<UserQuestions questions={[]} firstName="Tony" />);
    expect(
      screen.getByText(
        'Tony is interested in answering the following questions within their work:',
      ),
    ).toBeVisible();
  });
  it('renders questions', () => {
    render(
      <UserQuestions
        questions={['this is a question?', 'this is another question?']}
        firstName="Tony"
      />,
    );
    expect(screen.getByText('this is a question?')).toBeVisible();
    expect(screen.getByText('this is another question?')).toBeVisible();
  });
});
