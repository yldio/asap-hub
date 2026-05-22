import { $createLinkNode, LinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { act, fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  $createParagraphNode,
  $createRangeSelection,
  $createTextNode,
  $getRoot,
  $getSelection,
  $setSelection,
  createEditor,
  LexicalEditor,
} from 'lexical';
import { useEffect } from 'react';

import FloatingLinkEditor, {
  getUrlFromSelection,
  sanitizeUrl,
} from '../FloatingLinkEditor';

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
});

afterEach(() => {
  consoleSpy.mockRestore();
  jest.restoreAllMocks();
});

describe('getUrlFromSelection', () => {
  const makeEditor = (): LexicalEditor => {
    const editor = createEditor({
      namespace: 'test',
      nodes: [LinkNode],
      // eslint-disable-next-line no-console
      onError: console.error,
    });
    // Attach a real root element so $setSelection works
    const root = document.createElement('div');
    root.contentEditable = 'true';
    document.body.appendChild(root);
    editor.setRootElement(root);
    return editor;
  };

  const readWith = <T,>(
    editor: LexicalEditor,
    inUpdate: () => void,
    inRead: () => T,
  ): T => {
    let result: T;
    editor.update(
      () => {
        inUpdate();
      },
      { discrete: true },
    );
    editor.getEditorState().read(() => {
      result = inRead();
    });
    return result!;
  };

  it('returns the URL when the selection sits in a text node whose parent is a LinkNode', () => {
    const editor = makeEditor();
    const url = readWith(
      editor,
      () => {
        const root = $getRoot();
        const para = $createParagraphNode();
        const link = $createLinkNode('https://parent-link.com');
        const text = $createTextNode('hi');
        link.append(text);
        para.append(link);
        root.append(para);
        text.select(0, text.getTextContentSize());
      },
      () => getUrlFromSelection($getSelection()),
    );
    expect(url).toBe('https://parent-link.com');
  });

  it('returns the URL when the selected node itself is a LinkNode', () => {
    const editor = makeEditor();
    const url = readWith(
      editor,
      () => {
        const root = $getRoot();
        const para = $createParagraphNode();
        const link = $createLinkNode('https://self-link.com');
        link.append($createTextNode('hi'));
        para.append(link);
        root.append(para);
        // Build a RangeSelection whose anchor and focus both resolve directly
        // to the LinkNode (element points), so getSelectedNode returns the
        // link rather than its descendant text node.
        const selection = $createRangeSelection();
        selection.anchor.set(link.getKey(), 0, 'element');
        selection.focus.set(link.getKey(), 1, 'element');
        $setSelection(selection);
      },
      () => getUrlFromSelection($getSelection()),
    );
    expect(url).toBe('https://self-link.com');
  });

  it('returns null when the selected node is not in a link', () => {
    const editor = makeEditor();
    const url = readWith(
      editor,
      () => {
        const root = $getRoot();
        const para = $createParagraphNode();
        const text = $createTextNode('not a link');
        para.append(text);
        root.append(para);
        text.select(0, text.getTextContentSize());
      },
      () => getUrlFromSelection($getSelection()),
    );
    expect(url).toBeNull();
  });

  it('returns null when there is no range selection', () => {
    const editor = makeEditor();
    const url = readWith(
      editor,
      () => {
        const root = $getRoot();
        const para = $createParagraphNode();
        para.append($createTextNode('hi'));
        root.append(para);
        $setSelection(null);
      },
      () => getUrlFromSelection($getSelection()),
    );
    expect(url).toBeNull();
  });
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

  it('passes through tel: URLs', () => {
    expect(sanitizeUrl('tel:+1-800-555-0100')).toBe('tel:+1-800-555-0100');
  });

  it('prefixes bare hostnames with https://', () => {
    expect(sanitizeUrl('example.com')).toBe('https://example.com');
  });

  it('prefixes hostnames with paths', () => {
    expect(sanitizeUrl('example.com/foo')).toBe('https://example.com/foo');
  });

  it('accepts hostnames with ports', () => {
    expect(sanitizeUrl('example.com:8080')).toBe('https://example.com:8080');
  });

  it('accepts localhost with a port', () => {
    expect(sanitizeUrl('localhost:3000')).toBe('https://localhost:3000');
  });

  it('preserves http URLs with ports unchanged', () => {
    expect(sanitizeUrl('http://localhost:3000/path')).toBe(
      'http://localhost:3000/path',
    );
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
  beforeEach(() => {
    stubSelectionRect();
  });

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

  it('shows a validation error and keeps the popover open for invalid URLs', async () => {
    const onDispatch = jest.fn();
    const onClose = jest.fn();
    const { getByLabelText, getByRole, queryByRole } = render(
      <Harness isOpen onDispatch={onDispatch} onClose={onClose} />,
    );
    const input = getByLabelText('Link URL') as HTMLInputElement;
    await act(async () => {
      // eslint-disable-next-line no-script-url
      fireEvent.change(input, { target: { value: 'javascript:alert(1)' } });
      await userEvent.click(getByLabelText('Apply Link'));
    });

    expect(onDispatch).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    expect(getByRole('alert')).toHaveTextContent(/valid URL/i);
    expect(input).toHaveAttribute('aria-invalid', 'true');

    // Typing again clears the error
    await act(async () => {
      fireEvent.change(input, { target: { value: 'https://ok.com' } });
    });
    expect(queryByRole('alert')).not.toBeInTheDocument();
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

  it('does not close on right-click outside (browser context menu / paste)', async () => {
    const onClose = jest.fn();
    render(<Harness isOpen onClose={onClose} />);
    await act(async () => {
      fireEvent.mouseDown(document.body, { button: 2 });
    });
    expect(onClose).not.toHaveBeenCalled();
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
