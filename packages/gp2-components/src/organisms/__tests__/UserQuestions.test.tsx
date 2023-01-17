import { render, screen } from '@testing-library/react';
import UserQuestions from '../UserQuestions';

describe('UserQuestions', () => {
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

  describe('if no question', () => {
    it('does not render placeholder when edit link is not provided', () => {
      const { queryByText } = render(
        <UserQuestions questions={[]} firstName="Tony" />,
      );

      expect(
        queryByText(/share the research questions/i),
      ).not.toBeInTheDocument();
    });

    it('renders placeholder when there is an edit link', () => {
      const { getByText } = render(
        <UserQuestions questions={[]} firstName="Tony" editHref="/" />,
      );

      expect(getByText(/share the research questions/i)).toBeVisible();
    });
  });
});
