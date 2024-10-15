import { act, fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TextEditor from '../TextEditor';

describe('TextEditorToolbar', () => {
  describe('actions', () => {
    const onChange = jest.fn();

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
        userEvent.click(editor);
        userEvent.tab();
        fireEvent.input(editor, { data: 'text' });
        userEvent.tab();
      });

      await act(async () => {
        await userEvent.click(getByLabelText('Undo'));
      });

      await act(async () => {
        await userEvent.click(getByLabelText('Redo'));
      });

      expect(onChange.mock.calls).toEqual([
        [''],
        ['**text**'],
        ['**text**'],
        [''],
        [''],
        ['**text**'],
      ]);
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

          userEvent.click(editor);
          userEvent.tab();
          fireEvent.input(editor, { data: 'text' });
          userEvent.tab();
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

          userEvent.click(editor);
          userEvent.tab();
          fireEvent.input(editor, { data: 'text' });
          userEvent.tab();
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

          userEvent.click(editor);
          userEvent.tab();
          fireEvent.input(editor, { data: 'text' });
          userEvent.tab();
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

          userEvent.click(editor);
          userEvent.tab();
          fireEvent.input(editor, { data: 'text' });
          userEvent.tab();
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

          userEvent.click(editor);
          userEvent.tab();
          fireEvent.input(editor, { data: 'text' });
          userEvent.tab();
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
          userEvent.click(editor);
          userEvent.tab();
          fireEvent.input(editor, { data: 'text' });
          userEvent.tab();
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
