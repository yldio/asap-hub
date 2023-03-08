import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router-dom';
import OutputForm from '../OutputForm';

describe('OutputForm', () => {
  const defaultProps = {
    createOutput: jest.fn(),
    documentType: 'form' as const,
  };
  it('renders the fields', () => {
    render(<OutputForm {...defaultProps} />, { wrapper: StaticRouter });
    expect(screen.getByRole('textbox', { name: /title/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /publish/i })).toBeVisible();
  });
  it('publish the form', async () => {
    const createOutput = jest.fn();
    render(<OutputForm {...defaultProps} createOutput={createOutput} />, {
      wrapper: StaticRouter,
    });
    userEvent.type(
      screen.getByRole('textbox', { name: /title/i }),
      'output title',
    );
    userEvent.click(screen.getByRole('button', { name: /publish/i }));
    expect(
      await screen.findByRole('button', { name: /publish/i }),
    ).toBeEnabled();

    expect(createOutput).toHaveBeenCalledWith({
      title: 'output title',
      documentType: 'Form',
    });
  });
});
