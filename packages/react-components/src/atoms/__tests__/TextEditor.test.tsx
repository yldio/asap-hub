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
  });
});
