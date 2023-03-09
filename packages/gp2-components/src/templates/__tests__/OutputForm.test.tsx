import { gp2 } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router-dom';
import OutputForm from '../OutputForm';

describe('OutputForm', () => {
  const defaultProps = {
    createOutput: jest.fn(),
    documentType: 'form' as const,
  };
  it('renders all the base fields', () => {
    render(<OutputForm {...defaultProps} />, { wrapper: StaticRouter });
    expect(screen.getByRole('textbox', { name: /title/i })).toBeVisible();
    expect(screen.getByRole('textbox', { name: /url/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /publish/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeVisible();
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
    userEvent.type(
      screen.getByRole('textbox', { name: /url/i }),
      'https://example.com',
    );
    userEvent.click(screen.getByRole('button', { name: /publish/i }));
    expect(
      await screen.findByRole('button', { name: /publish/i }),
    ).toBeEnabled();

    expect(createOutput).toHaveBeenCalledWith({
      title: 'output title',
      link: 'https://example.com',
      documentType: 'Form',
    });
  });

  describe('article', () => {
    it('renders type', () => {
      render(<OutputForm {...defaultProps} documentType="article" />, {
        wrapper: StaticRouter,
      });
      expect(screen.getByRole('textbox', { name: /type/i })).toBeVisible();
    });
    it.each<gp2.OutputType>(['Blog', 'Hot Topic', 'Letter', 'Review'])(
      '%d does not render subtype',
      (type) => {
        render(<OutputForm {...defaultProps} documentType="article" />, {
          wrapper: StaticRouter,
        });
        userEvent.click(screen.getByRole('textbox', { name: /type/i }));
        userEvent.click(screen.getByText(type));
        expect(
          screen.queryByRole('textbox', { name: /subtype/i }),
        ).not.toBeInTheDocument();
      },
    );
    it.each<gp2.OutputType>(['Research'])('%d renders subtype', (type) => {
      render(<OutputForm {...defaultProps} documentType="article" />, {
        wrapper: StaticRouter,
      });
      userEvent.click(screen.getByRole('textbox', { name: /type/i }));
      userEvent.click(screen.getByText(type));
      expect(screen.getByRole('textbox', { name: /subtype/i })).toBeVisible();
    });
    it('publishes with type and subtype', async () => {
      const createOutput = jest.fn();
      render(
        <OutputForm
          {...defaultProps}
          documentType="article"
          createOutput={createOutput}
        />,
        {
          wrapper: StaticRouter,
        },
      );
      userEvent.type(
        screen.getByRole('textbox', { name: /title/i }),
        'output title',
      );
      userEvent.type(
        screen.getByRole('textbox', { name: /url/i }),
        'https://example.com',
      );
      userEvent.click(screen.getByRole('textbox', { name: /type/i }));
      userEvent.click(screen.getByText('Research'));
      userEvent.click(screen.getByRole('textbox', { name: /subtype/i }));
      userEvent.click(screen.getByText('Published'));
      userEvent.click(screen.getByRole('button', { name: /publish/i }));
      expect(
        await screen.findByRole('button', { name: /publish/i }),
      ).toBeEnabled();

      expect(createOutput).toHaveBeenCalledWith({
        title: 'output title',
        link: 'https://example.com',
        documentType: 'Article',
        type: 'Research',
        subtype: 'Published',
      });
    });
  });
});
