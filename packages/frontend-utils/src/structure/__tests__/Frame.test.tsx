import { FC, lazy } from 'react';
import { render, waitFor } from '@testing-library/react';
import { mockConsoleError } from '@asap-hub/dom-test-utils';

import Frame, {
  SearchFrame,
  SkeletonBodyFrame,
  SkeletonHeaderFrame,
} from '../Frame';

mockConsoleError();

const Throw: FC<Record<string, never>> = () => {
  throw new Error('oops');
};
const Suspend = lazy(() => new Promise(() => {}));

describe('an error', () => {
  it('is caught by a boundary', () => {
    const { container } = render(
      <Frame title={null}>
        <Throw />
      </Frame>,
    );
    expect(container).toHaveTextContent(/went wrong/i);
  });
  it('is caught by a boundary with custom props', () => {
    const { container } = render(
      <Frame
        title={null}
        boundaryProps={{ description: 'specificerrormessage' }}
      >
        <Throw />
      </Frame>,
    );
    expect(container).toHaveTextContent(/specificerrormessage/i);
  });
});

describe('the suspense fallback', () => {
  it('is provided by default', async () => {
    const { container } = render(
      <Frame title={null}>
        <Suspend />
      </Frame>,
    );
    await waitFor(() => expect(container).toHaveTextContent(/loading/i));
  });

  it('is passed through', async () => {
    const { container } = render(
      <Frame title={null} fallback={'123'}>
        <Suspend />
      </Frame>,
    );
    await waitFor(() => expect(container).toHaveTextContent('123'));
  });
});

describe('the document title', () => {
  it('is set', () => {
    render(<Frame title="The Hub">test</Frame>);
    expect(document.title).toBe('The Hub');
  });
  it('is set even while suspended', () => {
    render(
      <Frame title="The Suspended Hub">
        <Suspend />
      </Frame>,
    );
    expect(document.title).toBe('The Suspended Hub');
  });

  it('can be nested', () => {
    render(
      <Frame title="The Hub">
        <Frame title="A Page">test</Frame>
      </Frame>,
    );
    expect(document.title).toContain('The Hub');
    expect(document.title).toContain('A Page');
  });
  it('ignores Frames without title in the middle', () => {
    render(
      <Frame title="The Hub">
        <Frame title={null}>
          <Frame title="A Page">test</Frame>
        </Frame>
      </Frame>,
    );
    expect(document.title).toContain('The Hub');
    expect(document.title).toContain('A Page');
  });
});

describe('the skeleton frames', () => {
  it('renders skeleton screen for content header', async () => {
    const { container } = render(
      <SkeletonHeaderFrame title={null}>
        <Suspend />
      </SkeletonHeaderFrame>,
    );
    expect(container.querySelectorAll('div[class*="animation"]')).toHaveLength(
      4,
    );
  });

  it('renders skeleton screen for content body', async () => {
    const { container } = render(
      <SkeletonBodyFrame title={null}>
        <Suspend />
      </SkeletonBodyFrame>,
    );
    expect(container.querySelectorAll('div[class*="animation"]')).toHaveLength(
      3,
    );
  });

  it('renders skeleton screen for the search', async () => {
    const { container } = render(
      <SearchFrame title={null}>
        <Suspend />
      </SearchFrame>,
    );
    expect(container.querySelectorAll('div[class*="animation"]')).toHaveLength(
      3,
    );
  });
});
