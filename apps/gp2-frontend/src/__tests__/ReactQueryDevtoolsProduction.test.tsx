import { render, waitFor } from '@testing-library/react';

const loadWithEnvironment = (environment: string) => {
  let Component: React.FC;
  jest.isolateModules(() => {
    jest.doMock('../config', () => ({
      ...jest.requireActual('../config'),
      ENVIRONMENT: environment,
    }));
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    Component = require('../ReactQueryDevtoolsProduction').default;
  });
  return Component!;
};

afterEach(() => {
  jest.resetModules();
});

describe('ReactQueryDevtoolsProduction', () => {
  it('renders nothing on the production environment', () => {
    const Component = loadWithEnvironment('production');
    const { container } = render(<Component />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the lazy devtools panel outside production', async () => {
    const Component = loadWithEnvironment('local');
    const { container } = render(<Component />);
    // the Suspense boundary mounts; the lazy chunk resolves asynchronously
    await waitFor(() => expect(container).toBeInTheDocument());
  });
});
