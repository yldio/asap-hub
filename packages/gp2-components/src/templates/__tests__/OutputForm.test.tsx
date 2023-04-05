import { gp2 } from '@asap-hub/model';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router, StaticRouter } from 'react-router-dom';
import OutputForm from '../OutputForm';

describe('OutputForm', () => {
  const defaultProps = {
    shareOutput: jest.fn(),
    setBannerMessage: jest.fn(),
    documentType: 'Procedural Form' as const,
    entityType: 'workingGroup' as const,
  };
  afterEach(jest.resetAllMocks);
  it('renders all the base fields', () => {
    render(<OutputForm {...defaultProps} />, { wrapper: StaticRouter });
    expect(screen.getByRole('textbox', { name: /title/i })).toBeVisible();
    expect(screen.getByRole('textbox', { name: /url/i })).toBeVisible();
    expect(screen.getByRole('textbox', { name: /authors/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /publish/i })).toBeVisible();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeVisible();
  });
  it('publish the form', async () => {
    const getAuthorSuggestions = jest.fn();
    const history = createMemoryHistory();
    const shareOutput = jest.fn();
    const setBannerMessage = jest.fn();
    getAuthorSuggestions.mockResolvedValue([
      {
        author: {
          ...gp2Fixtures.createUserResponse(),
          displayName: 'Chris Blue',
        },
        label: 'Chris Blue',
        value: 'u2',
      },
      {
        author: {
          ...gp2Fixtures.createExternalUserResponse(),
          displayName: 'Chris Reed',
        },
        label: 'Chris Reed (Non CRN)',
        value: 'u1',
      },
    ]);
    shareOutput.mockResolvedValueOnce(gp2Fixtures.createOutputResponse());
    render(
      <OutputForm
        {...defaultProps}
        shareOutput={shareOutput}
        setBannerMessage={setBannerMessage}
        getAuthorSuggestions={getAuthorSuggestions}
      />,
      {
        wrapper: ({ children }) => (
          <Router history={history}>{children}</Router>
        ),
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
    const authors = screen.getByRole('textbox', { name: /Authors/i });
    userEvent.click(authors);

    userEvent.click(await screen.findByText(/Chris Reed/i));
    userEvent.click(authors);
    userEvent.click(screen.getByText('Chris Blue'));
    userEvent.click(authors);
    userEvent.type(authors, 'Alex White');
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
    userEvent.click(screen.getAllByText('Alex White')[1]!);
    userEvent.click(screen.getByRole('button', { name: /publish/i }));
    expect(
      await screen.findByRole('button', { name: /publish/i }),
    ).toBeEnabled();

    expect(shareOutput).toHaveBeenCalledWith({
      title: 'output title',
      link: 'https://example.com',
      documentType: 'Procedural Form',
      authors: [
        { externalUserId: 'u1' },
        { userId: 'u2' },
        { externalUserName: 'Alex White' },
      ],
    });
    expect(setBannerMessage).toHaveBeenCalledWith(
      expect.stringMatching(
        /working group procedural form published successfully./i,
      ),
    );
    expect(history.location.pathname).toEqual(`/outputs`);
  }, 30_000);

  describe('article', () => {
    it('renders type', () => {
      render(<OutputForm {...defaultProps} documentType="Article" />, {
        wrapper: StaticRouter,
      });
      expect(screen.getByRole('textbox', { name: /type/i })).toBeVisible();
    });
    it.each<gp2.OutputType>(['Blog', 'Hot Topic', 'Letter', 'Review'])(
      '%d does not render subtype',
      (type) => {
        render(<OutputForm {...defaultProps} documentType="Article" />, {
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
      render(<OutputForm {...defaultProps} documentType="Article" />, {
        wrapper: StaticRouter,
      });
      userEvent.click(screen.getByRole('textbox', { name: /type/i }));
      userEvent.click(screen.getByText(type));
      expect(screen.getByRole('textbox', { name: /subtype/i })).toBeVisible();
    });
    it('publishes with type and subtype', async () => {
      const history = createMemoryHistory();
      const getAuthorSuggestions = jest.fn();
      getAuthorSuggestions.mockResolvedValueOnce([
        {
          author: {
            ...gp2Fixtures.createUserResponse(),
            displayName: 'Chris Blue',
          },
          label: 'Chris Blue',
          value: 'u2',
        },
      ]);
      const shareOutput = jest.fn();
      shareOutput.mockResolvedValueOnce(gp2Fixtures.createOutputResponse());
      render(
        <OutputForm
          {...defaultProps}
          documentType="Article"
          shareOutput={shareOutput}
          getAuthorSuggestions={getAuthorSuggestions}
        />,
        {
          wrapper: ({ children }) => (
            <Router history={history}>{children}</Router>
          ),
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
      const authors = screen.getByRole('textbox', { name: /Authors/i });
      userEvent.click(authors);
      await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
      userEvent.click(screen.getByText('Chris Blue'));
      userEvent.click(screen.getByRole('button', { name: /publish/i }));
      expect(
        await screen.findByRole('button', { name: /publish/i }),
      ).toBeEnabled();

      expect(shareOutput).toHaveBeenCalledWith({
        title: 'output title',
        link: 'https://example.com',
        documentType: 'Article',
        type: 'Research',
        subtype: 'Published',
        authors: [{ userId: 'u2' }],
      });
      expect(history.location.pathname).toEqual(`/outputs`);
    }, 30_000);
  });
  describe('validation', () => {
    it.each`
      title      | label       | error
      ${'Url'}   | ${/URL/i}   | ${'Please enter a valid URL, starting with http://'}
      ${'Title'} | ${/title/i} | ${'Please fill out this field.'}
      ${'Type'}  | ${/type/i}  | ${'Please fill out this field.'}
    `('shows error message for missing value $title', ({ label, error }) => {
      render(<OutputForm {...defaultProps} documentType="Article" />, {
        wrapper: StaticRouter,
      });
      const input = screen.getByLabelText(label);
      fireEvent.focusOut(input);
      expect(screen.getByText(error)).toBeVisible();
    });
  });
  describe('edit output', () => {
    it('renders all the base fields', () => {
      const title = 'Output Title';
      const link = 'https://example.com/output';
      const { authors } = gp2Fixtures.createOutputResponse();
      authors[0]!.displayName = 'Tony Stark';
      const output = {
        ...defaultProps,
        ...gp2Fixtures.createOutputResponse(),
        title,
        link,
        authors,
      };
      render(<OutputForm {...output} />, { wrapper: StaticRouter });
      expect(
        screen.getByRole('textbox', { name: /title/i }),
      ).toHaveDisplayValue(title);
      expect(screen.getByRole('textbox', { name: /url/i })).toHaveDisplayValue(
        link,
      );
      expect(screen.getByRole('textbox', { name: /authors/i })).toBeVisible();
      expect(screen.getByText('Tony Stark')).toBeVisible();
      expect(screen.getByRole('button', { name: /save/i })).toBeVisible();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeVisible();
    });
  });
});
