import { css } from '@emotion/react';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { getSelectedNode } from './TextEditorToolbar';

const editorContainerStyles = css({
  position: 'absolute',
  zIndex: 10,
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  padding: '6px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

const inputStyles = css({
  border: '1px solid #ddd',
  borderRadius: '4px',
  padding: '6px 8px',
  fontSize: '14px',
  outline: 'none',
  minWidth: '240px',
});

const buttonStyles = css({
  border: '0',
  background: 'transparent',
  cursor: 'pointer',
  padding: '6px 10px',
  borderRadius: '4px',
  fontSize: '13px',
  '&:hover': {
    background: 'rgba(223, 232, 250, 0.6)',
  },
});

const linkPreviewStyles = css({
  fontSize: '13px',
  maxWidth: '300px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: 'rgb(33, 111, 219)',
});

const sanitizeUrl = (url: string): string => {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed)) {
    return trimmed;
  }
  if (/^[\w-]+(\.[\w-]+)+/.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

export type FloatingLinkEditorProps = {
  isOpen: boolean;
  initialUrl: string;
  onClose: () => void;
};

const FloatingLinkEditor = ({
  isOpen,
  initialUrl,
  onClose,
}: FloatingLinkEditorProps) => {
  const [editor] = useLexicalComposerContext();
  const editorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl);
  const [isEditing, setIsEditing] = useState(!initialUrl);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    setUrl(initialUrl);
    setIsEditing(!initialUrl);
  }, [initialUrl, isOpen]);

  const updatePosition = useCallback(() => {
    const nativeSelection = window.getSelection();
    if (!nativeSelection || nativeSelection.rangeCount === 0) {
      setPosition(null);
      return;
    }
    const domRange = nativeSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      setPosition(null);
      return;
    }
    setPosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
    });
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return undefined;
    updatePosition();
    const handler = () => updatePosition();
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler, true);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler, true);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return undefined;
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          // Refresh URL state when selection moves to another link
          editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              const node = getSelectedNode(selection);
              const parent = node.getParent();
              if ($isLinkNode(parent)) {
                setUrl(parent.getURL());
              } else if ($isLinkNode(node)) {
                setUrl(node.getURL());
              }
            }
          });
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, isOpen]);

  useEffect(() => {
    if (isOpen && isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isOpen, isEditing]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleClickOutside = (e: MouseEvent) => {
      if (editorRef.current && !editorRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen || !position) return null;

  const applyLink = () => {
    const sanitized = sanitizeUrl(url);
    if (sanitized) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitized);
    }
    onClose();
  };

  const removeLink = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyLink();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return createPortal(
    <div
      ref={editorRef}
      css={editorContainerStyles}
      style={{ top: position.top, left: position.left }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {isEditing ? (
        <>
          <input
            ref={inputRef}
            css={inputStyles}
            type="text"
            value={url}
            placeholder="https://example.com"
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Link URL"
          />
          <button
            type="button"
            css={buttonStyles}
            onClick={applyLink}
            aria-label="Apply Link"
          >
            Apply
          </button>
        </>
      ) : (
        <>
          <a
            href={sanitizeUrl(url)}
            target="_blank"
            rel="noopener noreferrer"
            css={linkPreviewStyles}
          >
            {url}
          </a>
          <button
            type="button"
            css={buttonStyles}
            onClick={() => setIsEditing(true)}
            aria-label="Edit Link"
          >
            Edit
          </button>
          <button
            type="button"
            css={buttonStyles}
            onClick={removeLink}
            aria-label="Remove Link"
          >
            Remove
          </button>
        </>
      )}
    </div>,
    document.body,
  );
};

export default FloatingLinkEditor;
