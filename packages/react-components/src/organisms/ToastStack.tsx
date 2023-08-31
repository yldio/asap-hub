import { ReactNode, useState, useCallback } from 'react';
import { ToastContext } from '@asap-hub/react-context';
import { css } from '@emotion/react';

import Toast, { ToastAccents } from './Toast';

const styles = css({
  height: '100%',
  overflow: 'hidden',
  display: 'grid',
  gridTemplateRows: 'fit-content(50%) 1fr',
});

interface ToastStackProps {
  children: ReactNode;
}
const ToastStack: React.FC<ToastStackProps> = ({ children }) => {
  const [accent, setAccent] = useState<ToastAccents>();
  const [toastNodes, setToastNodes] = useState<ReadonlyArray<ReactNode>>([]);
  const toast = useCallback((node: ReactNode, accent?: ToastAccents) => {
    if (accent) {
      setAccent(accent);
    }
    setToastNodes((currToastNodes) =>
      node ? [...new Set([...currToastNodes, node])] : [],
    );
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      <div css={styles}>
        <div role="region" aria-live="polite" css={{ overflowY: 'auto' }}>
          <ol css={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {toastNodes.map((toastNode, index) => (
              <li key={index}>
                <Toast
                  accent={accent}
                  onClose={() =>
                    setToastNodes(toastNodes.filter((_, i) => i !== index))
                  }
                >
                  {toastNode}
                </Toast>
              </li>
            ))}
          </ol>
        </div>
        <div
          css={{
            overflowY: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export default ToastStack;
