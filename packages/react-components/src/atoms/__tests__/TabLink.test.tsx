import { render, fireEvent } from '@testing-library/react';
import { Route, Router, StaticRouter, Switch } from 'react-router-dom';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';
import { createBrowserHistory } from 'history';
import TabLink from '../TabLink';

describe.each`
  description           | wrapper
  ${'with a router'}    | ${StaticRouter}
  ${'without a router'} | ${undefined}
`('$description', ({ wrapper }) => {
  it('renders a link with the given text', () => {
    const { getByRole } = render(<TabLink href="/">Text</TabLink>, {
      wrapper,
    });
    expect(getByRole('link')).toHaveTextContent('Text');
  });

  it('renders a link with the given href', () => {
    const { getByRole } = render(<TabLink href="/">Text</TabLink>, {
      wrapper,
    });
    expect(getByRole('link')).toHaveAttribute('href', '/');
  });

  it('renders the current link in bold', () => {
    const { getByText } = render(
      <>
        <TabLink href="/">Target</TabLink>
        <TabLink href="/other">Other</TabLink>
      </>,
      { wrapper },
    );
    expect(
      findParentWithStyle(getByText('Target'), 'fontWeight')?.fontWeight,
    ).toBe('bold');
    expect(
      findParentWithStyle(getByText('Other'), 'fontWeight')?.fontWeight,
    ).not.toBe('bold');
  });
});

describe('with a router', () => {
  it('does not trigger a full page navigation on click', () => {
    const { getByRole } = render(
      <StaticRouter>
        <TabLink href="/">Text</TabLink>
      </StaticRouter>,
    );
    expect(fireEvent.click(getByRole('link'))).toBe(false);
  });

  it('does trigger an event if it was visited', () => {
    const { getByText, getByRole } = render(
      <Router history={createBrowserHistory()}>
        <div>
          <TabLink visited={true} href="/test">
            Link 1
          </TabLink>
          <TabLink visited={true} href="/">
            Link 2
          </TabLink>
          <TabLink visited={false} href="/test2">
            Link 3
          </TabLink>
          <Switch>
            <Route exact path="/">
              <div>
                <p>Index</p>
              </div>
            </Route>

            <Route exact path="/test">
              <div>
                <p>Test</p>
              </div>
            </Route>

            <Route exact path="/test2">
              <div>
                <p>Test 2</p>
              </div>
            </Route>
          </Switch>
        </div>
      </Router>,
    );

    fireEvent.click(getByRole('link', { name: /link 1/i }));

    expect(getByText('Test')).toBeVisible();
  });

  it("does not trigger an event if it wasn't visited", () => {
    const { getByText, getByRole } = render(
      <Router history={createBrowserHistory()}>
        <div>
          <TabLink visited={true} href="/test">
            Link 1
          </TabLink>
          <TabLink visited={true} href="/">
            Link 2
          </TabLink>
          <TabLink visited={false} href="/test2">
            Link 3
          </TabLink>
          <Switch>
            <Route path="/">
              <div>
                <p>Index</p>
              </div>
            </Route>

            <Route path="/test">
              <div>
                <p>Test</p>
              </div>
            </Route>

            <Route path="/test2">
              <div>
                <p>Test 2</p>
              </div>
            </Route>
          </Switch>
        </div>
      </Router>,
    );

    fireEvent.click(getByRole('link', { name: /link 3/i }));

    expect(getByText('Index')).toBeVisible();
  });

  it("shows link with different color if it's visited but is not the current one", () => {
    const { getByRole } = render(
      <StaticRouter>
        <TabLink visited={true} href="/test">
          Link 1
        </TabLink>
        <TabLink visited={true} href="/">
          Link 2
        </TabLink>
      </StaticRouter>,
    );
    expect(getByRole('link', { name: /link 1/i })).toHaveStyle({
      color: 'rgb(77, 100, 107)',
    });
  });

  it('shows disabled link if visited attribute is false', () => {
    const { getByRole } = render(
      <StaticRouter>
        <TabLink visited={true} href="/">
          Link 1
        </TabLink>
        <TabLink visited={false} href="/test">
          Link 2
        </TabLink>
      </StaticRouter>,
    );
    expect(getByRole('link', { name: /link 2/i })).toHaveStyle({
      color: 'rgb(194, 201, 206)',
    });
  });
});
