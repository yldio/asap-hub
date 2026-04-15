import { createContext, useContext } from 'react';

export const ScrollContext = createContext<{
  scrollToTop: (options?: ScrollToOptions) => void;
}>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  scrollToTop: () => {},
});

export const useScrollToTop = () => useContext(ScrollContext);
