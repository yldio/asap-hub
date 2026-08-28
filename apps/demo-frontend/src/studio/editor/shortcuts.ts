// The shortcut itself takes either modifier, so only the name of it follows the
// platform. Nothing in the editor said these existed at all.
const onApple = (): boolean =>
  typeof navigator !== 'undefined' &&
  /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

export const undoHint = onApple() ? 'Cmd+Z' : 'Ctrl+Z';
export const redoHint = onApple() ? 'Cmd+Shift+Z' : 'Ctrl+Shift+Z';
