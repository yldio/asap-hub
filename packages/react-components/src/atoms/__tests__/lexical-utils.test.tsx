import {
  $createParagraphNode,
  $createRangeSelection,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $setSelection,
  createEditor,
  LexicalEditor,
} from 'lexical';

import { getSelectedNode } from '../lexical-utils';

const makeEditor = (): LexicalEditor => {
  const editor = createEditor({
    namespace: 'lexical-utils-test',
    // eslint-disable-next-line no-console
    onError: console.error,
  });
  const root = document.createElement('div');
  root.contentEditable = 'true';
  document.body.appendChild(root);
  editor.setRootElement(root);
  return editor;
};

type SetupResult = { firstKey: string; secondKey: string };

const seedTwoTextNodes = (editor: LexicalEditor): SetupResult => {
  let firstKey = '';
  let secondKey = '';
  editor.update(
    () => {
      const root = $getRoot();
      const para = $createParagraphNode();
      const a = $createTextNode('alpha');
      // Bold the second node so Lexical does not coalesce it with the first
      // (adjacent text nodes with matching format are merged on commit).
      const b = $createTextNode('beta').toggleFormat('bold');
      para.append(a);
      para.append(b);
      root.append(para);
      firstKey = a.getKey();
      secondKey = b.getKey();
    },
    { discrete: true },
  );
  return { firstKey, secondKey };
};

const readSelectedNodeText = (editor: LexicalEditor): string => {
  let text = '';
  editor.getEditorState().read(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection))
      throw new Error('expected range selection');
    text = getSelectedNode(selection).getTextContent();
  });
  return text;
};

describe('getSelectedNode', () => {
  it('returns the common node when anchor and focus are on the same node', () => {
    const editor = makeEditor();
    const { firstKey } = seedTwoTextNodes(editor);

    editor.update(
      () => {
        const selection = $createRangeSelection();
        selection.anchor.set(firstKey, 0, 'text');
        selection.focus.set(firstKey, 'alpha'.length, 'text');
        $setSelection(selection);
      },
      { discrete: true },
    );

    expect(readSelectedNodeText(editor)).toBe('alpha');
  });

  it('returns the focus node for a forward selection that does not end at a node boundary', () => {
    const editor = makeEditor();
    const { firstKey, secondKey } = seedTwoTextNodes(editor);

    // Forward selection: anchor in "alpha" mid-node, focus mid "beta".
    // anchor is NOT at node end => helper should return focusNode ("beta").
    editor.update(
      () => {
        const selection = $createRangeSelection();
        selection.anchor.set(firstKey, 1, 'text');
        selection.focus.set(secondKey, 2, 'text');
        $setSelection(selection);
      },
      { discrete: true },
    );

    expect(readSelectedNodeText(editor)).toBe('beta');
  });

  it('returns the anchor node for a forward selection that starts at the anchor node end', () => {
    const editor = makeEditor();
    const { firstKey, secondKey } = seedTwoTextNodes(editor);

    // Anchor sits at the end of "alpha"; helper should return anchorNode.
    editor.update(
      () => {
        const selection = $createRangeSelection();
        selection.anchor.set(firstKey, 'alpha'.length, 'text');
        selection.focus.set(secondKey, 2, 'text');
        $setSelection(selection);
      },
      { discrete: true },
    );

    expect(readSelectedNodeText(editor)).toBe('alpha');
  });

  it('returns the focus node for a backward selection that does not end at a node boundary', () => {
    const editor = makeEditor();
    const { firstKey, secondKey } = seedTwoTextNodes(editor);

    // Backward selection: anchor mid "beta", focus mid "alpha".
    // focus is NOT at node end => helper should return focusNode ("alpha").
    editor.update(
      () => {
        const selection = $createRangeSelection();
        selection.anchor.set(secondKey, 2, 'text');
        selection.focus.set(firstKey, 1, 'text');
        $setSelection(selection);
      },
      { discrete: true },
    );

    expect(readSelectedNodeText(editor)).toBe('alpha');
  });

  it('returns the anchor node for a backward selection where the focus is at the focus node end', () => {
    const editor = makeEditor();
    const { firstKey, secondKey } = seedTwoTextNodes(editor);

    // Backward: anchor mid "beta", focus at end of "alpha".
    // focus IS at node end => helper should return anchorNode ("beta").
    editor.update(
      () => {
        const selection = $createRangeSelection();
        selection.anchor.set(secondKey, 2, 'text');
        selection.focus.set(firstKey, 'alpha'.length, 'text');
        $setSelection(selection);
      },
      { discrete: true },
    );

    expect(readSelectedNodeText(editor)).toBe('beta');
  });
});
