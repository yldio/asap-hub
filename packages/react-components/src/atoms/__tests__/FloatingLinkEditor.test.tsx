import { LinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { act, fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect } from 'react';

import FloatingLinkEditor, { sanitizeUrl } from '../FloatingLinkEditor';

let consoleSpy: jest.SpyInstance;

const stubSelectionRect = (
  rect: Partial<DOMRect> = {
    top: 100,
    left: 50,
    bottom: 120,
    right: 200,
    width: 150,
    height: 20,
  },
) => {
  const fakeRange = {
    getBoundingClientRect: () => ({
      top: 100,
      left: 50,
      bottom: 120,
      right: 200,
      width: 150,
      height: 20,
      x: 50,
      y: 100,
      toJSON: () => ({}),
      ...rect,
    }),
  } as unknown as Range;
  jest.spyOn(window, 'getSelection').mockReturnValue({
    rangeCount: 1,
    getRangeAt: () => fakeRange,
  } as unknown as Selection);
};

const CommandSpy = ({
  onDispatch,
}: {
  onDispatch: (payload: unknown) => void;
}) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    const originalDispatch = editor.dispatchCommand.bind(editor);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor as any).dispatchCommand = (command: unknown, payload: unknown) => {
      if (command === TOGGLE_LINK_COMMAND) {
        onDispatch(payload);
      }
      return originalDispatch(
        command as Parameters<typeof originalDispatch>[0],
        payload as Parameters<typeof originalDispatch>[1],
      );
    };
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (editor as any).dispatchCommand = originalDispatch;
    };
  }, [editor, onDispatch]);
  return null;
};

const Harness = ({
  isOpen,
  initialUrl = '',
  onClose = jest.fn(),
  onDispatch = jest.fn(),
}: {
  isOpen: boolean;
  initialUrl?: string;
  onClose?: () => void;
  onDispatch?: (payload: unknown) => void;
}) => {
  const config = {
    namespace: 'TestEditor',
    nodes: [LinkNode],
    // eslint-disable-next-line no-console
    onError: console.error,
  };
  return (
    <LexicalComposer initialConfig={config}>
      <LinkPlugin />
      <CommandSpy onDispatch={onDispatch} />
      <FloatingLinkEditor
        isOpen={isOpen}
        initialUrl={initialUrl}
        onClose={onClose}
      />
    </LexicalComposer>
  );
};

beforeEach(() => {
  consoleSpy = jest.spyOn(console, 'error').mockImplementation((msg) => {
    if (
      typeof msg === 'string' &&
      msg.includes(
        'The current testing environment is not configured to support act',
      )
    ) {
      return;
    }
    // eslint-disable-next-line no-console
    console.warn(msg);
  });
  jest
    .spyOn(window, 'requestAnimationFrame')
    .mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
  jest
    .spyOn(window, 'cancelAnimationFrame')
    .mockImplementation(() => undefined);
  stubSelectionRect();
});

afterEach(() => {
  consoleSpy.mockRestore();
  jest.restoreAllMocks();
});

describe('sanitizeUrl', () => {
  it('returns empty string for whitespace', () => {
    expect(sanitizeUrl('   ')).toBe('');
  });

  it('returns empty string for an empty input', () => {
    expect(sanitizeUrl('')).toBe('');
  });

  it('passes through http URLs', () => {
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
  });

  it('passes through https URLs', () => {
    expect(sanitizeUrl('https://example.com/path')).toBe(
      'https://example.com/path',
    );
  });

  it('passes through mailto: URLs', () => {
    expect(sanitizeUrl('mailto:a@b.com')).toBe('mailto:a@b.com');
  });

  it('prefixes bare hostnames with https://', () => {
    expect(sanitizeUrl('example.com')).toBe('https://example.com');
  });

  it('prefixes hostnames with paths', () => {
    expect(sanitizeUrl('example.com/foo')).toBe('https://example.com/foo');
  });

  it('trims surrounding whitespace', () => {
    expect(sanitizeUrl('  https://example.com  ')).toBe('https://example.com');
  });

  it('rejects unrecognized inputs', () => {
    expect(sanitizeUrl('not a url')).toBe('');
  });

  it.each([
    /* eslint-disable no-script-url */
    'javascript:alert(1)',
    'JAVASCRIPT:alert(1)',
    /* eslint-enable no-script-url */
    'data:text/html,<script>alert(1)</script>',
    'file:///etc/passwd',
    'vbscript:msgbox(1)',
    'ftp://example.com',
  ])('rejects unsafe / unsupported scheme %s', (input) => {
    expect(sanitizeUrl(input)).toBe('');
  });
});

describe('FloatingLinkEditor', () => {
  it('does not render when closed', () => {
    const { queryByLabelText } = render(<Harness isOpen={false} />);
    expect(queryByLabelText('Link URL')).not.toBeInTheDocument();
  });

  it('renders the URL input when opened without an initial URL', () => {
    const { getByLabelText } = render(<Harness isOpen />);
    expect(getByLabelText('Link URL')).toBeInTheDocument();
    expect(getByLabelText('Apply Link')).toBeInTheDocument();
  });

  it('renders edit/remove options when opened with an existing URL', () => {
    const { getByLabelText, queryByLabelText } = render(
      <Harness isOpen initialUrl="https://example.com" />,
    );
    expect(getByLabelText('Edit Link')).toBeInTheDocument();
    expect(getByLabelText('Remove Link')).toBeInTheDocument();
    expect(queryByLabelText('Link URL')).not.toBeInTheDocument();
  });

  it('switches to edit mode when Edit is clicked', async () => {
    const { getByLabelText } = render(
      <Harness isOpen initialUrl="https://example.com" />,
    );
    await act(async () => {
      await userEvent.click(getByLabelText('Edit Link'));
    });
    expect(getByLabelText('Link URL')).toHaveValue('https://example.com');
  });

  it('dispatches TOGGLE_LINK_COMMAND with sanitized URL on Apply', async () => {
    const onDispatch = jest.fn();
    const onClose = jest.fn();
    const { getByLabelText } = render(
      <Harness isOpen onDispatch={onDispatch} onClose={onClose} />,
    );
    const input = getByLabelText('Link URL') as HTMLInputElement;
    await act(async () => {
      fireEvent.change(input, { target: { value: 'example.com' } });
      await userEvent.click(getByLabelText('Apply Link'));
    });
    expect(onDispatch).toHaveBeenCalledWith('https://example.com');
    expect(onClose).toHaveBeenCalled();
  });

  it('dispatches on Enter keypress', async () => {
    const onDispatch = jest.fn();
    const { getByLabelText } = render(
      <Harness isOpen onDispatch={onDispatch} />,
    );
    const input = getByLabelText('Link URL') as HTMLInputElement;
    await act(async () => {
      fireEvent.change(input, { target: { value: 'https://foo.com' } });
      fireEvent.keyDown(input, { key: 'Enter' });
    });
    expect(onDispatch).toHaveBeenCalledWith('https://foo.com');
  });

  it('closes without dispatching on Escape', async () => {
    const onDispatch = jest.fn();
    const onClose = jest.fn();
    const { getByLabelText } = render(
      <Harness isOpen onDispatch={onDispatch} onClose={onClose} />,
    );
    const input = getByLabelText('Link URL') as HTMLInputElement;
    await act(async () => {
      fireEvent.change(input, { target: { value: 'https://foo.com' } });
      fireEvent.keyDown(input, { key: 'Escape' });
    });
    expect(onDispatch).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('does not dispatch when Apply is clicked with empty input', async () => {
    const onDispatch = jest.fn();
    const onClose = jest.fn();
    const { getByLabelText } = render(
      <Harness isOpen onDispatch={onDispatch} onClose={onClose} />,
    );
    await act(async () => {
      await userEvent.click(getByLabelText('Apply Link'));
    });
    expect(onDispatch).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('dispatches null to remove an existing link', async () => {
    const onDispatch = jest.fn();
    const onClose = jest.fn();
    const { getByLabelText } = render(
      <Harness
        isOpen
        initialUrl="https://example.com"
        onDispatch={onDispatch}
        onClose={onClose}
      />,
    );
    await act(async () => {
      await userEvent.click(getByLabelText('Remove Link'));
    });
    expect(onDispatch).toHaveBeenCalledWith(null);
    expect(onClose).toHaveBeenCalled();
  });

  it('closes when clicking outside', async () => {
    const onClose = jest.fn();
    render(<Harness isOpen onClose={onClose} />);
    await act(async () => {
      fireEvent.mouseDown(document.body);
    });
    expect(onClose).toHaveBeenCalled();
  });

  it('does not render when the selection has no bounding rect', () => {
    stubSelectionRect({
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: 0,
      height: 0,
    });
    const { queryByLabelText } = render(<Harness isOpen />);
    expect(queryByLabelText('Link URL')).not.toBeInTheDocument();
  });

  it('does not render when there is no DOM selection', () => {
    jest
      .spyOn(window, 'getSelection')
      .mockReturnValue({ rangeCount: 0 } as unknown as Selection);
    const { queryByLabelText } = render(<Harness isOpen />);
    expect(queryByLabelText('Link URL')).not.toBeInTheDocument();
  });

  it('renders an anchor for the existing URL with target=_blank', () => {
    const { getByText } = render(
      <Harness isOpen initialUrl="https://example.com" />,
    );
    const anchor = getByText('https://example.com');
    expect(anchor).toHaveAttribute('href', 'https://example.com');
    expect(anchor).toHaveAttribute('target', '_blank');
    expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
