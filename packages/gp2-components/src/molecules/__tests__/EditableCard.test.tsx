import { render, screen } from '@testing-library/react';
import EditableCard from '../EditableCard';

describe('Editable Card', () => {
  it('renders card with title', () => {
    render(<EditableCard title="Card Title" />);
    expect(screen.getByRole('article')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Card Title' })).toBeVisible();
  });
  it('renders the children', () => {
    render(<EditableCard title="Card Title">Text Content</EditableCard>);
    expect(screen.getByText('Text Content')).toBeVisible();
  });
  describe('edit link', () => {
    it('renders a link when a href is passed', () => {
      render(<EditableCard title="Card Title" editHref="/" />);
      expect((screen.getByRole('link') as HTMLAnchorElement).href).toContain(
        '/',
      );
    });
    describe('edit is true', () => {
      it('renders a link with edit name', () => {
        render(<EditableCard title="Card Title" editHref="/" edit />);
        expect(
          (screen.getByRole('link', { name: 'Edit Edit' }) as HTMLAnchorElement)
            .href,
        ).toContain('/');
      });
    });
    describe('edit is false', () => {
      it('renders a link with optional', () => {
        render(
          <EditableCard
            title="Card Title"
            editHref="/"
            edit={false}
            optional
          />,
        );
        expect(
          (
            screen.getByRole('link', {
              name: 'Optional Add',
            }) as HTMLAnchorElement
          ).href,
        ).toContain('/');
      });
      it('renders a link with Required if no optional', () => {
        render(<EditableCard title="Card Title" editHref="/" edit={false} />);
        expect(
          (
            screen.getByRole('link', {
              name: 'Required Add',
            }) as HTMLAnchorElement
          ).href,
        ).toContain('/');
      });
    });
  });
});
