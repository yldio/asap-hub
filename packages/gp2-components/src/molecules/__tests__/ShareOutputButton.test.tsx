import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShareOutputButton from '../ShareOutputButton';

describe('ShareOutputButton', () => {
  it('should render a button', () => {
    render(<ShareOutputButton entityType={'workingGroup'} id={'123'} />);
    expect(
      screen.getByRole('button', { name: /share an output/i }),
    ).toBeVisible();
  });
  it('renders the right links', () => {
    render(<ShareOutputButton entityType={'workingGroup'} id={'123'} />);
    userEvent.click(screen.getByRole('button', { name: /share an output/i }));
    expect(
      screen
        .getAllByRole('link')
        .map((element) => (element as HTMLAnchorElement).href),
    ).toEqual([
      expect.stringContaining('article'),
      expect.stringContaining('code-software'),
      expect.stringContaining('dataset'),
      expect.stringContaining('procedural-form'),
      expect.stringContaining('gp2-reports'),
      expect.stringContaining('training-materials'),
    ]);
  });
  it('renders links for working groups', () => {
    render(<ShareOutputButton entityType={'workingGroup'} id={'123'} />);
    userEvent.click(screen.getByRole('button', { name: /share an output/i }));
    expect(
      screen
        .getAllByRole('link')
        .map((element) => (element as HTMLAnchorElement).href),
    ).toEqual(
      expect.arrayContaining([expect.stringContaining('working-groups')]),
    );
  });
  it('renders links for projects', () => {
    render(<ShareOutputButton entityType={'project'} id={'123'} />);
    userEvent.click(screen.getByRole('button', { name: /share an output/i }));
    expect(
      screen
        .getAllByRole('link')
        .map((element) => (element as HTMLAnchorElement).href),
    ).toEqual(expect.arrayContaining([expect.stringContaining('project')]));
  });
});
