import { useEffect, ReactNode } from 'react';
import { useHistory } from 'react-router-dom';

interface RouterPromptProps {
  when: boolean;
  message: string;
  pattern: string;
  children: ReactNode;
}
export function RouterPrompt({
  when,
  pattern,
  message,
  children,
}: RouterPromptProps) {
  const history = useHistory();

  useEffect(() => {
    if (when) {
      history.block((nextLocation) => {
        const isBlockedRoute =
          nextLocation.pathname.match(new RegExp(pattern)) !== null;

        if (isBlockedRoute) window.alert(message);
        return undefined;
      });
    }
  }, [history, when, message, pattern]);

  return <>{children}</>;
}

export default RouterPrompt;
