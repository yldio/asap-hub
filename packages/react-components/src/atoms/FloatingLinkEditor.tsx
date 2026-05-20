import { css } from '@emotion/react';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  BaseSelection,
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

import { silver } from '../colors';
import { getSelectedNode } from './lexical-utils';

const editorContainerStyles = css({
  position: 'absolute',
  zIndex: 10,
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  padding: '6px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '4px',
});

const inputColumnStyles = css({
  display: 'flex',
  flexDirection: 'column',
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

const inputErrorStyles = css({
  borderColor: '#d6453d',
});

const errorStyles = css({
  color: '#d6453d',
  fontSize: '12px',
  maxWidth: '300px',
});

const buttonStyles = css({
  border: '0',
  background: 'transparent',
  cursor: 'pointer',
  padding: '6px 10px',
  borderRadius: '4px',
  fontSize: '13px',
  '&:hover': {
    background: silver.rgb,
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

const SAFE_URL_PATTERN = /^(?:https?:\/\/|mailto:|tel:)/i;
const UNSAFE_SCHEME_PATTERN = /^(?:javascript|data|vbscript|file):/i;
const HAS_SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:/i;
// Bare hostname (with optional port and path), or localhost with optional port
const BARE_URL_PATTERN =
  /^(?:[\w-]+(?:\.[\w-]+)+|localhost)(?::\d+)?(?:[/?#].*)?$/i;

export const getUrlFromSelection = (
  selection: BaseSelection | null,
): string | null => {
  if (!$isRangeSelection(selection)) return null;
  const node = getSelectedNode(selection);
  const parent = node.getParent();
  if ($isLinkNode(parent)) return parent.getURL();
  if ($isLinkNode(node)) return node.getURL();
  return null;
};

export const sanitizeUrl = (url: string): string => {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (UNSAFE_SCHEME_PATTERN.test(trimmed)) {
    return '';
  }
  if (SAFE_URL_PATTERN.test(trimmed)) {
    return trimmed;
  }
  // Match bare hostnames (e.g. example.com, example.com:8080, localhost:3000)
  // before falling into the scheme check, since "example.com:8080" otherwise
  // looks like an unknown scheme due to the colon.
  if (BARE_URL_PATTERN.test(trimmed)) {
    return `https://${trimmed}`;
  }
  if (HAS_SCHEME_PATTERN.test(trimmed)) {
    // Reject any scheme we don't explicitly recognize as safe
    return '';
  }
  return '';
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
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    setUrl(initialUrl);
    setIsEditing(!initialUrl);
    setError(null);
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
          editor.getEditorState().read(() => {
            const next = getUrlFromSelection($getSelection());
            if (next !== null) setUrl(next);
          });
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, isOpen]);

  useEffect(() => {
    if (isOpen && isEditing && position) {
      const id = window.requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
      return () => window.cancelAnimationFrame(id);
    }
    return undefined;
  }, [isOpen, isEditing, position]);

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
    const trimmed = url.trim();
    if (!trimmed) {
      // Empty input — treat as a cancel rather than a validation failure
      onClose();
      return;
    }
    const sanitized = sanitizeUrl(trimmed);
    if (!sanitized) {
      setError('Please enter a valid URL (http://, https://, mailto:, tel:).');
      return;
    }
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitized);
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
      onMouseDown={(e) => {
        if (e.target !== inputRef.current) {
          e.preventDefault();
        }
      }}
    >
      {isEditing ? (
        <>
          <div css={inputColumnStyles}>
            <input
              ref={inputRef}
              css={[inputStyles, error ? inputErrorStyles : undefined]}
              type="text"
              value={url}
              placeholder="https://example.com"
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={handleKeyDown}
              aria-label="Link URL"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'link-url-error' : undefined}
            />
            {error && (
              <div id="link-url-error" role="alert" css={errorStyles}>
                {error}
              </div>
            )}
          </div>
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
