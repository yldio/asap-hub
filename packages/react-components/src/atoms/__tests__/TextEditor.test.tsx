import { act, fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TextEditor from '../TextEditor';

// Suppress React 18 act() warnings from Lexical editor's async state updates
// Lexical's internal event loop triggers state updates via microtasks that run
// outside of act() wrappers in jsdom's async context.
// See: https://react.dev/reference/react/act#troubleshooting
let consoleSpy: jest.SpyInstance;

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
    // Allow other console.error calls to pass through
    // eslint-disable-next-line no-console
    console.warn(msg);
  });
});

afterEach(() => {
  consoleSpy.mockRestore();
});

describe('EnablePlugin', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('allows edits when editable', async () => {
    const { getByTestId } = render(
      <TextEditor onChange={onChange} value="" enabled={true} />,
    );
    const editor = getByTestId('editor');
    await act(async () => {
      await userEvent.click(editor);
      await userEvent.tab();
      fireEvent.input(editor, { data: 'text' });
      await userEvent.tab();
    });
    expect(onChange).toHaveBeenCalledWith('text');
  });

  it('block edits when non editable', async () => {
    const { getByTestId } = render(
      <TextEditor onChange={onChange} value="" enabled={false} />,
    );
    const editor = getByTestId('editor');
    await act(async () => {
      await userEvent.click(editor);
      await userEvent.tab();
      fireEvent.input(editor, { data: 'text' });
      await userEvent.tab();
    });
    expect(onChange).toHaveBeenCalledWith('');
  });
});
describe('TextEditorToolbar', () => {
  describe('actions', () => {
    const onChange = jest.fn();
    const onBlur = jest.fn();

    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('undo / redo', async () => {
      const { getByLabelText, getByTestId } = render(
        <TextEditor onChange={onChange} value="" />,
      );
      const editor = getByTestId('editor');

      await act(async () => {
        await userEvent.click(getByLabelText('Format Bold'));
        await userEvent.click(editor);
        await userEvent.tab();
        fireEvent.input(editor, { data: 'text' });
        await userEvent.tab();
      });

      await act(async () => {
        await userEvent.click(getByLabelText('Undo'));
      });

      await act(async () => {
        await userEvent.click(getByLabelText('Redo'));
      });

      // Lexical fires onChange during initialization and focus events
      // The important assertions are: bold text is applied, undo works, redo works
      expect(onChange.mock.calls).toEqual([
        [''], // Focus/initialization events
        [''],
        ['**text**'], // After typing with bold format
        ['**text**'], // Blur event
        [''], // After undo
        [''], // Blur from undo button
        ['**text**'], // After redo
      ]);
    });
    it('calls onBlur if provided', async () => {
      const { getByTestId } = render(
        <TextEditor onChange={onChange} onBlur={onBlur} value="" />,
      );
      const editor = getByTestId('editor');

      await act(async () => {
        await userEvent.click(editor);
        await userEvent.tab();
        fireEvent.input(editor, { data: 'text' });
        await userEvent.tab();
      });

      expect(onBlur).toHaveBeenCalled();
    });

    describe('format', () => {
      it('bold', async () => {
        const { getByLabelText, getByTestId } = render(
          <TextEditor onChange={onChange} value="" />,
        );

        const editor = getByTestId('editor');
        const button = getByLabelText('Format Bold');

        await act(async () => {
          await userEvent.click(button);

          await userEvent.click(editor);
          await userEvent.tab();
          fireEvent.input(editor, { data: 'text' });
          await userEvent.tab();
        });
        expect(onChange).toHaveBeenCalledWith('**text**');
      });

      it('italic', async () => {
        const { getByLabelText, getByTestId } = render(
          <TextEditor onChange={onChange} value="" />,
        );

        const editor = getByTestId('editor');
        const button = getByLabelText('Format Italics');

        await act(async () => {
          await userEvent.click(button);

          await userEvent.click(editor);
          await userEvent.tab();
          fireEvent.input(editor, { data: 'text' });
          await userEvent.tab();
        });
        expect(onChange).toHaveBeenCalledWith('*text*');
      });

      it('strikethrough', async () => {
        const { getByLabelText, getByTestId } = render(
          <TextEditor onChange={onChange} value="" />,
        );

        const editor = getByTestId('editor');
        const button = getByLabelText('Format Strikethrough');

        await act(async () => {
          await userEvent.click(button);

          await userEvent.click(editor);
          await userEvent.tab();
          fireEvent.input(editor, { data: 'text' });
          await userEvent.tab();
        });
        expect(onChange).toHaveBeenCalledWith('~~text~~');
      });
    });

    describe('lists', () => {
      it('unnumbered', async () => {
        const { getByLabelText, getByTestId } = render(
          <TextEditor onChange={onChange} value="" />,
        );

        const editor = getByTestId('editor');
        const button = getByLabelText('Bullet List');

        await act(async () => {
          await userEvent.click(button);

          await userEvent.click(editor);
          await userEvent.tab();
          fireEvent.input(editor, { data: 'text' });
          await userEvent.tab();
        });
        expect(onChange).toHaveBeenCalledWith('- text');

        // removing list
        await act(async () => {
          await userEvent.click(button);
        });
        expect(onChange).toHaveBeenLastCalledWith('text');
      });

      it('numbered', async () => {
        const { getByLabelText, getByTestId } = render(
          <TextEditor onChange={onChange} value="" />,
        );

        const editor = getByTestId('editor');
        const button = getByLabelText('Numbered List');

        await act(async () => {
          await userEvent.click(button);

          await userEvent.click(editor);
          await userEvent.tab();
          fireEvent.input(editor, { data: 'text' });
          await userEvent.tab();
        });
        expect(onChange).toHaveBeenCalledWith('1. text');

        // removing list
        await act(async () => {
          await userEvent.click(button);
        });
        expect(onChange).toHaveBeenLastCalledWith('text');
      });

      it('outdent / indent', async () => {
        const { getByLabelText, getByTestId } = render(
          <TextEditor onChange={onChange} value="" />,
        );

        const editor = getByTestId('editor');

        await act(async () => {
          await userEvent.click(getByLabelText('Bullet List'));
          await userEvent.click(getByLabelText('Indent'));
          await userEvent.click(editor);
          await userEvent.tab();
          fireEvent.input(editor, { data: 'text' });
          await userEvent.tab();
        });
        expect(onChange).toHaveBeenCalledWith('    - text');

        await act(async () => {
          await userEvent.click(getByLabelText('Outdent'));
        });
        expect(onChange).toHaveBeenLastCalledWith('- text');
      });
    });

    describe('link', () => {
      const fakeRect: DOMRect = {
        top: 100,
        left: 50,
        bottom: 120,
        right: 200,
        width: 150,
        height: 20,
        x: 50,
        y: 100,
        toJSON: () => ({}),
      } as DOMRect;
      let originalGetBoundingClientRect: (() => DOMRect) | undefined;
      const stubSelectionRect = () => {
        originalGetBoundingClientRect = (
          Range.prototype as unknown as {
            getBoundingClientRect?: () => DOMRect;
          }
        ).getBoundingClientRect;
        (
          Range.prototype as unknown as { getBoundingClientRect: () => DOMRect }
        ).getBoundingClientRect = () => fakeRect;
      };
      afterEach(() => {
        if (originalGetBoundingClientRect === undefined) {
          delete (
            Range.prototype as unknown as {
              getBoundingClientRect?: () => DOMRect;
            }
          ).getBoundingClientRect;
        } else {
          (
            Range.prototype as unknown as {
              getBoundingClientRect: () => DOMRect;
            }
          ).getBoundingClientRect = originalGetBoundingClientRect;
        }
      });

      it('renders the Insert Link toolbar button', () => {
        const { getByLabelText } = render(
          <TextEditor onChange={onChange} value="" />,
        );
        expect(getByLabelText('Insert Link')).toBeInTheDocument();
      });

      it('renders markdown links from initial value', () => {
        const { getByTestId } = render(
          <TextEditor
            onChange={onChange}
            value="see [example](https://example.com)"
          />,
        );
        expect(getByTestId('editor')).toHaveTextContent('see example');
      });

      it('opens the floating editor when text is selected and Insert Link is clicked', async () => {
        stubSelectionRect();
        const { getByLabelText, getByTestId, queryByLabelText } = render(
          <TextEditor onChange={onChange} value="hello world" />,
        );

        // Place a non-collapsed Lexical selection over the existing text
        await act(async () => {
          const { editorRef } = await import('../EditorRefPluginWrapper');
          const lexical = await import('lexical');
          editorRef.current?.update(() => {
            const root = lexical.$getRoot();
            const textNode = root.getFirstDescendant();
            if (textNode && lexical.$isTextNode(textNode)) {
              textNode.select(0, textNode.getTextContentSize());
            }
          });
        });

        // Make sure the editor used for the toolbar selection lookup is the
        // one that just had its selection set.
        getByTestId('editor');

        await act(async () => {
          await userEvent.click(getByLabelText('Insert Link'));
        });

        expect(queryByLabelText('Link URL')).toBeInTheDocument();
      });

      it('reopens the floating editor in view mode when selection sits inside an existing link', async () => {
        stubSelectionRect();
        const { getByLabelText, queryByLabelText } = render(
          <TextEditor
            onChange={onChange}
            value="see [example](https://example.com)"
          />,
        );

        await act(async () => {
          const { editorRef } = await import('../EditorRefPluginWrapper');
          const lexical = await import('lexical');
          const linkModule = await import('@lexical/link');
          editorRef.current?.update(() => {
            const links = lexical.$nodesOfType(linkModule.LinkNode);
            const first = links[0];
            if (first) {
              const child = first.getFirstDescendant();
              if (child && lexical.$isTextNode(child)) {
                child.select(0, child.getTextContentSize());
              }
            }
          });
        });

        await act(async () => {
          await userEvent.click(getByLabelText('Insert Link'));
        });

        expect(queryByLabelText('Edit Link')).toBeInTheDocument();
        expect(queryByLabelText('Remove Link')).toBeInTheDocument();
      });

      it('updates the popover URL when the Lexical selection moves to another link', async () => {
        stubSelectionRect();
        const { getByLabelText, queryByText } = render(
          <TextEditor
            onChange={onChange}
            value="see [first](https://first.com) and [second](https://second.com)"
          />,
        );

        const { editorRef } = await import('../EditorRefPluginWrapper');
        const lexical = await import('lexical');
        const linkModule = await import('@lexical/link');

        const selectLinkAt = async (index: number) => {
          await act(async () => {
            editorRef.current?.update(() => {
              const root = lexical.$getRoot();
              const links: InstanceType<typeof linkModule.LinkNode>[] = [];
              root.getChildren().forEach((para) => {
                if ('getChildren' in para) {
                  (para as { getChildren: () => unknown[] })
                    .getChildren()
                    .forEach((node) => {
                      if (linkModule.$isLinkNode(node as never)) {
                        links.push(
                          node as InstanceType<typeof linkModule.LinkNode>,
                        );
                      }
                    });
                }
              });
              const child = links[index]?.getFirstDescendant();
              if (child && lexical.$isTextNode(child)) {
                child.select(0, child.getTextContentSize());
              }
            });
          });
          // Lexical fires SELECTION_CHANGE_COMMAND on the next microtask after
          // the update commits; flush by yielding once.
          await act(async () => {
            await Promise.resolve();
            editorRef.current?.dispatchCommand(
              lexical.SELECTION_CHANGE_COMMAND,
              undefined,
            );
          });
        };

        await selectLinkAt(0);
        await act(async () => {
          await userEvent.click(getByLabelText('Insert Link'));
        });

        // The popover is now open. Drive the SELECTION_CHANGE listener by
        // moving Lexical selection between the two links and asserting that
        // the popover URL tracks the current link.
        await selectLinkAt(0);
        expect(queryByText('https://first.com')).toBeInTheDocument();
        await selectLinkAt(1);
        expect(queryByText('https://second.com')).toBeInTheDocument();
        await selectLinkAt(0);
        expect(queryByText('https://first.com')).toBeInTheDocument();
      });

      it('closes the floating editor when clicking outside after opening', async () => {
        stubSelectionRect();
        const { getByLabelText, queryByLabelText } = render(
          <TextEditor onChange={onChange} value="hello world" />,
        );

        await act(async () => {
          const { editorRef } = await import('../EditorRefPluginWrapper');
          const lexical = await import('lexical');
          editorRef.current?.update(() => {
            const root = lexical.$getRoot();
            const textNode = root.getFirstDescendant();
            if (textNode && lexical.$isTextNode(textNode)) {
              textNode.select(0, textNode.getTextContentSize());
            }
          });
        });

        await act(async () => {
          await userEvent.click(getByLabelText('Insert Link'));
        });
        expect(queryByLabelText('Link URL')).toBeInTheDocument();

        await act(async () => {
          fireEvent.mouseDown(document.body);
        });
        expect(queryByLabelText('Link URL')).not.toBeInTheDocument();
      });

      it('does not open the floating editor when nothing is selected', async () => {
        const { getByLabelText, queryByLabelText } = render(
          <TextEditor onChange={onChange} value="hello" />,
        );

        await act(async () => {
          await userEvent.click(getByLabelText('Insert Link'));
        });

        expect(queryByLabelText('Link URL')).not.toBeInTheDocument();
      });
    });
  });
});
