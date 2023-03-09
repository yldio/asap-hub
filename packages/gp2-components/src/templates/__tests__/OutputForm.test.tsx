import { gp2 } from '@asap-hub/model';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router, StaticRouter } from 'react-router-dom';
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
    const history = createMemoryHistory();
    const createOutput = jest.fn();
    createOutput.mockResolvedValue(gp2Fixtures.createOutputResponse());
    render(<OutputForm {...defaultProps} createOutput={createOutput} />, {
      wrapper: ({ children }) => <Router history={history}>{children}</Router>,
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
    expect(history.location.pathname).toEqual(`/outputs`);
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
  describe('validation', () => {
    it.each`
      title      | label       | error
      ${'Url'}   | ${/URL/i}   | ${'Please enter a valid URL, starting with http://'}
      ${'Title'} | ${/title/i} | ${'Please fill out this field.'}
      ${'Type'}  | ${/type/i}  | ${'Please fill out this field.'}
    `(
      'shows error message for missing value $title',
      async ({ label, error }) => {
        render(<OutputForm {...defaultProps} documentType="article" />, {
          wrapper: StaticRouter,
        });
        const input = screen.getByLabelText(label);
        fireEvent.focusOut(input);
        expect(await screen.findByText(error)).toBeVisible();
      },
    );
  });
});
